---
layout: post
title: "PEFT Beyond LoRA: Comparing LoRA, AdaLoRA, IA³, and Prompt-Based Tuning"
date: 2026-05-18 09:00:00
description: LoRA gets most of the attention, but it's one option among several parameter-efficient fine-tuning methods, each with different trade-offs in accuracy, parameter budget, and implementation complexity.
tags: peft lora adalora ia3 prompt-tuning
categories: efficient-ai
giscus_comments: false
related_posts: true
---

LoRA has become something close to a default choice in efficient fine-tuning, and for good reason — it's simple, well-supported, and effective. But treating it as the only option leads to a common mistake: picking LoRA by habit rather than by fit. The parameter-efficient fine-tuning (PEFT) literature has grown into a genuinely diverse toolkit, and the right method depends on your model scale, your task type, and — in resource-constrained settings — how tightly your deployment target limits both trainable and total parameters.

This post walks through the main families of PEFT methods beyond plain LoRA, using results from a benchmark I contributed to on Punjabi sentiment analysis (currently under review at *Computers, Materials & Continua*) as a concrete anchor for what these trade-offs look like in practice, on a genuinely low-resource task rather than a well-studied English benchmark.

## Why "parameter-efficient" isn't one strategy

Full fine-tuning updates every weight in a model. PEFT methods instead update a small subset of parameters, or introduce a small number of new parameters, while keeping the pretrained backbone frozen. But *where* those new parameters go, and *how* they interact with the frozen model, varies a lot between methods — and that variation is what determines their trade-offs.

Broadly, the methods split into two families: **reparameterization methods**, which modify how the model's existing weight matrices are updated (LoRA and its variants), and **prompt-based methods**, which add trainable "virtual tokens" that steer the frozen model's behavior without touching its weights at all (prefix tuning, prompt tuning, P-Tuning).

## Reparameterization methods

**LoRA** decomposes the weight update for a target matrix into two much smaller low-rank matrices. Instead of learning a full update, the model learns a low-rank approximation of it, which is then added to the frozen weights. This is why LoRA's trainable parameter count can be a tiny fraction of the base model's size while still meaningfully changing its behavior.

**AdaLoRA** starts from the same idea but asks a sharper question: does every weight matrix in the network deserve the same rank budget? In practice, different layers and modules contribute unequally to a given downstream task. AdaLoRA allocates the parameter budget dynamically, using singular value decomposition to identify which low-rank increments matter most, and pruning less important ones during training. The result is a more efficient use of a fixed parameter budget — you spend your "capacity" where the task actually needs it rather than spreading it evenly.

**IA³** (Infused Adapter by Inhibiting and Amplifying Inner Activations) takes a different approach again. Rather than learning new weight matrices, it learns a small number of scaling vectors that rescale the model's existing activations — keys, values, and feed-forward activations — at inference time. Because it only learns rescaling factors rather than new matrices, IA³ can achieve performance close to full fine-tuning with a dramatically smaller trainable parameter count, and with essentially no added inference latency, since the scaling can often be folded into the existing weights.

## Prompt-based methods

**Prompt Tuning** keeps the entire pretrained model completely frozen and prepends a small number of trainable "soft prompt" tokens to the input at the embedding layer only. It's the most parameter-efficient method in this comparison by a wide margin, but its effectiveness is closely tied to model scale — it tends to only close the gap with full fine-tuning once the underlying model is quite large (multi-billion parameters), and it can struggle on tasks like sequence labelling.

**Prefix Tuning** extends the same idea more aggressively: instead of only prepending prompt tokens at the input, it prepends trainable vectors to the keys and values at *every* transformer layer, giving the model more opportunities to be steered. To keep training stable, it typically uses a small reparameterization network (an MLP) to generate the prefix vectors rather than optimizing them directly, though this network is discarded after training and only the resulting vectors are kept.

**P-Tuning v2** is best understood as a refinement of prefix tuning aimed specifically at natural language understanding tasks and smaller model scales, where plain prompt tuning underperforms. It applies deep, layer-wise prompts like prefix tuning, but generally removes the reparameterization network, simplifying the setup. In benchmark results, tuning only about 0.1% of parameters with P-Tuning v2 has been shown to match full fine-tuning performance across model scales from 330M to 10B parameters — a notable result given how much smaller that footprint is.

## What this looks like on a real low-resource task

Numbers from published benchmarks are useful, but they mostly come from English tasks with abundant training data. The more informative test is what happens when you apply these methods to a genuinely low-resource setting. In a benchmark for Punjabi sentiment analysis on Multilingual BERT — comparing six PEFT methods against full fine-tuning on 7,519 Devanagari-script reviews — the pattern that emerged was informative:

- **Full fine-tuning** reached about 90% accuracy, updating 100% of parameters.
- **LoRA** reached about 85% accuracy while training only 1.07% of parameters — the best balance of accuracy retained versus parameters spent in this comparison.
- **IA³** reached about 75% accuracy while training just 0.01% of parameters — by far the most resource-efficient configuration, well suited to edge deployment where every trainable parameter has a real memory cost.
- Prompt-based methods underperformed relative to LoRA and IA³ on this task, likely reflecting both the moderate scale of the base model (mBERT) and the difficulty of the underlying classification task in a script with limited representation in the model's pretraining data.

The takeaway isn't "LoRA wins" or "IA³ wins" — it's that the accuracy-versus-parameter-budget curve looks different depending on task difficulty, script/language representation in pretraining, and how much accuracy loss is acceptable for your deployment constraints. If you're building something that needs to run on-device with a hard memory ceiling, IA³'s near-zero footprint and negligible inference overhead can be worth an accuracy trade-off that would be unacceptable in a cloud-hosted setting.

## Choosing a method in practice

A rough decision process that has served me well:

1. **If your model is small-to-mid scale and the task is complex (classification, sequence labelling, generation), start with LoRA.** It has the best track record across task types and the most mature tooling support.
2. **If you're layering fine-tuning on top of an already-quantized model to fit extreme memory constraints, combine LoRA with 4-bit quantization** — this is the QLoRA approach covered in the previous post, and it remains the strongest option when GPU memory, not just trainable parameters, is the bottleneck.
3. **If different layers plausibly matter unequally for your task, AdaLoRA's adaptive budget allocation can extract more performance from the same total parameter count** — worth the added implementation complexity when you're optimizing hard against a fixed budget.
4. **If inference-time latency and footprint are the binding constraint — not just training-time memory — IA³ deserves serious consideration**, particularly for edge and on-device deployment where every added parameter and every millisecond of latency has a direct cost.
5. **Prompt-based methods are worth revisiting once your base model is large enough** (multi-billion parameters) that their parameter efficiency advantage stops costing you accuracy.

None of this replaces running your own ablation on your own task and data — the benchmark numbers above shift meaningfully depending on language, script, domain, and base model architecture. But having a working mental model of *why* these methods differ, rather than picking one by default, makes that ablation process much more targeted.

**Further reading**
- Hu, E. J., et al. (2021). *LoRA: Low-Rank Adaptation of Large Language Models.* arXiv:2106.09685
- Zhang, Q., et al. (2023). *AdaLoRA: Adaptive Budget Allocation for Parameter-Efficient Fine-Tuning.*
- Liu, H., et al. (2022). *Few-Shot Parameter-Efficient Fine-Tuning is Better and Cheaper than In-Context Learning* (IA³).
- Liu, X., et al. (2021). *P-Tuning v2: Prompt Tuning Can Be Comparable to Fine-tuning Universally Across Scales and Tasks.*
