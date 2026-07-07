---
layout: page
permalink: /publications/
title: publications
description: Peer-reviewed research on efficient, deployable, and ethically governed AI — with authorship and status stated exactly.
nav: true
nav_order: 3
---

<div class="mb-4">
My full record is also on <a href="https://scholar.google.com/citations?user=FVTRze8AAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Google Scholar</a>. Authorship and status are stated exactly and updated as they change: <strong>one published</strong> (first author), <strong>two under review</strong> (one first-author thesis work, one as co-author), and <strong>one in preparation</strong> (first author).
</div>

## Published

<div class="publications">
{% bibliography --query @*[status=published] %}
</div>

## Under review

<div class="publications">
{% bibliography --query @*[status=under_review] %}
</div>

## In preparation

<div class="publications">
{% bibliography --query @*[status=in_preparation] %}
</div>
