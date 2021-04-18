# jekyll bonsai

// some d3 docs: https://github.com/d3/d3-force/blob/master/README.md

Notes require yaml frontmatter with an `id`.

## notable
- sidenotes increment together, but separately from footnotes. so, for example, it's possible for there to be a '1' for both a \[\^footnote] and a \[\<right-sidenote] or \[\>left-sidenote].
- note with the title 'Root' displays as the home page (see index.html).
- graph viz does not include tree connections.

## known issues
- broken \[\[wiki links]] break footnotes.
    - does this mean that local plugins are run **before** the kramdown parser??
- \[\[wiki links]] break charts.

## wants
- sort of want to abandon the 'mobile first' approach (see `layout.scss`) and make the scss more explicit about what screen the logic is targetting.
    - this mostly means applying `@include mq(sm)` where 'default' behavior is set to only really make sense on mobile.
    - see: https://css-tricks.com/snippets/css/media-queries-for-standard-devices/
- typescript with d3: https://www.npmjs.com/package/@types/d3

## refactorable
- `.rsn` and `.lsn` are basically the same class except for their margin offset direction.
- make _plugin parts into a module and turn the `generate()` function into an order-of-operations-machine of sorts.
- `graph-type-selector` and `wiki-link-nav-selector` could easily become a widget that are fed in different data (for example, the span text).
- empty strings for `id` and `title` of missing nodes in hierarchical structure signify a missing node. this might be too much cognitive load to pass around -- maybe make a `missing` attribute or something that is a boolean...or have `missing` be calculated from the empty `id` and `title` attributes.

## optimize
- apparently use pixix.js to optimize d3? -> https://graphaware.com/visualization/2019/09/05/scale-up-your-d3-graph-visualisation-webgl-canvas-with-pixi-js.html
    - i wonder if that means i have to switch from d3 svg to canvas...and if that would be painful or not...

# lrn
- light/dark theme button from [https://github.com/mathieudutour/gatsby-digital-garden](https://codepen.io/aaroniker/pen/KGpXZo).
- css transitions: https://thoughtbot.com/blog/transitions-and-transforms

## d3 refs:
- [d3-force testing ground](https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03)
- [force directed graph](https://observablehq.com/@d3/force-directed-graph)
- [force directed tree](https://observablehq.com/@d3/force-directed-tree)
- [a tutorial on d3 force](https://observablehq.com/@ben-tanen/a-tutorial-to-using-d3-force-from-someone-who-just-learned-ho#center_sect)
- [understanding the force medium article](https://medium.com/@sxywu/understanding-the-force-ef1237017d5)
- [mbostock's so account -- check out his answers](https://stackoverflow.com/users/365814/mbostock)
- [a talk mbostock gave with tons of useful examples (v4)...](https://mbostock.github.io/d3/talk/20110921/#0)
- [..and the corresponding so answer](https://stackoverflow.com/questions/9712516/how-can-i-construct-a-tree-using-d3-and-its-force-layout)