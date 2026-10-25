---
layout: page
title: research
permalink: /research/
nav: true
nav_order: 2
description: Research in multimodal healthcare AI, medical VLMs, efficient adaptation, trustworthy AI and low-resource NLP.
---

<link rel="stylesheet" href="{{ '/assets/css/academic.css' | relative_url }}">

<div class="mf-wrap">
  <h1>Research</h1>
  <p class="mf-lead">My research focuses on <strong>efficient and trustworthy multimodal AI</strong>, particularly medical vision-language models, clinical report generation, medical image analysis, and parameter-efficient foundation-model adaptation. I am interested in bridging methodological advances with the practical requirements of reliable healthcare AI, while also exploring clinical NLP and low-resource multilingual language technologies.</p>
  <div class="mf-vision"><i class="fa-regular fa-lightbulb" aria-hidden="true"></i><div><h3>Research Vision</h3><p>To advance <strong>efficient, trustworthy, and multimodal AI systems</strong> that integrate medical imaging and clinical language, adapt foundation models under limited data and computational resources, and are rigorously evaluated for <strong>clinical relevance, robustness, and responsible real-world use</strong>—while also contributing to low-resource and multilingual NLP.</p></div></div>
  <section class="mf-section"><div class="mf-section-head"><h2>Research Areas</h2></div>
    <div class="mf-grid">
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-solid fa-brain"></i></span><h3>Multimodal AI for Healthcare</h3><p>Medical vision-language models, image–text representation learning, multimodal foundation models, and clinical report generation.</p></article>
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-solid fa-x-ray"></i></span><h3>Medical Image Analysis</h3><p>Multi-view chest radiograph analysis, medical computer vision, and explainable retinal-image modeling.</p></article>
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-regular fa-comments"></i></span><h3>Large Language Models &amp; Clinical NLP</h3><p>Healthcare LLMs, clinical language generation, radiology-report evaluation, and responsible language-model applications.</p></article>
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-solid fa-gears"></i></span><h3>Efficient &amp; Resource-Constrained AI</h3><p>Parameter-efficient fine-tuning, LoRA/QLoRA, quantization, and resource-aware adaptation of language and vision-language models.</p></article>
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-solid fa-shield-halved"></i></span><h3>Trustworthy &amp; Responsible AI</h3><p>Ethics, explainability, and model failure analysis in healthcare AI, with research interests in robustness, fairness, and responsible evaluation.</p></article>
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-solid fa-language"></i></span><h3>Low-Resource &amp; Multilingual NLP</h3><p>Roman Urdu and Punjabi language modeling, multilingual adaptation, and efficient fine-tuning for underrepresented languages.</p></article>
    </div>
  </section>
  <section class="mf-section" id="cxrg-svlm"><h2>Flagship Research — CXRG-SVLM</h2>
    <p><strong>CXRG-SVLM: A Parameter-Efficient Small Vision-Language Model for Multi-View Chest X-ray Report Generation in Resource-Constrained Environments.</strong> Developed as my MS thesis under the supervision of <a href="https://scholar.google.com/citations?user=334NBuAAAAAJ&amp;hl=en">Dr. Jamal Uddin</a> and accepted for publication in <em>Scientific Reports</em> (2026). CXRG-SVLM investigates efficient multimodal learning for automated radiology-report generation using multi-view chest X-rays and clinical-indication conditioning.</p>
    <div class="mf-grid">
      <div class="mf-card"><span class="mf-icon"><i class="fa-solid fa-layer-group"></i></span><h3>Model Architecture</h3><p>Frozen RAD-DINO visual encoder, attention-based frontal/lateral fusion, <strong>32 visual tokens</strong>, clinical-indication conditioning, and a 4-bit Qwen2.5-3B backbone adapted with QLoRA. Visual and indication embeddings form a joint prefix for causal self-attention.</p></div>
      <div class="mf-card"><span class="mf-icon"><i class="fa-solid fa-chart-line"></i></span><h3>Efficiency</h3><p><strong>1,992,450,144</strong> framework-reported parameters; <strong>38,114,144 trainable (1.91%)</strong>. Eight-epoch training required approximately 3.19 hours on a single NVIDIA Tesla T4 (16 GB).</p></div>
      <div class="mf-card"><span class="mf-icon"><i class="fa-solid fa-stethoscope"></i></span><h3>Evaluation &amp; Limitations</h3><p>IU-Xray held-out evaluation: ROUGE-L <strong>0.3527</strong>, BERTScore-F1 <strong>0.4361</strong>, RaTEScore <strong>0.6001</strong>, RadGraph-F1 <strong>0.3472</strong>. Evaluation is limited to IU-Xray with complementary lexical, semantic, and radiology-specific metrics. External dataset and radiologist-led validation have not yet been performed.</p></div>
    </div>
    <div class="mf-actions"><a class="mf-btn mf-btn-primary" href="{{ '/publications/#cxrg-svlm' | relative_url }}">Publication details</a><a class="mf-btn" href="https://doi.org/10.5281/zenodo.23286489">Reproducibility artifact</a></div>
  </section>
  <section class="mf-section" id="healthcare-llm-ethics">
    <div class="mf-section-head"><h2>Trustworthy Healthcare AI — Ethical Considerations of LLMs</h2><span class="mf-pill mf-pill-published">Published · Frontiers in Digital Health (2025)</span></div>
    <p>My first-author systematic review, <strong>A Systematic Review of Ethical Considerations of Large Language Models in Healthcare and Medicine</strong>, published in <em>Frontiers in Digital Health</em> (2025), investigates ethical challenges associated with healthcare LLMs. It synthesizes <strong>27 studies from 316 screened records</strong>, examining privacy, bias, transparency, accountability, patient safety, and human oversight.</p>
    <p>A key contribution is a <strong>four-layer ethical framework</strong> encompassing regulatory safeguards, technical safeguards, human oversight, and accountability. This work complements my medical vision-language modeling research by emphasizing the governance and evaluation considerations needed for responsible generative AI in healthcare.</p>
    <div class="mf-actions"><a class="mf-btn" href="https://doi.org/10.3389/fdgth.2025.1653631">Read published paper · DOI</a></div>
  </section>
  <section class="mf-section"><h2>Future Research Interests (PhD)</h2><p class="mf-small-note">These are directions for future PhD research, not claims of completed expertise. They include domain generalization, uncertainty calibration, fairness, clinician–AI collaboration, multimodal medical foundation models, computational pathology and segmentation, and efficient multilingual AI.</p>
    <div class="mf-mini-grid">
      <div class="mf-mini"><i class="fa-solid fa-arrows-rotate"></i>Domain Generalization &amp; Adaptation</div>
      <div class="mf-mini"><i class="fa-solid fa-gauge-high"></i>Uncertainty &amp; Clinical Reliability</div>
      <div class="mf-mini"><i class="fa-solid fa-user-doctor"></i>Clinician–AI Collaboration</div>
      <div class="mf-mini"><i class="fa-solid fa-diagram-project"></i>Multimodal Medical Foundation Models</div>
      <div class="mf-mini"><i class="fa-solid fa-microscope"></i>Advanced Medical Image Understanding</div>
      <div class="mf-mini"><i class="fa-solid fa-globe"></i>Low-Resource Multilingual LLMs &amp; VLMs</div>
    </div>
  </section>
</div>
