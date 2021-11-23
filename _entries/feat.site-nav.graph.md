---
id: 5f44796eaf
title: Graph
desc: ''
updated: 1637624932107
created: 1620408781620
date: '2021-08-04'
status: "\U0001F38B"
---

metaphor::[[digi-gard.orient.bonsai]]
plugin::[[plugin.jekyll-graph]]
dependency ::
- [[plugin.jekyll-namespaces]]
- [[plugin.jekyll-wikilinks]]


The graph in the sidebar is the main site navigation for this template. You could think of the graph as a [[digi-gard.orient.bonsai]] growing in the sidebar tray.

### Navigate

You can hover over the 🧭 then click the 🌳 or 🕸 to toggle the graph's [[feat.site-nav.graph.type]].

On a node...
- ...click: 
  - You'll be taken to it's corresponding entry page.
- ...hover:
  - Its title will display as a tooltip
  - Net-web `neighbors` or tree `lineage` will highlight.

On a link...
- ...hover: 
  - It will highlight. 
  - Only its neighbor nodes titles will display.

### Config

```yaml
bonsai:
  nav:
    graph:
      type: "tree" # may be 'tree' or 'net-web'
```

`nav.graph.type`: Allows you to set the default [[feat.site-nav.graph.type]] to be displayed.

For more graph configurations, see [[plugin.jekyll-graph]].
