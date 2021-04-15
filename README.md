# jekyll bonsai

// some d3 docs: https://github.com/d3/d3-force/blob/master/README.md

Notes require yaml frontmatter with an `id`.

## notable
- note with the title 'Root' displays as the home page (see index.html).

## refactorable
- `graph-type-selector` and `wiki-link-nav-selector` could easily become a widget that are fed in different data (for example, the span text).
- empty strings for `id` and `title` of missing nodes in hierarchical structure signify a missing node. this might be too much cognitive load to pass around -- maybe make a `missing` attribute or something that is a boolean...or have `missing` be calculated from the empty `id` and `title` attributes.

## d3 refs:
- [d3-force testing ground](https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03)
- [force directed graph](https://observablehq.com/@d3/force-directed-graph)
- [force directed tree](https://observablehq.com/@d3/force-directed-tree)
- [a tutorial on d3 force](https://observablehq.com/@ben-tanen/a-tutorial-to-using-d3-force-from-someone-who-just-learned-ho#center_sect)
- [understanding the force medium article](https://medium.com/@sxywu/understanding-the-force-ef1237017d5)
- [mbostock's so account -- check out his answers](https://stackoverflow.com/users/365814/mbostock)
- [a talk mbostock gave with tons of useful examples (v4)...](https://mbostock.github.io/d3/talk/20110921/#0)
- [..and the corresponding so answer](https://stackoverflow.com/questions/9712516/how-can-i-construct-a-tree-using-d3-and-its-force-layout)