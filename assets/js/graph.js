---
---

export default class GraphNav {

  constructor() {
    // this.graphType set in initGraphType();
    this.canvas = document.getElementById('graph');
    this.graphTypeCheckBox = document.getElementById('graph-type-checkbox');
    this.graphTypeEmojiSpan = document.getElementById('graph-type-emoji-span');
    this.init();
  }

  init() {
    this.initGraphType();
    this.bindEvents();
    this.drawD3Nav();
  }
  
  bindEvents() {
    // listen for draw event (esp. from theme colors)
    this.canvas.addEventListener('draw', () => {
      this.updateGraphType();
      this.drawD3Nav();
    });
    this.graphTypeCheckBox.addEventListener('click', () => {
      this.updateGraphType();
      this.drawD3Nav();
    });
  }
  
  // how to checkbox: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_display_checkbox_text
  drawD3Nav() {
    // destroy old chart   
    // d3.select(this.canvas).selectAll('svg > *').remove();
    
    let theme_attrs = {};
    // set theme-dependent graph attributes.
    if (document.getElementById('theme-colors-checkbox').checked) {
      theme_attrs = {
        "name": "dark",
        "radius": 5.5,
        "missing-radius": 5.5,
        "current-node-color": "#F0C61F",   // yellow
        "tagged-node-color": "#a87f32",    // sand/yellow-orange-brown
        "missing-node-color": "#00000000", // => $transparent
        "unvisited-node-color": "#3e5c50", // => $green-400
        "visited-node-color": "#31AF31",   // => $green-05
        "glow-color": "#31AF31",           // => $green-05
        "link-color": "#44434d",           // => $grey-dk-200
        "link-pulse-color": "#959396",     // => $grey-dk-000
        "text-color": "#e6e1e8",           // => $body-text-color => $grey-lt-300
      }
    } else {
      theme_attrs = {
        "name": "light",
        "radius": 6,
        "missing-radius": 4,
        "current-node-color": "#F0C61F",   // yellow
        "tagged-node-color": "#a87f32",    // sand/yellow-orange-brown
        "missing-node-color": "#8C6239",   // => $brown-02 
        "unvisited-node-color": "#9cbe9c", // => $green-05
        "visited-node-color": "#31AF31",   // => $green-03
        "glow-color": "#00000000",         // => $transparent
        "link-color": "#8C6239",           // => $brown-02 
        "link-pulse-color": "#5c5962",     // => $body-text-color => $grey-dk-100
        "text-color": "#5c5962",           // => $body-text-color => $grey-dk-100
      }
    }
    // redraw new chart
    if (this.graphTypeCheckBox.checked) {
      this.drawTree(theme_attrs);
    } else {
      this.drawNetWeb(theme_attrs);
    }
  }
  
  initGraphType() {
    this.graphType = localStorage.getItem('graph-type');
    if (this.graphType !== "tree" && this.graphType !== "net-web") {
      this.graphType = '{{ site.graph_type }}';	
    }
    this.graphTypeCheckBox.checked = (this.graphType === "tree");
    this.updateGraphType();
  }

  updateGraphType() {
    if (this.graphTypeCheckBox.checked) {
      this.graphTypeEmojiSpan.innerText = "{{ site.emoji.net-web }}";
      this.graphType = "tree";
    } else {
      this.graphTypeEmojiSpan.innerText = "{{ site.emoji.tree }}";
      this.graphType = "net-web";
    }
    localStorage.setItem('graph-type', this.graphType);
  } 

