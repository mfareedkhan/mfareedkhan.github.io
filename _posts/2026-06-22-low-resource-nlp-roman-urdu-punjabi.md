---
layout: post
title: "Small Language Models for Low-Resource Languages: What Roman Urdu and Punjabi NLP Actually Need"
date: 2026-06-22 09:00:00
description: Urdu and Punjabi have hundreds of millions of speakers between them, yet NLP tooling for both lags far behind English. Here's what makes these languages genuinely hard for current models, and what actually helps.
tags: low-resource-nlp urdu punjabi peft
categories: nlp
giscus_comments: true
related_posts: true
---

Urdu is spoken by well over 200 million people and is the tenth most spoken language in the world, yet its representation in mainstream NLP tooling remains thin compared to languages with a fraction of its speaker base. Punjabi, spoken by over 100 million people across Pakistan and India, faces a similar gap, made more complex by the fact that it's written in two different scripts (Shahmukhi and Gurmukhi) depending on region. This isn't a niche problem — it's a gap affecting hundreds of millions of people's access to modern language technology. It's also a technically interesting one, because the reasons these languages are hard for current models are specific and instructive, not just "there isn't enough data."

## Why "low-resource" undersells the actual difficulty

It's tempting to treat "low-resource" as shorthand for "smaller training set, otherwise the same problem." For Urdu and Punjabi specifically, that framing misses several compounding issues:

**Script and orthographic instability.** Standard Urdu uses the Nasta'liq script, which is visually complex and less compatible with the tokenization and text-processing pipelines built primarily around Latin-script languages. But a huge share of everyday digital communication — social media, messaging, informal writing — happens not in standard Urdu script at all, but in **Roman Urdu**: Urdu written phonetically using the Latin alphabet. Roman Urdu has no standardized spelling convention, so the same word can be written many different ways depending on the writer, leading to high lexical variability that standard NLP pipelines aren't built to handle gracefully.

**Code-switching and code-mixing.** Real Urdu and Punjabi text, especially online, frequently mixes in English words and phrases mid-sentence — a pattern that's not an edge case but close to the norm in informal writing. Models trained primarily on monolingual corpora tend to handle this poorly, since code-switched text doesn't cleanly match either language's statistical patterns.

**Morphological complexity.** Both languages have richer morphology than English — more inflection, more grammatical marking on words — which increases the effective vocabulary a model needs to handle and makes subword tokenization schemes tuned for English less efficient.

**Genuine data scarcity, but unevenly distributed.** It's not that there's zero data — Urdu has decades of foundational NLP work behind it, from early corpora and part-of-speech tagsets to more recent treebanks and multilingual transformer coverage. But large, high-quality, labelled datasets for specific downstream tasks (sentiment analysis, summarization, question answering) remain comparatively scarce, and what does exist is often not evaluated with metrics well-suited to the language's specific challenges — for example, using word-level BLEU for transliteration tasks when character-level metrics are more appropriate given how much variation happens within individual words rather than between them.

## What actually helps

Given those specific obstacles, a few strategies have shown genuine value, and they map closely onto the parameter-efficient fine-tuning approaches covered elsewhere in this series:

**Cross-lingual transfer from related, higher-resource languages.** Urdu shares substantial vocabulary and structural similarity with Hindi (despite the script difference), and Punjabi is closely related to both. Multilingual pretrained models — trained jointly across many languages with shared subword vocabularies — can transfer some of what they've learned from higher-resource related languages, and techniques that explicitly exploit this relatedness (transliterating text into a related, better-resourced language's script as an intermediate step, for instance) have shown meaningful gains on tasks like named entity recognition and translation for related low-resource languages.

**Parameter-efficient fine-tuning, specifically because full fine-tuning is often infeasible for the teams doing this work.** This is where PEFT stops being just a compute optimization and becomes an access issue. Teams working on Urdu and Punjabi NLP are frequently not backed by the compute budgets of major industry labs, so approaches that let you adapt a strong multilingual base model — rather than needing to pretrain a language-specific model from scratch, or fully fine-tune an existing one — directly determine whether the work is possible at all. This is precisely the motivation behind a PEFT benchmark I contributed to for Punjabi sentiment analysis, comparing six adaptation methods on Multilingual BERT: full fine-tuning reached about 90% accuracy, but LoRA reached about 85% while training only 1.07% of parameters, and IA³ reached about 75% while training just 0.01% — a genuinely useful trade-off space for a team without access to large-scale compute.

**Treating transliteration as its own first-class problem, not an afterthought.** Because so much real-world Urdu text exists in Romanized form, systems that ignore Roman Urdu — or treat it as a minor variant to be normalized away — miss a large share of the language as it's actually used. Purpose-built transliteration models between Roman Urdu and standard Urdu script, evaluated with character-level rather than word-level metrics, are a genuinely necessary component of a usable pipeline, not a nice-to-have.

**Building small, efficient models rather than assuming bigger is automatically better.** For genuinely low-resource languages, the largest available multilingual models aren't always the strongest performers on a specific downstream task — their capacity is spread across dozens or hundreds of languages, and the target language may still be underrepresented in pretraining regardless of overall model scale. A smaller model, efficiently adapted with PEFT methods on carefully curated task-specific data, can be a more practical and often more effective choice than reaching for the largest available model by default.

## What this looked like in practice

In building a small language model for conversational Roman Urdu, the core challenge wasn't finding an architecture — it was the combination of no large labelled conversational corpus, no standardized spelling to normalize against, and a hard compute ceiling. The approach that worked was applying 4-bit QLoRA to an 8-billion-parameter base model, which cut trainable parameters by roughly 74% while preserving inference quality suitable for real deployment, and building the pipeline to be reproducible on hardware a single researcher could access, rather than assuming institutional compute. A separate project applying PEFT-adapted Gemma-3 and Qwen-3 models to joint language identification and sentiment classification across Urdu and Roman Urdu specifically documented the different error patterns between script-identical and transliterated text — a distinction that's easy to overlook if you evaluate on a dataset that's already been normalized to one script, but that matters enormously for a system meant to handle real, messy, user-generated text.

## The broader point

Low-resource language NLP is sometimes treated as a secondary application of techniques developed for English and then ported over. The more accurate framing, at least for languages like Urdu and Punjabi, is that the specific obstacles — script instability, code-switching, morphological richness, uneven data availability — require deliberately choosing methods suited to those obstacles, not just scaling down an English-first pipeline. Parameter-efficient fine-tuning happens to be well-suited to this work for a second, more structural reason: it lowers the compute barrier to entry for exactly the teams — often regional, under-resourced, working on languages that don't attract major industry investment — who are best positioned to actually understand what these languages need.

**Further reading**
- Alif: Advancing Urdu Large Language Models via Multilingual Synthetic Data Distillation, arXiv:2510.09051
- Low-Resource Transliteration for Roman-Urdu and Urdu Using Transformer-Based Models, arXiv:2503.21530
