---
id: 6278153d5a
title: Search
desc: ''
updated: 1637776042553
created: 1637614793418
status: "\U0001F33F"
---

Search the contents of the site with eases.

### Navigate

- Click on the 🔍 at the top of the sidebar, or press `cmd + k` (for mac) or `ctrl + k` (for windows), to open the search bar. 
- Type your query. 
- Hit 'Enter'. 
- Click on your desired result or click anywhere or hit `Escape` to hide search.

### Config

Site nav config defaults are listed below:

```yaml
bonsai:
  nav:
    search: 
      enabled: true
      exclude: []
```

`enabled`: Toggle search on/off for your site.

`exclude:` You can list the [[feat.doc.type]]s you want to exclude from search indexing.
