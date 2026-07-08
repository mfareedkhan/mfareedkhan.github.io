---
layout: page
title: research
permalink: /research/
nav: true
nav_order: 2
description: Efficient, deployable AI for resource-constrained settings — method identity and application domain.
---

## Research statement

My research identity is **making advanced AI deployable where it is normally out of reach**: efficient, on-premise, privacy-preserving models that fit onto modest hardware while respecting real-world data constraints.

I develop and adapt **small vision–language models and language models** using **parameter-efficient fine-tuning** (QLoRA/LoRA), **quantization**, **multimodal fusion**, and **transfer learning**. The goal throughout is the same: clinically or practically useful systems that do not require high-end infrastructure, so that the people and institutions who most need them can actually run them.

I frame this work at two levels. At the **method level** — broad and domain-agnostic — the contribution is efficient, deployable AI under real-world constraints: PEFT, quantization, small/edge models, multimodal fusion, and trustworthy, ethically governed systems, supported by rigorous systematic evidence synthesis. At the **application level**, healthcare and low-resource-language AI are my primary proving ground: on-premise, privacy-preserving clinical decision support and NLP for languages with no large labelled corpora. Healthcare is where I demonstrate the methods; it is not their ceiling.

I also care about the *governance* side of deployable AI. My published systematic review maps the ethical risks of large language models in medicine and proposes a framework for integrating regulatory, technical, human-oversight, and transparency safeguards — because a model is only truly deployable if it is also safe and accountable.

## Research areas

Multimodal AI for medicine &middot; Vision–Language Models (VLMs) &middot; Large Language Models (LLMs) &middot; Parameter-Efficient Fine-Tuning (QLoRA / LoRA) &middot; Quantization &middot; Transfer Learning &middot; NLP &middot; Computer Vision &middot; Generative AI &middot; Efficient / privacy-preserving deployable AI &middot; Systematic evidence synthesis (PRISMA 2020, Kitchenham & Charters).

## Thesis — CXRG-SVLM

**Retrieval-Augmented, Parameter-Efficient Fine-Tuning of a Vision–Language Model for Chest X-ray Report Generation.** Supervisor: Dr. Jamal Uddin.

In plain terms: a small vision–language model that reads chest X-rays and drafts the radiology report, designed to run **on a single consumer GPU inside a hospital** — no cloud, no patient data leaving the building.

The system pairs a frozen RAD-DINO image encoder with a 4-bit quantized Qwen2.5-3B-Instruct language model, adapted with **4-bit QLoRA that trains just 0.97% of parameters** (38.1M of 3.9B). A multi-view fusion module combines frontal and lateral radiographs and queries them through a continuous latent retrieval mechanism, which reduces hallucination compared with retrieving discrete historical text.

**Headline results (Indiana University Chest X-ray dataset):** the system reaches ROUGE-L **0.3116** and METEOR **0.2530**, surpassing established baselines such as **R2Gen** — while training only **0.97% of parameters**, running at **7.8 seconds per report on a single 16 GB GPU.** Those last two numbers are the point: state-of-the-art-adjacent quality on hardware a hospital can actually afford.

**Honest limitations** (stated because they matter): the evaluation uses a single-center dataset; detection of subtle or underrepresented findings such as cardiomegaly and pulmonary edema is weaker; and the multi-view setup relies on paired frontal/lateral views.

This work is under review at *Scientific Reports*. Full publication details are on the [Publications](/publications/) page.

## Where I want to take this

In a PhD, I want to push efficient multimodal medical AI from single-center demonstrations toward robust, multi-site, deployable systems — improving reliability on rare findings, extending privacy-preserving on-premise training, and keeping trustworthy-AI governance built in rather than bolted on. The methods that make this work in healthcare are the same ones that make AI usable in any resource-constrained setting.
