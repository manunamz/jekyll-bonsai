# jekyll bonsai

// some d3 docs: https://github.com/d3/d3-force/blob/master/README.md

Notes require yaml frontmatter with an `id`.

## notable
- garden bed nav items have explicit ordering in their frontmatter.
- 'missing nodes' show up in tree view, but not net-web view.
- terms: `graph` refers to any type of graph of which there are two types: a hierarchical `tree` and a `net-web`.
- `gbed` refers to `garden bed`.
- sidenotes increment together, but separately from footnotes. so, for example, it's possible for there to be a '1' for both a \[\^footnote] and a \[\<right-sidenote] or \[\>left-sidenote].
- sidenotes require a \n after each definition; there is a check for a \n at eof just in case sidenotes are at the bottom fo the file -- if any files don't end with a newline the local plugin will print to the terminal about it.
- note with the title 'Root' displays as the home page (see index.html).
- graph viz does not include tree connections.

## private garden
- this site will likely work best with private gardens grown with obsidian or dendron, but aims to be friendly with any note taking system that uses markdown and \[\[wiki links]].

## proposals
- include support in jekyll, kramdown, and/or markdown spec for the following:
    - potential responsibility overlap between jekyll/kramdown (and you can't assign urls in css, which makes things tricky...):
        - \[\[wiki link]] 
        - \[\[wiki link#header]]
        - \[\[wiki link#^block]]
        - \!\[\[note transclusion/embed]]
    - \[\>right-sidenote], \[\<left-sidenote]
- a proposal on note structures for docs: imagine finding the relevant doc, but it doesn't make sense. you're lacking prior knowledge, context, or some fundamental that's blocking you from understanding how the thing works. imagine all of a node's children are representative of the needed prior knowledge. now, all you have to do is glance down the list of children and visit whichever ones you don't understand to fully understand the current one. keep digging until you've got it all down.

## gotchas worth writing about
- 'filter' when i was googling for "conditionally add circle d3": https://stackoverflow.com/questions/28415005/d3-js-selection-conditional-rendering
	- this is such a good example of why search is not enough -- even one wrong word can completely hide info from you.
- light/dark theme scss for jekyll.
- emoji url gotcha -- better unicode support.
- jekyll inability to create page from single data entry.
- sidenote syntax ([<right-sidenote], [>left-sidenote])
- jekyll's lack of \[\[wiki link]] support.
- jekyll collections and lack of `notes` support.

## known issues
- if current note is root note, its node in the graph doesn't highlight. (see `isCurrentNoteIn(Graph/Tree)` to fix).
- broken \[\[wiki links]] break footnotes.
    - does this mean that local plugins are run **before** the kramdown parser??
- \[\[wiki links]] break charts.

## wants
- sort of want to abandon the 'mobile first' approach (see `layout.scss`) and make the scss more explicit about what screen the logic is targetting.
    - this mostly means applying `@include mq(sm)` where 'default' behavior is set to only really make sense on mobile.
    - see: https://css-tricks.com/snippets/css/media-queries-for-standard-devices/
- typescript with d3: https://www.npmjs.com/package/@types/d3

## refactorable
- `plant-tag` in `content.scss` exists because pages aren't currently run through the 
- could stand to flesh out color pallettes in the manner 'just the docs' did for _variables.scss.
- use typescript with d3? https://medium.com/react-courses/first-steps-d3-with-react-typescript-part-i-setting-up-your-first-project-d29802e6f6b3
- populate `gbed`-related data from notes themselves -- this would allow for dynamic site layout spec definition while edited one's notes.
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

## influences
- blockquote decoration
    - https://codepen.io/jimmycow/pen/LmjVaz
    - https://codepen.io/JoeHastings/pen/MOdRVm
- [digital garden jekyll template](https://github.com/maximevaillancourt/digital-garden-jekyll-template)
    - d3 graph.
    - bidirectional links plugin.
- [simply jekyll](https://github.com/raghuveerdotnet/simply-jekyll)
    - referenced for sidenote implementation.
    - referenced hover popups.
- [tufte css](https://github.com/edwardtufte/tufte-css)
    - sidenotes.
- [gwern.net](https://github.com/gwern/gwern.net)
    - referenced sidenote comparisons.
- [just the docs](https://github.com/pmarsceill/just-the-docs)
    - started with their .scss as a base. 
    - breadcrumbs.
- and, of course, the [jekyll step-by-step](https://jekyllrb.com/docs/step-by-step/01-setup/).
