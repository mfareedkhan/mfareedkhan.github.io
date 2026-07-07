---
layout: page
title: TS-SLM — Text Summarization Small Language Model
description: LoRA + 4-bit quantization on Mistral-7B for length-controlled abstractive news summarization under strict compute constraints.
importance: 2
category: small language models
github: https://github.com/mfareedkhan
---

**The problem.** Abstractive summarization models are useful but often too heavy to deploy where compute is limited.

**What I built.** I fine-tuned **Mistral-7B** with **LoRA and 4-bit quantization** for abstractive news summarization under strict compute constraints, implementing **length-controlled generation**. I evaluated output quality and hallucination risk using **ROUGE** and **BERTScore**, directly addressing whether summarization models can be deployed in low-resource settings.

**Why it matters.** It treats faithfulness and deployability as first-class concerns, not afterthoughts.

**Stack.** Python · Hugging Face Transformers & PEFT · PyTorch · LoRA · 4-bit quantization. Code: [github.com/mfareedkhan](https://github.com/mfareedkhan).
