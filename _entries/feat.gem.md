---
id: c56ffb1b98
title: Gem
desc: ''
updated: 1637354121003
created: 1637336433783
status: "\U0001F38B"
---

`jekyll-bonsai` is available as a [ruby gem](https://rubygems.org/) for easy-install'n'update convenience.

To import is as a gem, you can follow the [jekyll theme gem instructions](https://jekyllrb.com/docs/themes/#understanding-gem-based-themes).

But, in a nutshell, do the following:
1. Add to your `GemFile`[^v]:
```ruby
gem "jekyll-bonsai"
```
2. Add to your `_config.yml`:
```yaml
theme: jekyll-bonsai
```

And that's it!


[^v]: You can also install a specific version if you are experiencing finickiness: `gem "jekyll-bonsai", "~> 0.1.0"`.
