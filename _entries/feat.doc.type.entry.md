---
id: 4fd03d1501
title: Entry
desc: ''
updated: 1637684318692
created: 1620411880535
date: '2021-08-04'
status: "\U0001F38B"
---

doc-required ::
- [[feat.doc.fm.id]]
- [[feat.doc.fm.updated]]
- [[feat.doc.fm.created]]
required ::
- [[feat.doc.fm.date]]
- [[feat.doc.ext-synt.namespaces]]
- [[feat.doc.fm.status]]
metaphor::[[digi-gard.plant.type.foliage]]


Like in a dictionary, encylopedia, or wikipedia, entries are one of the central document types to this template (besides `posts`). They are atomic concepts and ideas. Ideally they are meaningfully [[feat.site-nav.graph.links|linked]] so as to understand how ideas relate to one another.

### Navigate

Entries are the main ways to navigate the site:
- Hop to entries via the [[feat.site-nav.graph]].
- Go to previously [[feat.site-nav.visited]] entries. 
- Go to any entry from the [[feat.doc.type.page.archive]]
- Select a related entry via [[feat.doc.type.entry.head]] or [[feat.doc.type.entry.links]].

The [[feat.site-nav.graph.node.current]] will also glow in the graph.

### Markdown

Entries use hierarchical [[feat.doc.ext-synt.namespaces]] and live in the `_entries/` directory and its structure will typically contain frontmatter, wiki attributes, and markdown text respectively:

```ruby
# the filename contains the path from the hierarchy's
# root (base markdown file) to 
# leaf (the current markdown file) 
# 
# ex: 
# base-concept.mid-concept.current-concept.md
```

```markdown
---
frontmatter: attributes
---

wiki-attribute::[\[base-concept.related-concept]]

Then follows the rest of the text for the document, 
some of which might contain some more [\[wikilinks]].
```

(without the backslash escape chars `\`)

### Config

There are some `entry` configs that the creator may set:

```yaml
bonsai:
  entries:
    backlinks: false
    root_path: "_entries/root.md"  
    toggles:  # may be 'open' or 'closed'
      breadcrumb: "open"
      attr_box: "open"
      foot_links: "open"
      foot_posts: "open"
    
```

`backlinks`: Once enough links and attributes have been accumulated, it might be desirable to try turning off backlinks to cleanup the entry's footer. (This is more likely happen if you're using the [[plugin.jekyll-wikilinks]] `attributes` and block-level wikilinks)

`root_path` refers to which document should act as the root of the [[feat.doc.ext-synt.namespaces]] hierarchy (and the [[feat.site-nav.graph.type.tree]] graph).

`toggles` refer to the [[feat.doc.type.entry.head]] and  [[feat.doc.type.entry.links]] which may be toggled `open` or `closed`.


Visitors can jump directly to entries via the [[feat.site-nav.graph]] or by navigating its various parts on those types of pages.
