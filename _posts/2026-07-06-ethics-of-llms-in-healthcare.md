---
layout: post
title: "The Ethics of Large Language Models in Healthcare: Key Risks and Mitigation Strategies"
date: 2026-07-06 09:00:00
description: Bias, safety, transparency, accountability, and privacy are the five risks that show up again and again in the LLM-healthcare literature. Here's what they look like in practice, and what a workable governance framework needs to address.
tags: llm-ethics healthcare ai-safety
categories: healthcare-ai
giscus_comments: false
related_posts: true
---

Large language models are being adopted in healthcare faster than the governance frameworks meant to oversee them are maturing. That gap is the subject of a systematic review I led, published in *Frontiers in Digital Health*, which analyzed 27 peer-reviewed studies published between 2017 and 2025 to map out which ethical concerns actually recur across the deployed-LLM-in-healthcare literature, rather than relying on any single paper's framing of the risks. This post summarizes what that review found, and connects it to the broader conversation happening across the field.

## The four risks that dominate the literature

Across the included studies, one theme stood out clearly above the rest: **bias and fairness**, which accounted for roughly a quarter of all ethical discussion in the reviewed literature (25.9%). This isn't a surprising finding in the abstract — bias in machine learning systems is a well-known concern — but it's worth being specific about what it means in a clinical context. A model trained predominantly on data from certain patient populations, certain languages, or certain healthcare systems can perform unevenly across the populations it's deployed on, and in medicine, "performs unevenly" translates directly into unequal quality of care. This isn't a hypothetical: prior evaluation work has found that general-purpose LLMs can reproduce racial and gender biases present in historical medical data and text when used for clinical tasks, and left unaddressed, an AI system meant to reduce inequities in care can instead entrench them further.

**Safety and reliability** concerns come next, closely tied to the well-documented tendency of language models to hallucinate — to generate fluent, plausible-sounding text that is factually incorrect. In most applications, a hallucinated fact is an annoyance; in a clinical decision-support context, it can be actively dangerous, particularly because hallucinated content is often stylistically indistinguishable from accurate content, which makes it harder for a time-pressured clinician to catch.

**Transparency and explainability** form the third recurring theme. Large language models are, functionally, black boxes — even their own developers can't fully explain why a specific output was generated for a specific input. In most consumer applications, this opacity is an inconvenience. In healthcare, it collides directly with established norms around clinical accountability: a clinician is expected to be able to explain and justify a diagnostic or treatment decision, and a system that can't explain its own reasoning is difficult to integrate into that accountability structure without either explanation tooling (which remains an active research problem) or a significant restructuring of how responsibility is assigned when AI is involved.

**Accountability**, closely related, asks a harder institutional question: when an LLM-assisted clinical decision leads to harm, who is responsible — the clinician who relied on the tool, the institution that deployed it, or the developer who built it? Current governance frameworks in most jurisdictions haven't fully resolved this question, which leaves a real gap between the pace of LLM adoption in clinical settings and the pace of the legal and institutional frameworks meant to govern that adoption. This is compounded by a genuine tension: strong privacy protections around training data and model internals, while necessary, can make it harder for external auditors to investigate a system for exactly the bias or safety issues that accountability frameworks are meant to catch.

**Privacy** rounds out the most consistently discussed concerns. Healthcare data is among the most sensitive category of personal data that exists, and LLM-based systems raise privacy questions on two fronts: whether patient data used to adapt or fine-tune a model could be inadvertently exposed or reconstructed from the model itself, and whether using cloud-hosted, externally-operated LLM services for clinical workflows creates unconsented data flows outside the healthcare system's own governance boundary. This is a substantive part of the argument for on-premise, privacy-preserving deployment discussed elsewhere on this site: an efficient, quantized model that can run inside a hospital's own infrastructure sidesteps a category of privacy risk that a cloud-API-dependent system cannot.

## What the literature says about which models are actually being examined

One striking pattern in the review is architectural concentration: models from the GPT family accounted for the majority of systems examined across the included studies (51.8%), with clinical decision support the most frequently studied application domain. This matters for how much confidence the field should place in current ethical findings — a literature dominated by evaluations of one model family, largely through an English-language, open-access lens, may be systematically underrepresenting how these risks manifest in other architectures, other languages, and non-English-speaking healthcare systems, a limitation the review is explicit about rather than glossing over.

## Toward a workable framework, not just a list of concerns

A list of risks is useful for awareness, but it doesn't, by itself, tell an institution what to actually do. The review proposes a **four-layer ethical integration framework** intended to move from diagnosis to action:

1. **Regulatory safeguards** — external rules and standards (data protection law, medical device regulation where applicable, sector-specific AI guidance) that set the outer boundary of acceptable deployment.
2. **Technical safeguards** — the engineering-level mitigations available within a system itself: bias testing and mitigation during model development, retrieval-grounding and hallucination-reduction techniques during generation, and privacy-preserving deployment architectures (on-premise inference, differential privacy, federated approaches) where the sensitivity of the data warrants it.
3. **Human oversight** — the recognition that no current LLM should be operating as an unsupervised clinical decision-maker; human-in-the-loop review remains necessary specifically because transparency and accountability gaps haven't been closed at the technical level.
4. **Transparency and accountability structures** — institutional processes, not just individual good intentions, that make it possible to audit what a deployed system is doing, trace responsibility when something goes wrong, and update deployment decisions as evidence accumulates.

The point of structuring it this way is that these layers are meant to be complementary, not substitutes for one another. A strong regulatory framework without technical safeguards doesn't prevent a biased model from being deployed within legal bounds; strong technical safeguards without human oversight don't address the accountability gap when a model — however well-engineered — is still occasionally wrong.

## Why this connects to deployability

It would be a mistake to treat "ethics of LLMs in healthcare" as a purely governance-and-policy conversation, separate from the technical work of building efficient, deployable models. Several of the recurring risks — privacy exposure from cloud dependency, opacity in very large black-box models, uneven performance across underrepresented languages and populations that current architecture concentration suggests — are risks that specific technical choices can meaningfully reduce. Building smaller, on-premise-deployable models isn't just a compute optimization; it's a direct response to the privacy layer of this framework. Evaluating models with clinical-entity-level metrics rather than only aggregate NLG scores is a direct response to the safety and reliability layer. The technical and ethical work here aren't separate tracks — the strongest version of "responsible healthcare AI" treats them as the same project.

**Further reading**
- Fareed, M., et al. (2025). *A systematic review of ethical considerations of large language models in healthcare and medicine.* Frontiers in Digital Health. DOI: 10.3389/fdgth.2025.1653631
- Zack, T., et al. (2024). *Assessing the potential of GPT-4 to perpetuate racial and gender biases in health care.* Lancet Digital Health.
