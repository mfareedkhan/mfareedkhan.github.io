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
  <p class="mf-lead">I am interested in developing efficient, trustworthy, and multimodal AI systems, particularly for healthcare and other settings where data, computing resources, and rigorous evaluation matter.</p>
  <div class="mf-vision"><i class="fa-regular fa-lightbulb" aria-hidden="true"></i><div><h3>Research Vision</h3><p>To advance AI systems that are computationally practical, data-efficient, robust, transparent about their limitations, and evaluated for meaningful real-world use.</p></div></div>
  <section class="mf-section"><div class="mf-section-head"><h2>Research Areas</h2></div>
    <div class="mf-grid">
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-solid fa-brain"></i></span><h3>Multimodal AI for Healthcare</h3><p>Medical VLMs, image-text fusion, and clinical report generation.</p></article>
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-solid fa-x-ray"></i></span><h3>Medical Image Analysis</h3><p>Multi-view chest radiographs and explainable retinal-image modeling.</p></article>
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-regular fa-comments"></i></span><h3>Large Language Models</h3><p>Clinical NLP, healthcare LLMs, and efficient model adaptation.</p></article>
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-solid fa-gears"></i></span><h3>Efficient Deep Learning</h3><p>PEFT, LoRA/QLoRA, quantization, and resource-constrained experiments.</p></article>
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-solid fa-shield-halved"></i></span><h3>Trustworthy AI</h3><p>Ethical governance, responsible model evaluation, and failure analysis.</p></article>
      <article class="mf-card mf-interest-card"><span class="mf-icon"><i class="fa-solid fa-language"></i></span><h3>Low-Resource Multilingual NLP</h3><p>Roman Urdu, Punjabi, and multilingual language-model adaptation.</p></article>
    </div>
  </section>
  <section class="mf-section" id="cxrg-svlm"><h2>Flagship Research — CXRG-SVLM</h2>
    <p><strong>CXRG-SVLM: A Parameter-Efficient Small Vision-Language Model for Multi-View Chest X-ray Report Generation in Resource-Constrained Environments.</strong> MS research supervised by Dr. Jamal Uddin; accepted for publication in <em>Scientific Reports</em> (2026).</p>
    <div class="mf-grid">
      <div class="mf-card"><span class="mf-icon"><i class="fa-solid fa-layer-group"></i></span><h3>Model Architecture</h3><p>Frozen RAD-DINO visual encoder, attention-based frontal/lateral fusion, <strong>32 visual tokens</strong>, clinical-indication conditioning, and a 4-bit Qwen2.5-3B backbone adapted with QLoRA. Visual and indication embeddings form a joint prefix for causal self-attention.</p></div>
      <div class="mf-card"><span class="mf-icon"><i class="fa-solid fa-chart-line"></i></span><h3>Efficiency</h3><p><strong>1,992,450,144</strong> framework-reported parameters; <strong>38,114,144 trainable (1.91%)</strong>. Eight-epoch training required approximately 3.19 hours on a single NVIDIA Tesla T4 (16 GB).</p></div>
      <div class="mf-card"><span class="mf-icon"><i class="fa-solid fa-stethoscope"></i></span><h3>Evaluation &amp; Limitations</h3><p>IU-Xray held-out evaluation: ROUGE-L <strong>0.3527</strong>, BERTScore-F1 <strong>0.4361</strong>, RaTEScore <strong>0.6001</strong>, RadGraph-F1 <strong>0.3472</strong>. No external dataset or radiologist-led validation yet.</p></div>
    </div>
    <div class="mf-actions"><a class="mf-btn mf-btn-primary" href="{{ '/publications/#cxrg-svlm' | relative_url }}">Publication details</a><a class="mf-btn" href="https://doi.org/10.5281/zenodo.23286489">Reproducibility artifact</a></div>
  </section>
  <section class="mf-section"><h2>Future Research Interests (PhD)</h2><p class="mf-small-note">The following are directions I hope to investigate further, not claims of completed research expertise.</p>
    <div class="mf-mini-grid">
      <div class="mf-mini"><i class="fa-solid fa-arrows-rotate"></i>Robustness &amp; domain adaptation</div>
      <div class="mf-mini"><i class="fa-solid fa-gauge-high"></i>Uncertainty estimation &amp; calibration</div>
      <div class="mf-mini"><i class="fa-solid fa-user-doctor"></i>Clinician-in-the-loop evaluation</div>
      <div class="mf-mini"><i class="fa-solid fa-diagram-project"></i>Images, text &amp; structured clinical data</div>
      <div class="mf-mini"><i class="fa-solid fa-microscope"></i>Computational pathology</div>
      <div class="mf-mini"><i class="fa-solid fa-globe"></i>Multilingual AI for South Asian languages</div>
    </div>
  </section>
</div>