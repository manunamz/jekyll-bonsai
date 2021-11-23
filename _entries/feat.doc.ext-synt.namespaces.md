---
id: fa6aa0c597
title: Namespaces
desc: ''
updated: 1637681927387
created: 1620433438038
date: '2021-08-04'
status: "\U0001F38B"
---

builds::
- [[feat.site-nav.graph.type.tree]]
- [[feat.doc.type.entry.head]]
- [[feat.doc.type.entry.links]]
plugin::[[plugin.jekyll-namespaces]]


Namespaces are defined by '.' delimeters in filenames, especially for [[feat.doc.type.entry|entries]]. The breadcrumb [[feat.doc.type.entry.head]] above the given content is formed by the current entry's filename, which is `features.site-nav.graph.links.namespacing.md`.

Namespaces are built with the [[plugin.jekyll-namespaces]] plugin (see docs for details) and are the building blocks for the tree graph.

If there are missing levels in the namespace, they will still be processed by the template. They will simply be marked as a [[feat.site-nav.graph.node.mia.missing]] in the graph and the [[feat.doc.type.entry.head]] + [[feat.doc.type.entry.links]].
