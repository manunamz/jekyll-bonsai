---
id: 95a80b4157
title: Sidenotes
desc: ''
updated: 1623870486255
created: 1620408418339
status: "\U0001F331"
---
Special syntax for sidenotes is supported. Their syntax is reminiscent of traditional markdown footnotes. In markdown files, they look like this (without spaces around the left/right carrots):

```
This is what a left-sidenote[ < left] and a right-sidenote[ > right] look like.

[ < left]: the syntax looks similar to...
[ > right]: ...regular markdown footnotes.
```

Which, once rendered, looks like:

* * *

This is what a right-sidenote[<left] and a left-sidenote[>right] look like.

* * *

On medium to small sized screens, you can click on sidenote superscripts to show or hide their content.

## Notable Quirks

- Sidenotes increment together, but separately from footnotes[^foot]. So, for example, it's possible for there to be a '1' for both a standard markdown footnote and a sidenote.
- Sidenotes require an "\\n" after each definition to parse properly. A warning will display if there are missing newlines (regardless of sidenotes).

## Influences

- [tufte css](https://github.com/edwardtufte/tufte-css), for clean'n'simple sidenote css implementation.
- [simply jekyll](https://github.com/raghuveerdotnet/simply-jekyll), how to implement tufte css in jekyll.
- [gwern.net](https://github.com/gwern/gwern.net), for sidenote implementation comparisons.

## Proposal

Would Kramdown be interested in integrating this functionality?

[<left]: the syntax looks similar to...[^left-quirk]

[>right]: ...regular markdown footnotes.

[^foot]: A regular markdown footnote.

[^left-quirk]: Left sidenotes are functional for completeness sake, but this theme is not optimized for them as their placement above the [[features.site-nav.graph]] is rather awkward.

[^num]: Footnotes, however, increment separately and the superscripts are clickable on all sized screens, unlike sidenote superscripts, which are only clickable on medium and small sized screens.

