---
id: a19d898449
title: State
desc: ''
updated: 1637682994639
created: 1627998149742
date: '2021-08-04'
status: "\U0001F33F"
---

doc-required ::
- [[feat.doc.fm.id]]
required ::
- [[feat.doc.fm.emoji]]
- [[feat.doc.fm.emojipedia]]
metaphor::[[digi-gard.plant]]


States define what type of [[feat.doc.fm.status]] a document may have. There is a page for each state so visitors may hop from a state type to documents with that status. 

### Navigate

To view the available states, hover over 🧭 and click on the 'home' tag emoji -- it is currently 🔖. State pages can also be navigated to by clicking on a state (almost) whenever you see one around the site.

### Markdown

States require [[feat.doc.fm.emoji]] and [[feat.doc.fm.emojipedia]] frontmatter attributes to be filled out.

```markdown
---
id: <unique-id>
title: <your-title
emoji: <an-emoji>
emojipedia: 'https://emojipedia.org/<emoji>/'
---

<your-description-here>
```

### Config

When the states display on the jekyll site, it's important to define one state that is the 'root' state. This will be the page the home tag button navigates to and lists a summary of all states on the site. It can be configured like so:

```yaml
collections:
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
bonsai:
  states:
    root_path: "_states/tags.md"
```

`order`: This [jekyll convention](https://jekyllrb.com/docs/collections/#manually-ordering-documents) determines the order the states are displayed in the navbar at the top of state pages.

`root_path`: Defines which stage should be displayed when a visitor navigates to the states pages. That page will display descriptions for all valid states for the site.
