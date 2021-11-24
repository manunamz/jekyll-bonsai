---
id: 70247653ab
title: Emojis
desc: ''
updated: 1637775978067
created: 1637179577180
status: "\U0001F33F"
---

Emojis are used heavily in this template to give it a more natural feel. But all emojis are customizable. 🎨

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
approve:     👍 
consider:    🧐
disapprove:  👎
# nav-bar
colors:      🌈
## graph
net-web:     🕸
tree:        🌳
## site-nav
delete:      🧹
graph:       🪴
search:      🔍
site_nav:    🧭 
visited:     🥾
## pages
about:       🪧
archive:     ⛲️
home:        🏕
pages:       🗺
privacy:     🛖
recent:      🌦
stat_tags:   🔖
# entry-only
breadcrumbs: 🛤
links:       🚏
tags:        🧺
# 
# the following are informational emojis
#  -- these are safe to set to "" (empty strings)
# 
# social
connect:     🌊
share:       🐝
# changes
created:     🌩
published:   🌤
updated:     🌧
deleted:     🌨
# 404
missing:     🍂
```