  // d3
  drawNetWeb (theme_attrs) {
    fetch('{{ site.baseurl }}/assets/graph-net-web.json').then(res => res.json()).then(data => {
      
      data.links.forEach(link => {
        // the differing method of access is probably a code-smell
        // from: https://github.com/vasturiano/force-graph/blob/c3879c0a42f65c7abd15be74069c2599e8f56664/example/highlight/index.html#L26
        const a = data.nodes.filter(node => node.id === link.source)[0];
        const b = data.nodes.filter(node => node.id === link.target)[0];
        a.neighbors.push(b);
        b.neighbors.push(a);

        a.links.push(link);
        b.links.push(link);
      });
      
      const highlightNodes = new Set();
      const highlightLinks = new Set();
      let hoverNode = null;
      let hoverLink = null;

      const Graph = ForceGraph()

      (document.getElementById('graph'))
        // container
        .height(document.getElementById('graph').parentElement.clientHeight)
        .width(document.getElementById('graph').parentElement.clientWidth)
        // node
        .nodeCanvasObject((node, ctx) => this.nodePaint(node, ctx, theme_attrs, hoverNode, hoverLink))
        // .nodePointerAreaPaint((node, color, ctx, scale) => nodePaint(node, nodeTypeInNetWeb(node), ctx, theme_attrs))
        .nodeId('id')
        .nodeLabel('label')
        .onNodeClick((node, event) => this.goToPage(node, event))
        // link
        .linkSource('source')
        .linkTarget('target')
        .linkColor(() => theme_attrs["link-color"])
        // forces
        // .d3Force('link',    d3.forceLink()
        //                       .id(function(d) {return d.id;})
        //                       .distance(30)
        //                       .iterations(1))
        //                       .links(data.links))
        .d3Force('charge',  d3.forceManyBody().strength(-300))
        // .d3Force('collide', d3.forceCollide())
        // .d3Force('center',  d3.forceCenter())
        .d3Force('forceX',  d3.forceX()
                              .strength(.3)
                              .x(.75))
        .d3Force('forceY', d3.forceY()
                             .strength(.1)
                             .y(.9))
        // highlight nodes on hover
        .autoPauseRedraw(false) // keep redrawing after engine has stopped
        .onNodeHover(node => {
          highlightNodes.clear();
          highlightLinks.clear();
          if (node) {
            highlightNodes.add(node);
            node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
            node.links.forEach(link => highlightLinks.add(link));
          }
          hoverNode = node || null;
        })
        .onLinkHover(link => {
          highlightNodes.clear();
          highlightLinks.clear();
          if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
          }
          hoverLink = link || null;
        })
        .linkDirectionalParticles(4)
        .linkDirectionalParticleWidth(link => highlightLinks.has(link) ? 2 : 0)
        .linkDirectionalParticleColor(() => theme_attrs["link-pulse-color"])
        // zoom
        // (fit to canvas when engine stops)
        // .onEngineStop(() => Graph.zoomToFit(400))
        // data
        .graphData(data);

        elementResizeDetectorMaker().listenTo(
          document.getElementById('graph'),
          function(el) {
            Graph.width(el.offsetWidth);
            Graph.height(el.offsetHeight);
          }
        );
      });
  }
  
  drawTree (theme_attrs) { 
    fetch('{{ site.baseurl }}/assets/graph-tree.json').then(res => res.json()).then(data => {
      
      // data.links.forEach(link => {
      //   // the differing method of access is probably a code-smell
      //   // from: https://github.com/vasturiano/force-graph/blob/c3879c0a42f65c7abd15be74069c2599e8f56664/example/highlight/index.html#L26
      //   const a = data.nodes.filter(node => node.id === link.source)[0];
      //   const b = data.nodes.filter(node => node.id === link.target)[0];
      //   a.neighbors.push(b);
      //   b.neighbors.push(a);

      //   a.links.push(link);
      //   b.links.push(link);
      // });

      data.links.forEach(link => {
        // the differing method of access is probably a code-smell
        // from: https://github.com/vasturiano/force-graph/blob/c3879c0a42f65c7abd15be74069c2599e8f56664/example/highlight/index.html#L26
        const a = data.nodes.filter(node => node.id === link.source)[0];
        const b = data.nodes.filter(node => node.id === link.target)[0];
        a.neighbors.push(b);
        b.neighbors.push(a);

        a.links.push(link);
        b.links.push(link);
      });

      const highlightNodes = new Set();
      const highlightLinks = new Set();
      let hoverNode = null;
      let hoverLink = null;

      const Graph = ForceGraph()

      (document.getElementById('graph'))
        // dag-mode (tree) 
        .dagMode('td')
        .dagLevelDistance(100)
        // .dagLevelDistance(() => setLevelDistance)
        // container
        .height(document.getElementById('graph').parentElement.clientHeight)
        .width(document.getElementById('graph').parentElement.clientWidth)
        // node
        .nodeCanvasObject((node, ctx) => this.nodePaint(node, ctx, theme_attrs, hoverNode, hoverLink))
        // .nodePointerAreaPaint((node, color, ctx, scale) => nodePaint(node, nodeTypeInNetWeb(node), ctx, theme_attrs))
        .nodeId('id')
        .nodeLabel('label')
        .onNodeClick((node, event) => this.goToPage(node, event))
        // link
        .linkSource('source')
        .linkTarget('target')
        .linkColor(() => theme_attrs["link-color"])
        // forces
        // .d3Force('link',    d3.forceLink()
        //                       .id(function(d) {return d.id;})
        //                       .distance(30)
        //                       .iterations(1))
        //                       .links(data.links))
        .d3Force('charge',  d3.forceManyBody().strength(-100))
        // .d3Force('collide', d3.forceCollide())
        // .d3Force('center',  d3.forceCenter())
        .d3Force('forceX',  d3.forceX()
                              .strength(.3)
                              .x(.9))
        .d3Force('forceY', d3.forceY()
                             .strength(.1)
                             .y(.9))
        // highlight nodes on hover
        .autoPauseRedraw(false) // keep redrawing after engine has stopped
        .onNodeHover(node => {
          highlightNodes.clear();
          highlightLinks.clear();
          if (node) {
            highlightNodes.add(node);
            node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
            node.links.forEach(link => highlightLinks.add(link));
          }
          hoverNode = node || null;
        })
        .onLinkHover(link => {
          highlightNodes.clear();
          highlightLinks.clear();
          if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
          }
          hoverLink = link || null;
        })
        .linkDirectionalParticles(4)
        .linkDirectionalParticleWidth(link => highlightLinks.has(link) ? 2 : 0)
        .linkDirectionalParticleColor(() => theme_attrs["link-pulse-color"])
        // zoom
        // (fit to canvas when engine stops)
        // .onEngineStop(() => Graph.zoomToFit(400))
        // data
        .graphData(data);
        
        elementResizeDetectorMaker().listenTo(
          document.getElementById('graph'),
          function(el) {
            Graph.width(el.offsetWidth);
            Graph.height(el.offsetHeight);
          }
        );
      });
  }

  // draw helpers

  nodePaint(node, ctx, theme_attrs, hoverNode, hoverLink) {
    const nodeTypeInfo = this.isNodeType(node, theme_attrs);
    let fillText = true;
    // 
    // draw nodes (canvas circle)
    // 
    ctx.fillStyle = nodeTypeInfo["color"];
    ctx.beginPath();
    // 
    // hover behavior
    // 
    if (node === hoverNode) {
      // hoverNode
      nodeTypeInfo["radius"] *= 2;
      fillText = false; // node label should be active
    } else if (hoverNode !== null && hoverNode.neighbors.includes(node)) {
      // neighbor to hoverNode
    } else if (hoverNode !== null && !hoverNode.neighbors.includes(node)) {
      // non-neighbor to hoverNode
      fillText = false;
    } else if ((hoverNode === null && hoverLink !== null) && (hoverLink.source === node || hoverLink.target === node)) {
      // neighbor to hoverLink
      fillText = true;
    } else if ((hoverNode === null && hoverLink !== null) && (hoverLink.source !== node && hoverLink.target !== node)) {
      // non-neighbor to hoverLink
      fillText = false;
    } else {
      // no hover (default)  
    }
    ctx.arc(node.x, node.y, nodeTypeInfo["radius"], 0, 2 * Math.PI, false);
    // 
    // glow behavior
    // 
    if (this.isCurrentPage(node)) {
      // turn glow on
      ctx.shadowBlur = 30;
      ctx.shadowColor = nodeTypeInfo["current-glow-color"];
    } else if (this.isTag(node)) {
      // turn glow on
      ctx.shadowBlur = 30;
      ctx.shadowColor = nodeTypeInfo["tagged-glow-color"];
    } else if (theme_attrs["name"] === "dark" && nodeTypeInfo["type"] === "visited") {
      // turn glow on
      ctx.shadowBlur = 20;
      ctx.shadowColor = nodeTypeInfo["glow-color"];
    } else {
      // no glow
    }
    ctx.fill();
    // turn glow off
    ctx.shadowBlur = 0;
    ctx.shadowColor = "";
    // 
    // dark customization
    // 
    if (theme_attrs["name"] === "dark") {
      // draw node borders
      ctx.lineWidth = nodeTypeInfo["radius"] * (2 / 5);
      ctx.strokeStyle = theme_attrs["link-color"];
      ctx.stroke();
    }
    // 
    // node labels
    // 
    if (fillText) {
      // add peripheral node text
      ctx.fillStyle = theme_attrs["text-color"];
      ctx.fillText(node.label, node.x + nodeTypeInfo["radius"] + 1, node.y + nodeTypeInfo["radius"] + 1);
    }
  }

  // meta about nodes<=>page relationships

  isNodeType(node, theme_attrs) {
    const isVisited = this.isVisitedPage(node);
    const isMissing = this.isMissingPage(node);            
    if (isVisited) {
      return {
        "type": "visited",
        "radius": theme_attrs["radius"],
        "color": theme_attrs['visited-node-color'],
        "glow-color": theme_attrs["glow-color"],
        "current-glow-color": theme_attrs['current-node-color'],
        "tagged-glow-color": theme_attrs['tagged-node-color'],
      }
    } else if (!isVisited && !isMissing) {
      return {
        "type": "unvisited",
        "radius": theme_attrs["radius"],
        "color": theme_attrs['unvisited-node-color'],
        "glow-color": theme_attrs["glow-color"],
        "current-glow-color": theme_attrs['current-node-color'],
        "tagged-glow-color": theme_attrs['tagged-node-color'],
      }
    } else if (isMissing) {
      return {
        "type": "missing",
        "radius": theme_attrs["missing-radius"],
        "color": theme_attrs["missing-node-color"],
        "glow-color": theme_attrs["glow-color"],
        "current-glow-color": theme_attrs['current-node-color'],
        "tagged-glow-color": theme_attrs['tagged-node-color'],
      }
    } else {
      console.log("WARN: Not a valid node type.");
      return null;
    }
  }

  isCurrentPage(node) {
    return !this.isMissingPage(node) && window.location.pathname.includes(node.url);
  }

  isTag(node) {
    // if (!isPostPage) return false;
    const semTags = Array.from(document.getElementsByClassName("sem-tag"));
    const tagged = semTags.filter((semTag) => 
      !this.isMissingPage(node) && semTag.hasAttribute("href") && semTag.href.includes(node.url)
    );
    return tagged.length !== 0;
  }

  isVisitedPage(node) {
    if (!this.isMissingPage(node)) {
      var visited = JSON.parse(localStorage.getItem('visited'));
      for (let i = 0; i < visited.length; i++) {
        if (visited[i]['url'] === node.url) return true;
      }
    }
    return false;
  }

  isMissingPage(node) {
    return node.url === '';
  }

  // user-actions

  // from: https://stackoverflow.com/questions/63693132/unable-to-get-node-datum-on-mouseover-in-d3-v6
  // d3v6 now passes events in vanilla javascript fashion
  goToPage(node, e) {
    if (!this.isMissingPage(node)) {
      window.location.href = node.url;
      return true;
    } else {
      return false;
    }
  }
}
