---
id: 929e9b60bb
title: Home Page
desc: ''
updated: 1637623512679
created: 1628088922635
date: '2021-08-04'
status: "\U0001F331"
---

metaphor::[[digi-gard.place.basecamp]]


The home page is the page that will load at the root of a `jekyll-bonsai` site.

### Navigate

This will be the first page to load for the site and to navigate to the archive page, just click on 🏕.

### Markdown

This file is not optional: Add an `index.md` at the root of your project with the following frontmatter:

```markdown
---
layout: home
title: <your-title-here>
---

<your-text-here>
```

### Config

Defaults are listed below:

```yaml
bonsai:
  home:
    notable: 
      enabled: true
      docs:
        - digi-gard.orient.bonsai.md
        - website-type.wiki-blog.md
        - digi-gard.md
        - features.visit.site-nav.graph.md
        - features.create.doc-type.entry.md
    recent: 
      enabled: true
      cap: 5
```

`Notable`: Documents that orient the visitor to your site. Help give newbies an understanding of what the blog, wiki, or site's main purpose is. List the filenames under the `docs` setting.

`Recent`: Are the [[feat.doc]]s that were most recently updated. Set the number of documents under the `cap` setting.
