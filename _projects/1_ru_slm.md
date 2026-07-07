---
layout: page
title: RU-SLM — Roman Urdu Small Language Model
description: 4-bit QLoRA on an 8B model for conversational NLP in a low-resource language, with ~74% fewer trainable parameters and deployable inference.
importance: 1
category: small language models
github: https://github.com/mfareedkhan
---

**The problem.** Roman Urdu is morphologically complex and low-resource — there are no large labelled corpora to fine-tune on, and most teams have no access to high-end GPUs.

**What I built.** I applied **4-bit QLoRA** to an **8-billion-parameter** model for conversational NLP in Roman Urdu, achieving roughly a **74% reduction in trainable parameters** while preserving deployable inference. The result is a reproducible pipeline aimed squarely at resource-constrained environments.

**Why it matters.** It shows that a genuinely useful conversational model for an underserved language can be adapted and run without specialized infrastructure.

**Stack.** Python · Hugging Face Transformers & PEFT · PyTorch · 4-bit QLoRA. Code: [github.com/mfareedkhan](https://github.com/mfareedkhan).
