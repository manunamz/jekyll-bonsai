---
id: 705766b664
title: Recent Page
desc: ''
updated: 1637695856708
created: 1620432005833
date: '2021-08-04'
status: "\U0001F331"
---

depends-on::[[feat.doc.fm.updated]]
metaphor::[[digi-gard.place.weather]]


The recent page displays [[feat.doc|documents]] have been recently changed and shows whether they were added or created.

### Navigate

To navigate to the recent page, just hover over 🗺 and click on 🌦.

### Markdown

```markdown
---
layout: recent
permalink: /recent/
title: <your-title-here>
---

<your-text-here>
```

### Config

Defaults are listed below:

```yaml
bonsai:
  recent: 
    enabled: true
    cap: 5
```
