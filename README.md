# jekyll bonsai

// some d3 docs: https://github.com/d3/d3-force/blob/master/README.md

Notes require yaml frontmatter with an `id`.

## notable
- case is ignored in \[\[WiKi liNKs]].
- `created` and `updated` timestamps read from note frontmatter are epoch-style timestamps. other timestamps won't register with the weather page.
- garden bed nav items have explicit ordering in their frontmatter.
- 'missing nodes' show up in tree view, but not net-web view.
- terms: `graph` refers to any type of graph of which there are two types: a hierarchical `tree` and a `net-web`.
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

## worth writing about
- setting up testing for jekyll plugins -- esp. configs...
    - a [blog post](https://ayastreb.me/writing-a-jekyll-plugin/) on best practice.
- github pages [doesn't support custom plugins](https://jekyllrb.com/docs/plugins/installation/)...so deploying this as a template people can simply set in their configs won't work.
- breaking up plugin into multiple gems and testing.
    - [an so post](https://stackoverflow.com/questions/12416841/multiple-converters-generators-in-jekyll) on mixing several generators, which points to [this repo](https://github.com/matthewowen/jekyll-slideshow/blob/master/_plugins/jekyll_slideshow.rb) as an example case. (altho i think i'm opting to sep)
    - [a plugin tutorial](https://zinovyev.net/blog/creating-a-jekyll-plugin#start-to-build-the-plugin)
    - [examples](https://jekyllrb.com/docs/plugins/your-first-plugin/) from the jekyll docs.
    - [the bundler gem tutorial](https://bundler.io/guides/creating_gem.html).
    - [the gem tutorial](https://guides.rubygems.org/make-your-own-gem/) -- which links to the bundler tutorial inside.
    - [a post](https://humanwhocodes.com/blog/2019/04/jekyll-hooks-output-markdown/) about hooks and timing.
- pushing jekyll's limits with variable interoperability.
    - [a post](https://brentryanjohnson.com/jekyll-leaflet-variables/) on intermingling liquid and javascript variables...tho i'd rather not do this (and thus haven't...yet? might be worth venturing into hotwire territory, which would render this unecessary...i think).
- hover preview buggy on my template -- doesn't seem buggy on `digital garden theme jekyll`'s template tho...investigating alternatives:
    - want to attach behavior directly to `a` element's [`:hover` attribute](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover)
    - it's about displaying images, but [this jekyll discussion](https://talk.jekyllrb.com/t/hover-and-show-image-at-mouse-location/2647) with [this jsfiddle](https://jsfiddle.net/ke1ojtnh/2/) hint at a more robust solution.
    - [an so post](https://stackoverflow.com/questions/2117046/how-to-show-live-preview-in-a-small-popup-of-linked-page-on-mouse-over-on-link/16625709) on hover preview for external links.
    - [another so post](https://stackoverflow.com/questions/23251569/preview-page-on-link-hover) that also uses mouse events to dynamically attach "hover" behavior for external link previews (codepen doesn't work tho).
- writing a custom liquid template filter.
- 'filter' when i was googling for "conditionally add circle d3": https://stackoverflow.com/questions/28415005/d3-js-selection-conditional-rendering
	- this is such a good example of why search is not enough -- even one wrong word can completely hide info from you.
- light/dark theme scss for jekyll: this was a freaking odyssey.
    - [this](https://medium.com/@katiemctigue/how-to-create-a-dark-mode-in-sass-609f131a3995) is much [cleaner](https://github.com/kaitlinmctigue/kaitlinmctigue.github.io/blob/source/src/styles/_color-themes.scss) and would allow for transitions, but requires syntactic sugar wherever theme variables are mentioned. 
	- there is also this [pseudo-fork](https://github.com/hadalin/dark-mode-sass) [here](https://codepen.io/hadalin/project/editor/XGWKex) that makes this scss approach work for jekyll-like sites (e.g. static generators?). same pluses and minuses apply.
    - there was [this pull request](https://github.com/pdmosses/just-the-docs/commit/f0408bdd15d662b9ad2f08871f3e201a9d7e2d46) on just-the-docs, which i largely pulled from in the end. ([demo here](https://pdmosses.github.io/just-the-docs/))
    - that pull request builds on [this blog post](https://derekkedziora.com/blog/dark-mode) with [this repo](https://github.com/derekkedziora/jekyll-demo)...it was [updated here](https://derekkedziora.com/blog/dark-mode-revisited), but i don't use much of it, i think...
    - there is also [this blog post](https://francisoliver.dev/blog/dark-mode-in-jekyll), which mentioned `turbolinks` and sent me down the `hotwire` rabbit hole...that looks like something i might want to check out later.
    - there was also this [css tricks article](https://css-tricks.com/dark-modes-with-css/) which talks about the `prefers-color-scheme` media query and introduces css variables.
    - related to css variables, [this guy](https://dev.to/zetareticoli/dark-mode-with-sass-and-css-variables-4f9b) does something similar to the first article in this lineup, but with css `var()`s instead of `scssFunc()s` -- he then toggles via adding/removing a `dark` css class (or whatever the theme name is). ([this](https://codepen.io/zetareticoli/pen/MROMZE) is the codepen)
    - then there is [this woman](https://dev.to/ananyaneogi/create-a-dark-light-mode-switch-with-css-variables-34l8) who has a similar solution, but toggles via the html `data-theme` attribute instead of messing with classes.
    - here's a [random SO post](https://stackoverflow.com/questions/56300132/how-to-override-css-prefers-color-scheme-setting) on toggling color-schemes. (method similar to previous blog post)
    - i was hoping to make [max bock's themeswitcher](https://mxb.dev/blog/color-theme-switcher/#h-get-creative) work originally, but backed off when i found out that it [relies on json](https://github.com/maxboeck/mxb/blob/master/src/data/themes.json) to define the color hex values.
    - i found this [minimal mistakes discussion](https://github.com/mmistakes/minimal-mistakes/discussions/2033) on dark mode interesting -- [the maintainer doesn't want to implement it](https://github.com/mmistakes/minimal-mistakes/discussions/2033#discussioncomment-172674) --- but [someone did it anyway](https://trungk18.com/experience/dark-theme-jekyll/).
- emoji url gotcha -- better unicode support.
- jekyll inability to create page from single data entry.
    - which led me to [jekyll-datapage_gen](https://github.com/avillafiorita/jekyll-datapage_gen)...but i didn't use it due to my lack of understanding or bugs.
- sidenote syntax ([>right-sidenote], [<left-sidenote])
    - [gwern's summary of sidenote solutions](https://www.gwern.net/Sidenotes)
    - tufte css (included above)
- jekyll's lack of \[\[wiki link]] support.
- jekyll collections and lack of `notes` support.
    - [walking through collection items and counting tags](https://talk.jekyllrb.com/t/count-for-tagged-items-in-a-collection/291)
    - [commentor's working example on his blog](https://dieghernan.github.io/tags/)
    - [related SO question](https://stackoverflow.com/questions/36479756/counting-collection-tags-in-jekyll)
    - [SO profile](https://stackoverflow.com/users/569306/jason-heppler) and [github profile](https://github.com/hepplerj) of someone who seems to be doing a lot of the same stuff

## known issues
- graph sometimes renders as super tiny.
- firefox (and safari) don't support svg 2.0 -- [an so answer on that](https://stackoverflow.com/questions/51551729/styling-of-svg-circle-doesn%C2%B4t-work-in-firefox-browser-removes-radius-property).
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
- in plugin: `namespace.match('([^.]*$)')[0].gsub('-', ' ')`...
- there are some `:not`s used around the css and javascript with regard to `plant-list-item` and differentiating between `wiki-link` and vanilla external links...this logic could be better consolidated...
- `wiki-link` is hard-coded in the weather page and on the plant layout.
- could stand to flesh out color pallettes in the manner 'just the docs' did for _variables.scss.
- use typescript with d3? https://medium.com/react-courses/first-steps-d3-with-react-typescript-part-i-setting-up-your-first-project-d29802e6f6b3
- populate `plant`-related data from notes themselves -- this would allow for dynamic site layout spec definition while edited one's notes.
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
- [so answer on enter/update/exit](https://stackoverflow.com/questions/46147231/selecting-null-what-is-the-reason-behind-selectallnull-in-d3)
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
