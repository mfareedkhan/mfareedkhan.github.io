---
layout: post
title: "Deploying Vision-Language Models for Clinical Report Generation"
date: 2026-06-08 09:00:00
description: What it actually takes to build a vision-language model that can draft a chest X-ray report — and why hallucination, not raw accuracy, is the problem that determines whether it's safe to use.
tags: vision-language-models radiology healthcare deployment
categories: healthcare-ai
giscus_comments: false
related_posts: true
---

Radiology report generation is one of the most-studied applications of vision-language models (VLMs) in medicine, and it's easy to see why: a chest X-ray is one of the most common imaging exams performed worldwide, radiologist time is a genuine bottleneck in many healthcare systems, and the task has a natural, well-defined output — a structured text report describing findings. It's also a task where the gap between "the model produces plausible-sounding text" and "the model produces text a radiologist should trust" is enormous, and closing that gap is most of the actual engineering work.

This post walks through how automated chest X-ray report generation systems are built, why they fail in specific, predictable ways, and what I learned building one as part of my MS thesis — a parameter-efficient small VLM currently under review at *Scientific Reports*.

## The basic architecture

Most modern radiology report generation systems share a common shape: an **image encoder** processes the X-ray into a set of visual features, and a **language model** — increasingly, a general-purpose or lightly-adapted large language model rather than a bespoke architecture — generates the report text conditioned on those visual features. Early systems were purpose-built encoder-decoder architectures; the current generation of systems increasingly leans on large, pretrained vision-language models, sometimes combined with retrieval or knowledge-grounding components to reduce factual errors.

The version I built for chest X-ray report generation follows this pattern with two deliberate constraints: the image encoder (a frozen RAD-DINO model, pretrained specifically on radiology images) stays frozen throughout, and the language model — a 4-bit quantized Qwen2.5-3B-Instruct — is adapted with QLoRA rather than fully fine-tuned, training only about 38 million of the model's 3.9 billion parameters. That's a deliberate trade-off: a larger, fully fine-tuned model might edge out marginally better metrics in isolation, but it wouldn't run on the hardware most radiology departments — particularly outside major research hospitals — actually have available.

## The problem that matters most: hallucination

The single biggest obstacle to clinical trust in these systems isn't raw fluency — modern language models are extremely good at producing text that *reads* like a radiology report. The problem is that they can produce findings, measurements, or comparisons that aren't actually supported by the image, a failure mode generally called visual hallucination. This happens for a specific, somewhat counterintuitive reason: these models are often trained on enormous amounts of text-heavy medical data, and during generation they can lean on learned statistical patterns in *language* — what findings tend to co-occur in real reports — rather than performing genuine, grounded reasoning about the specific image in front of them.

A concrete example that shows up repeatedly in the literature: cardiomegaly (an enlarged heart) and pulmonary edema (fluid in the lungs) frequently co-occur in congestive heart failure. A model that has learned this correlation strongly from training data may predict pulmonary edema whenever it detects cardiomegaly, even when the actual image shows no edema. This is exactly the kind of error that looks clinically fluent and is actually dangerous, because it's not an obviously nonsensical sentence — it's a plausible clinical inference that happens to be wrong for this specific patient.

There's also a narrower but very concrete failure mode around **quantitative measurements** — things like the size of a nodule or the distance from an endotracheal tube to the carina. These numbers matter a great deal clinically (many reporting guidelines and clinical decisions rely on precise measurements), and general-purpose VLMs are often not well-suited to producing them reliably, since measurement requires a kind of precise spatial reasoning that differs from the pattern-matching that drives most of a language model's fluency.

## What's being done about it

A few complementary strategies have emerged to address hallucination specifically, rather than just chasing overall benchmark scores:

- **Retrieval-augmented generation (RAG).** Rather than generating a report purely from the current image, the system retrieves similar historical cases or reports and uses them to ground the generated text in verified external information, rather than only the model's own internal, potentially unreliable associations.
- **Multimodal fusion across views.** A single frontal X-ray leaves genuine ambiguity — findings that are subtle or occluded on one projection can be clearer on a lateral view. Fusing information across multiple views before generation (the focus of the next post in this series) reduces the amount of guessing the model has to do.
- **Contrastive decoding methods.** Newer approaches keep the generation process anchored more tightly to the image as the report grows longer, specifically targeting the tendency for models to drift toward relying on their own prior output rather than re-checking the image as generation proceeds.
- **Domain-specific evaluation metrics.** Standard natural-language-generation metrics (ROUGE, BLEU) measure textual overlap with a reference report, but they don't measure clinical correctness — a report can score reasonably on ROUGE while still containing a dangerous factual error, or vice versa. Clinical-entity-level metrics that specifically check whether the *findings* mentioned are correct — not just whether the sentence structure resembles a real report — are a necessary complement.

In evaluating my own thesis model, this is why the reported numbers include both standard NLG metrics (ROUGE-L of 0.3116, METEOR of 0.2530) *and* a macro-averaged clinical entity F1 score (0.4867), with per-finding breakdowns — normal findings at 0.9758, pleural effusion at 0.8474, pneumothorax at 0.8059 — rather than a single aggregate number. A model that's very good at recognizing "normal" but weaker on rarer or more subtle findings like cardiomegaly or pulmonary edema is a materially different model from one with uniformly strong performance, even if their aggregate scores look similar, and reporting them separately is the only honest way to communicate that.

## Why deployability is part of the clinical problem, not separate from it

It's tempting to treat "make the model clinically accurate" and "make the model deployable on modest hardware" as two separate engineering problems, solved in sequence. In practice, they're the same problem, for a structural reason specific to healthcare AI: the settings where automated report generation would help the most — under-resourced clinics, single-radiologist departments, regions with acute imaging backlogs — are usually the same settings that can't run a cluster of high-end GPUs or send patient imaging data to an external cloud API for privacy and regulatory reasons.

A model that requires enterprise-grade infrastructure to run is, for a large share of the settings that need it most, not actually deployable — regardless of how good its benchmark numbers look. This is the practical reason a small, quantized, QLoRA-adapted model that runs in under 8 seconds per report on a single consumer-grade 16 GB GPU is a more useful research contribution, for this specific problem, than a larger model with marginally better metrics that requires infrastructure most of the intended users don't have.

## Honest limitations

It's worth being direct about where systems like this currently fall short, because overstating results in a clinical context is its own kind of harm. My thesis model was evaluated on a single-center, publicly available dataset (the Indiana University Chest X-ray collection), so its behavior on imaging from different equipment, patient populations, or acquisition protocols hasn't been established. It also shows weaker performance on subtler, underrepresented findings — the same pattern seen across the field — and it was built and evaluated using paired frontal and lateral views only, so it doesn't generalize to single-view studies or other modalities without further work. None of this makes the approach a finished clinical tool; it's a step toward one, and being explicit about the gap between "promising research result" and "clinically deployed system" is part of doing this work responsibly.

**Further reading**
- Bannur, S., et al. (2024). *MAIRA-2: Grounded Radiology Report Generation.*
- Heiman, A., et al. (2024). *FactCheXcker: Mitigating Measurement Hallucinations in Chest X-ray Report Generation Models.*
