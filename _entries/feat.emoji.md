---
id: 70247653ab
title: Emojis
desc: ''
updated: 1637775978067
created: 1637179577180
status: "\U0001F33F"
---

Emojis are used heavily in this template to give it a more natural feel. But all emojis are customizable. ๐จ

### Stat

Whatever [[feat.doc.type.state]]s are defined will determine what emojis are a valid for [[feat.doc]][[feat.doc.fm.status]] frontmatter attribute.

### Data

Emoji data is responsible for most emoji rendering throughout the site, especially for buttons and informative icons.

The default emoji data file looks like so:

```yaml
# _data/emoji.yml

# 
# the following are emoji buttons
#  -- there needs to be something here for buttons to work
# 
# cookie-consent
approve:     ๐ 
consider:    ๐ง
disapprove:  ๐
# nav-bar
colors:      ๐
## graph
net-web:     ๐ธ
tree:        ๐ณ
## site-nav
delete:      ๐งน
graph:       ๐ชด
search:      ๐
site_nav:    ๐งญ 
visited:     ๐ฅพ
## pages
about:       ๐ชง
archive:     โฒ๏ธ
home:        ๐
pages:       ๐บ
privacy:     ๐
recent:      ๐ฆ
stat_tags:   ๐
# entry-only
breadcrumbs: ๐ค
links:       ๐
tags:        ๐งบ
# 
# the following are informational emojis
#  -- these are safe to set to "" (empty strings)
# 
# social
connect:     ๐
share:       ๐
# changes
created:     ๐ฉ
published:   ๐ค
updated:     ๐ง
deleted:     ๐จ
# 404
missing:     ๐
```
