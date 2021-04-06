---
layout: md
title: API Docs
header: ["Documentation Index", "View full API documentation for various Yuuko versions"]
group: nav
order: 4
permalink: /docs/
---
Select the version of Yuuko you'd like to view docs for:

{% for version in site.data.docs reversed %}
- [{{version}}]({{ site.baseurl }}/docs/{{ version }})
{% endfor %}
