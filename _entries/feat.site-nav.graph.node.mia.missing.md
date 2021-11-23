---
id: c775ce9eda
title: Missing
desc: ''
updated: 1637684785217
created: 1620537158307
date: '2021-08-04'
status: "\U0001F331"
---

The [[feat.site-nav.graph]] and [[feat.doc.type.entry|entry-local]] navigation will properly handle missing links and entries:

Both graph types will display empty nodes with a "Missing Entry" tooltip.

In the [[feat.site-nav.graph.type.tree]], a missing entry is when there are namespaces in filenames that don't have a corresponding entry -- like the parent for this entry which is called "mia"[^eg1]. As a result, the [[feat.doc.type.entry.head]] and [[feat.doc.type.entry.links]] will print greyed out namespace text instead of clickable links.

In the [[feat.site-nav.graph.type.net-web]], a missing entry is when there is wikilinked text with no corresponding entry. The text and wiklinks will print [[like-this]][^eg2].


[^eg1]: e.g. This entry's filename is `features.site-nav.graph.mia.missing.md` and there is no `features.site-nav.graph.mia.md` file.

[^eg2]: e.g. There is no entry with the filename `like-this.md`.
