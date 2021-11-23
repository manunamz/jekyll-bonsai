---
id: ff16b3ead0
title: Visited Nav
desc: ''
updated: 1637684576914
created: 1622910363375
date: '2021-08-04'
status: "\U0001F33F"
---

metaphor::[[digi-gard.orient.step]]


As pages are [[feat.visit]]ted, each step is added as a tab to a list of visited pages. This makes it easy to re-visit previously seen areas. Tabs are ordered from most recent to least recently visited, top to bottom. Re-visited entries are moved to the top and removed from further down the stack.[^nog-fil]

This captures some of the functionality of the sliding behavior from [Andy's notes](https://entries.andymatuschak.org/About_these_entries), which help orient someone within the site.

### Navigate

To view visited pages, hover over the 🧭 and click on 🥾.

### Config

```yaml
bonsai:
  nav:
    visited:
      enabled: true
```

`visited.enabled`: Toggle on/off the visited tabs in the sidebar.


[^nog-fil]: aka the [noguchi filing system](https://lifehacker.com/the-noguchi-filing-system-keeps-paper-documents-organiz-1593529432)
