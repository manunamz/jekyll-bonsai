---
id: 7ecd85512e
title: Frontmatter
desc: ''
updated: 1637696850276
created: 1628001846197
date: '2021-08-04'
status: "\U0001F331"
---

This template requires some specific frontmatter for certain documents in order to render all relevant data completely.

### Config

Some frontmatter defaults are set in the template configuration. These aren't really meant to be fiddled with. They are as follows:

```yaml
defaults:
  - 
    scope:
      type: "pages"
    values:
      type: "pages"
  - 
    scope:
      type: "posts"
    values:
      type: "posts"
      layout: "post"
      permalink: "/post/:id/"
  - 
    scope:
      type: "books"
    values:
      type: "books"
      layout: "book"
      permalink: "/book/:id/"
  - 
    scope:
      type: "entries"
    values:
      type: "entries"
      layout: "entry"
      permalink: "/entry/:id/"
  - 
    scope:
      type: "states"
    values:
      type: "states"
      layout: "state"
      permalink: "/stat/:id/"
```

(IDs require [[plugin.jekyll-namespaces.jekyll-id]])
