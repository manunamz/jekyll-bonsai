---
id: af42b9d08b
title: Book
desc: ''
updated: 1637695936370
created: 1637082183313
status: "\U0001F331"
---

doc-required ::
- [[feat.doc.fm.id]]
- [[feat.doc.fm.updated]]
- [[feat.doc.fm.created]]
required ::
- [[feat.doc.fm.date]]
- [[feat.doc.fm.status]]
- [[feat.doc.fm.tags]]
metaphor::[[digi-gard.plant.type.germ]]


Book documents are a type of post that discusses a book. They display the book's cover and connect to [[feat.doc.type.entry]] via [[feat.doc.fm.tags]].

### Navigate

- The [[feat.doc.type.page.archive]].
- Via [[feat.doc.type.entry.links]].

### Markdown

Books live in the `_books/` directory. Each book should be a directory that contains a markdown file and a cover (`.png`) image. All three should have the same name:

```
_books/
  on-liberty/
    on-liberty.md
    on-liberty.png
```
