---
layout: post
title: "Model Quantization Explained: From FP32 to 4-bit, and Why It Matters for Edge AI"
date: 2026-06-01 09:00:00
description: A practical walkthrough of INT8, INT4, GPTQ, and AWQ quantization, and how to think about the trade-off between model size, latency, and accuracy when deploying to constrained hardware.
tags: quantization int4 int8 edge-ai deployment
categories: efficient-ai
giscus_comments: false
related_posts: true
---

If you've read about QLoRA or PEFT methods, you've already seen quantization mentioned as a supporting technique. It deserves its own explanation, though, because it's useful far beyond fine-tuning — quantization is one of the primary tools for taking a model that only exists as a research artifact and turning it into something that can actually run on a hospital workstation, an edge device, or a laptop instead of a data-center GPU.

## What quantization actually does

Neural network weights are normally stored as 32-bit floating point numbers (FP32). Each weight takes 4 bytes, so a 7-billion-parameter model needs roughly 28 GB just to store its weights, before accounting for activations, KV cache, or anything else needed at inference time.

Quantization reduces the number of bits used to represent each weight (and sometimes each activation), trading numerical precision for memory and compute savings. Moving from FP32 to INT8 roughly halves memory usage; moving to INT4 cuts it by about 75% relative to FP32. Concretely, a 70B-parameter model that needs 140 GB in FP16 can often be run in around 35 GB with INT4 quantization — the difference between "needs multiple high-end GPUs" and "fits on a single card."

The core mechanic is straightforward: instead of storing each weight as an arbitrary floating-point value, you map the range of values in a tensor onto a small set of discrete levels (256 levels for INT8, 16 for INT4), using a scale factor and often a zero-point to convert between the compressed integer representation and the original range. The hard part is doing this *without* destroying the information the model actually relies on — which is where different quantization methods diverge.

## Post-training quantization vs. quantization-aware training

There are two fundamentally different strategies for getting a quantized model:

**Post-Training Quantization (PTQ)** takes an already-trained, full-precision model and quantizes it afterward, typically using a small calibration dataset to determine good scale factors for each tensor. No retraining is required, which makes PTQ fast — often a matter of minutes rather than days — but it can noticeably degrade accuracy for aggressive quantization levels (4-bit and below), particularly on models with wide or unusual weight distributions.

**Quantization-Aware Training (QAT)** simulates the effects of quantization *during* training, so the model learns weights that are inherently more robust to the precision reduction it will face at deployment. This produces better accuracy at a given bit-width, but it requires access to training data and meaningfully more compute — you're essentially training the model an extra time with quantization effects baked in.

For most practical deployment scenarios — especially when you're adapting an existing open-weight model rather than training from scratch — PTQ combined with a good calibration procedure is the more common and more accessible choice. QAT is worth the extra cost mainly when accuracy at low bit-widths is critical and you already have a training pipeline in place.

## INT8 vs INT4: how far can you push it?

INT8 quantization is well understood and broadly supported across hardware and inference engines, with minimal accuracy loss for most models — it's often treated as close to a "free" optimization for deployment. INT4 is where things get more interesting, and more fragile. Early work found that simple post-training methods degraded meaningfully at 4-bit precision, even as they worked reasonably well at 8-bit. Two methods changed that picture for large language models specifically:

**GPTQ** performs layer-wise quantization using approximate second-order information (derived from the Hessian) to minimize the reconstruction error introduced at each layer, processing one layer at a time rather than the whole model at once. This makes it memory-efficient during the quantization process itself — you can quantize a 70B-parameter model on a single GPU with sufficient VRAM, despite the model never needing to be fully loaded in full precision at once. In terms of inference speedup, the picture is more nuanced than the theoretical 4x reduction in bit-width suggests: on hardware with good native INT4 support, GPTQ-quantized models can see roughly 1.5–2x speedups, with the actual gain depending heavily on batch size, since small-batch inference tends to be memory-bandwidth-bound rather than compute-bound — which is exactly the profile of most edge and single-user deployment scenarios.

**AWQ** (Activation-aware Weight Quantization) takes a different angle: rather than treating all weights as equally important, it identifies a small subset of "salient" weights — those that correspond to large-magnitude activations — and protects them from quantization error, since a small number of outlier channels can disproportionately affect model output. Profiling on realistic edge-style settings (batch size 1) shows that generation-phase inference is heavily memory-bound, which is exactly the regime where reducing weight precision translates most directly into real speedups rather than just memory savings.

In practice, for deploying a small language model on constrained hardware — the kind of scenario where latency for single-user, batch-size-one workloads matters more than raw throughput — a common configuration is W4A16: 4-bit weights combined with 16-bit activations, which strikes a workable balance between memory footprint and numerical stability during inference.

## Where this fits into deployable AI

Quantization is rarely used in isolation. In my own work building small vision-language models for resource-constrained settings, the combination that has proven most effective is: a frozen, already-efficient image or text encoder, 4-bit quantization of the base model's weights, and parameter-efficient adapters (LoRA/QLoRA) trained on top to specialize the model for the target task — the same three-part recipe used in a chest X-ray report generation model I built, where the entire pipeline runs inference in under 8 seconds per report on a single 16 GB consumer GPU. That number matters clinically, not just academically: it's the difference between a model that stays a research demo and one a resource-constrained clinic could plausibly run on hardware it already owns, without shipping patient data to an external cloud service — a genuine consideration for healthcare deployments operating under HIPAA/GDPR-style privacy constraints.

## A practical checklist

If you're deciding how to quantize a model for deployment, a few questions are worth working through in order:

1. **What's your hard memory ceiling?** This determines whether INT8 is sufficient or you need to push to INT4.
2. **Is your workload batch-size-1 (edge, single-user) or high-throughput (server, many concurrent users)?** Memory-bandwidth-bound workloads (the former) benefit more directly from aggressive quantization than compute-bound ones.
3. **Do you have a representative calibration set?** PTQ quality depends heavily on how well your calibration data reflects real deployment inputs — a calibration set that doesn't match production data can quietly produce a model that looks fine in testing and degrades in practice.
4. **Can you tolerate a small accuracy trade-off for a large memory win?** If the task is safety- or clinically-critical, this is where QAT or a more conservative bit-width (8-bit rather than 4-bit) is worth the extra cost.
5. **Are you also fine-tuning?** If so, look at QLoRA-style approaches that combine quantization and adaptation in a single, coherent training recipe rather than quantizing after the fact.

Quantization won't make an under-trained or poorly designed model good. What it does is take a model that already works and make it *deployable* — and for anyone building AI systems meant to run somewhere other than a well-funded cloud cluster, that step is not optional.

**Further reading**
- Frantar, E., et al. (2023). *GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers.*
- Lin, J., et al. (2023). *AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration.*
- Dettmers, T., et al. (2023). *QLoRA: Efficient Finetuning of Quantized LLMs.* arXiv:2305.14314
