---
id: c775ce9eda
title: Missing Entry
desc: ''
updated: 1628002896424
created: 1620537158307
status: "\U0001F331"
---
The [[features.site-nav.graph]] and [[features.doc-type.entry|entry-local]] navigation will properly handle missing links and entries:

Both graph types will display empty nodes with a "Missing Entry" tooltip.

In the [[features.site-nav.graph.type.tree]], a missing entry is when there are namespaces in filenames that don't have a corresponding entry -- like the parent for this entry which is called "mia"[>eg1]. As a result, the [[features.doc-type.entry.head]] and [[features.doc-type.entry.foot]] will print greyed out namespace text instead of clickable links.

In the [[features.site-nav.graph.type.net-web]], a missing entry is when there is wikilinked text with no corresponding entry. The text and wiklinks will print [[like-this]][>eg2].

[>eg1]: e.g. This entry's title is `features.site-nav.graph.mia.missing-entry.md` and there is no `features.site-nav.graph.mia.md` entry. 

[>eg2]: e.g. There is no entry titled `like-this.md`.

