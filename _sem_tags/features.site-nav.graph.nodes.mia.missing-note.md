---
id: cbd6b1bf-7335-4303-8c58-65e8261837af
title: Missing Note
desc: ''
updated: 1623851513018
created: 1620537158307
tags: "\U0001F331"
---
The [[features.site-nav.graph]] and [[features.notes|note-local]] navigation will properly handle missing links and notes:

Both graph types will display empty nodes with a "Missing Note" tooltip.

In the [[features.site-nav.graph.type.tree]], a missing note is when there are namespaces in filenames that don't have a corresponding note -- like the parent for this note which is called "mia"[>eg1]. As a result, the [[features.notes.note-head]] and [[features.notes.note-foot]] will print greyed out namespace text instead of clickable links.

In the [[features.site-nav.graph.type.net-web]], a missing note is when there is wikilinked text with no corresponding note. The text and wiklinks will print [[like-this]][>eg2].

[>eg1]: e.g. This note's title is `features.site-nav.graph.mia.missing-note.md` and there is no `features.site-nav.graph.mia.md` note. 

[>eg2]: e.g. There is no note titled `like-this.md`.

