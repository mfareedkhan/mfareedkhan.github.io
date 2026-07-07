---
layout: page
title: Multilingual Sentiment & Language Detection
description: PEFT-adapted Gemma-3 and Qwen-3 for joint language identification and sentiment classification across Urdu and Roman Urdu, with structured outputs.
importance: 3
category: small language models
github: https://github.com/mfareedkhan
---

**The problem.** Handling Urdu and Roman Urdu together — identifying the language _and_ the sentiment — is hard for a single compact model, and pipelines need clean, structured outputs.

**What I built.** I fine-tuned **Gemma-3** and **Qwen-3** for **joint language identification and sentiment classification** across Urdu and Roman Urdu under a single PEFT-adapted model, producing **structured outputs for pipeline integration** and systematically documenting error modes to build a reproducible low-resource multilingual baseline.

**Why it matters.** A single efficient model that outputs structured, pipeline-ready results lowers the barrier to real multilingual NLP deployment.

**Stack.** Python · Hugging Face Transformers & PEFT · PyTorch · Gemma-3 · Qwen-3. Code: [github.com/mfareedkhan](https://github.com/mfareedkhan).
