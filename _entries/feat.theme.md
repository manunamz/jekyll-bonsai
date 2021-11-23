---
id: 00eefd30a7
title: Theme
desc: ''
updated: 1637618798707
created: 1620489733031
date: '2021-08-04'
status: "\U0001F33F"
---

metaphor::[[digi-gard.rainbow]]


This template is capable of providing multiple themes. 

### Navigate

Just hover over the 🌈 and click one of the options to toggle between them.

### Config

The default theme can be set in configs:

```yaml
bonsai:
  default_theme: "light"
```

### Data

Theme colors are stored as yaml data in `themes.yml` in the `_data/` directory. This is where theme colors and image source locations are stored.

Defaults for the light theme look like this:

```yaml
- 
  id: light
  emoji: ☀️
  src:
    favicon: "/assets/img/favicon-light.png"
    logo: "/assets/img/bonsai-light.svg"
    nav_burger:
      base: "/assets/img/nav-base-light.svg"
      bonsai: "/assets/img/nav-bonsai-light.svg"
  colors:
    selection: "#E6E09E"
    background: "#E4f3EA"
    text: "#5c5962"
    text_grey: "#27262b"
    accent_dark: "#b8d9b8"
    accent_light: "#C7E6D3"
    shadow: "#000"
    link:
      web:
        underline: "#e1e8e3"
        valid: "#264caf"
      wiki:
        underline: "#ede5dd"
        valid: "#009c7b"
        invalid: "#959396"
  graph:
    node:
      stroke: "#00000000"
      current: "#F0C61F"
      missing: "#8C6239"
      tagged: "#a87f32"
      unvisited: "#9cbe9c"
      visited: 
        color: "#31AF31"
        glow: "#00000000"
    link:
      color: "#8C6239"
    particles: 
      color: "#5c5962"
    text:
      color: "#5c5962"
```

If you only have one logo / favicon, you can simply make that logo's path the same for all themes.
