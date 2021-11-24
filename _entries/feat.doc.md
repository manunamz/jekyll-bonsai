---
id: 059a345cc6
title: Document
desc: ''
updated: 1637776437162
created: 1627994778640
date: '2021-08-04'
status: "\U0001F33F"
---

required ::
- [[feat.doc.fm.id]]
- [[feat.doc.fm.updated]]
- [[feat.doc.fm.created]]


Documents are markdown documents that are used to render content. This template is optimized for specific document types with a couple of special frontmatter variables. 

(All documents require the frontmatter attributes required for documents listed here)

### Navigate

- The [[feat.doc.type.page.archive]].
- The previously [[feat.site-nav.visited]] .
- [[feat.site-nav.search]].

### Config

Be sure to toggle on output for the doc types in this template:

```yaml
collections:
  books:
    output: true
  entries:
    output: true
  states:
    output: true
    order:
      - tags.md
      - sprout.md
      - bud.md
      - bamboo.md
      - bloom.md
      - berry.md
      - fruit.md
      - melon.md
      - seed.md
      - tea.md
      - pot-bamboo.md
```
