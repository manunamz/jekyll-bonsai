---
---

export default class GraphNav {

  constructor() {
    // this.graphType set in initGraphType();
    this.svgWrapper = document.getElementById('graph');
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
    this.svgWrapper.addEventListener('draw', () => {
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
    d3.select(this.svgWrapper).selectAll('svg > *').remove();
  
    let theme_attrs = {};
    // set theme-dependent graph attributes.
    if (document.getElementById('theme-colors-checkbox').checked) {
      theme_attrs = {
        "name": "dark",
        "radius": 5.5,
        "missing-radius": 5.5,
        "missing-node-color": "#00000000",
        "link-color": "#44434d",
        "text-color": "#e6e1e8",
      }
    } else {
        theme_attrs = {
        "name": "light",
        "radius": 6,
        "missing-radius": 4,
        "missing-node-color": "#8C6239",
        "link-color": "#8C6239",
        "text-color": "#5c5962",
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
      const highlightNodes = new Set();
      const highlightLinks = new Set();
      let hoverNode = null;

      const Graph = ForceGraph()

      (document.getElementById('graph'))
        // data
        .graphData(data)
        // container
        .height(window.innerHeight)
        .width(document.getElementById('graph').parentElement.clientWidth)
        // node
        .nodeCanvasObject((node, ctx) => nodePaint(node, ctx, theme_attrs))
        // .nodePointerAreaPaint((node, color, ctx, scale) => nodePaint(node, nodeTypeInNetWeb(node), ctx, theme_attrs))
        .nodeId('id')
        .nodeLabel('label')
        .onNodeClick(goToEntryFromNetWeb)
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
        // .onNodeHover(node => {
        //   highlightNodes.clear();
        //   highlightLinks.clear();
        //   if (node) {
        //     highlightNodes.add(node);
        //     node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
        //     node.links.forEach(link => highlightLinks.add(link));
        //   }
        //   hoverNode = node || null;
        // })
        // .onLinkHover(link => {
        //   highlightNodes.clear();
        //   highlightLinks.clear();
        //   if (link) {
        //     highlightLinks.add(link);
        //     highlightNodes.add(link.source);
        //     highlightNodes.add(link.target);
        //   }
        // })
        // .autoPauseRedraw(false) // keep redrawing after engine has stopped
        // .nodeCanvasObjectMode(node => highlightNodes.has(node) ? 'before' : undefined)
        // .linkDirectionalParticles(4)
        // .linkDirectionalParticleWidth(link => highlightLinks.has(link) ? 4 : 0);
        // zoom
        // (fit to canvas when engine stops)
        // .onEngineStop(() => Graph.zoomToFit(400))

        elementResizeDetectorMaker().listenTo(
          document.getElementById('graph'),
          function(el) {
            Graph.width(el.offsetWidth);
            Graph.height(el.offsetHeight);
          }
        );
      });

      function nodePaint(node, ctx, theme_attrs) {
        const nodeTypeInfo = nodeTypeInNetWeb(node, theme_attrs);
        // draw nodes (canvas circle)
        ctx.fillStyle = nodeTypeInfo["color"];
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeTypeInfo["radius"], 0, 2 * Math.PI, false);
        ctx.fill();
        if (theme_attrs["name"] === "dark") {
          // draw node borders
          ctx.lineWidth = nodeTypeInfo["radius"] / 3;
          ctx.strokeStyle = theme_attrs["link-color"];
          ctx.stroke();
        }
        // add peripheral node text
        ctx.fillStyle = theme_attrs["text-color"];
        ctx.fillText(node.label, node.x + nodeTypeInfo["radius"] + 1, node.y + nodeTypeInfo["radius"] + 1);
      };
      

    function goToEntryFromNetWeb (d, e) {
      if (!isMissingEntryInNetWeb(d)) {
        window.location.href = d.url;
      } else {
        return null;
      }
    };

    function nodeTypeInNetWeb(node, theme_attrs) {
      const isVisited = isVisitedEntryInNetWeb(node);
      const isMissing = isMissingEntryInNetWeb(node);            
      if (isVisited) {
        return {
          "type": "visited",
          "color": "#31AF31",
          "radius": theme_attrs["radius"],
        }
      } else if (!isVisited && !isMissing) {
        return {
          "type": "unvisited",
          "color": "#9cbe9c",
          "radius": theme_attrs["radius"],
        }
      } else if (isMissing) {
        return {
          "type": "missing",
          "color": theme_attrs["missing-node-color"],
          "radius": theme_attrs["missing-radius"],
        }
      } else {
        console.log("WARN: Not a valid node type.");
        return null;
      }
    }

    // function isCurrentEntryInNetWeb(node) {
    //   return !isMissingEntryInNetWeb(node) && window.location.pathname.includes(node.url);
    // }

    // function isPostTaggedInNetWeb(node) {
    //   // const isPostPage = window.location.pathname.includes("post");
    //   // if (!isPostPage) return false;
    //   const semTags = Array.from(document.getElementsByClassName("sem-tag"));
    //   const tagged = semTags.filter((semTag) => 
    //     !isMissingEntryInNetWeb(node) && semTag.href.includes(node.url)
    //   );
    //   return tagged.length !== 0;
    // }

    function isVisitedEntryInNetWeb(node) {
      if (!isMissingEntryInNetWeb(node)) {
        var visited = JSON.parse(localStorage.getItem('visited'));
        for (let i = 0; i < visited.length; i++) {
          if (visited[i]['url'] === node.url) return true;
        }
      }
      return false;
    }

    function isMissingEntryInNetWeb(node) {
      return node.url === '';
    }
  }
  
  drawTree (theme_attrs) { 
    // d3.json has been async'd: https://stackoverflow.com/questions/49768165/code-within-d3-json-callback-is-not-executed 
    d3.json("{{ site.baseurl }}/assets/graph-tree.json")
      .then(function(data) {
          // console.log('d3 is building a tree');
          // console.log(data);
          const svgWrapper = document.getElementById('graph');
          const width = +svgWrapper.getBoundingClientRect().width / 2;
          const height = +svgWrapper.getBoundingClientRect().height / 2;
          const svg = d3.select(svgWrapper)
              .attr("viewBox", [-width / 2, -height / 2, width, height]);

          const root = d3.hierarchy(data);
          const links = root.links();
          flatten(root);
          const nodes = root.descendants();
  
          const simulation = d3.forceSimulation(nodes)
              .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
              .force("charge", d3.forceManyBody().strength(-50))
              .force("collide", d3.forceCollide())
              .force("center", d3.forceCenter())
              // see: https://stackoverflow.com/questions/9573178/d3-force-directed-layout-with-bounding-box?answertab=votes#tab-top
              // 'center of gravity'            
              .force("forceX", d3.forceX()
                  .strength(.3)
                  .x(.9))
              .force("forceY", d3.forceY()
                  .strength(.1)
                  .y(.9));

          const link = svg.append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(links)
              .join("line");
        
          const node = svg.append('g')
              .attr('class', 'nodes')
              .selectAll('g')
              .data(nodes)
              .join("g");

          node.append('circle')
                //svg 2.0 not well-supported: https://stackoverflow.com/questions/47381187/svg-not-working-in-firefox
                // add attributes in javascript instead of css.
                .attr("r",  (d) => isMissingEntryInTree(d) ? theme_attrs["missing-radius"] : theme_attrs["radius"])
                .attr("class", nodeTypeInTree)
                .on("click", goToEntryFromTree)
                .on("mouseover", onMouseover)
                .on("mouseout", onMouseout)
                // 🐛 bug: this does not work -- it overtakes clicks (extra lines in "tick" are related).
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended)
                    .touchable(true));
          
          // from: https://stackoverflow.com/questions/28415005/d3-js-selection-conditional-rendering
          // use filtering to deal with specific nodes
          // from: https://codepen.io/blackjacques/pen/BaaqKpO
          // add node pulse on the current node
          node.filter( function(d,i) { return isCurrentEntryInTree(d); })
              .append("circle")
              .attr("r",  (d) => theme_attrs["radius"])
              .classed("pulse", true)
              .on("mouseover", onMouseover)
              .on("mouseout", onMouseout)
              .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
                .touchable(true));
  
          node.filter( function(d,i) { return isPostTaggedInTree(d); })
              .append("circle")
              .attr("r", theme_attrs["radius"])
              .classed("pulse-sem-tag", (d) => isPostTaggedInTree(d) ? true : null)
              .on("click", goToEntryFromTree)
              .on("mouseover", onMouseover)
              .on("mouseout", onMouseout)
              .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended)
                  .touchable(true));  

          const text = svg.append('g')
                          .attr('class', 'text')
                          .selectAll('text')
                          .data(nodes)
                          .join("text")
                            .attr("font-size", "20%")
                            .attr("dx", 5)
                            .attr("dy", ".05em")
                            .text((d) => isMissingEntryInTree(d) ? "Missing Entry" : d.data.label)
                            .on("mouseover", onMouseover)
                            .on("mouseout", onMouseout);

          simulation.on("tick", () => {
              // from: https://mbostock.github.io/d3/talk/20110921/parent-foci.html
              // preserve hierarchical shape via link positioning
              var kx = .2 * simulation.alpha();
              var ky = 1.3 * simulation.alpha();
              links.forEach(function(d, i) {
                d.target.x += (d.source.x - d.target.x) * kx;
                d.target.y += (d.source.y + (height * .35) - d.target.y) * ky;
              });

              link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
              node
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });  
              text
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
          });
  
           //
          // helpers
           //
          function isCurrentEntryInTree(node) {
            return !isMissingEntryInTree(node) && window.location.pathname.includes(node.data.url);
          }

          function isPostTaggedInTree(node) {
            // const isPostPage = window.location.pathname.includes("post");
            // if (!isPostPage) return false;
            const semTags = Array.from(document.getElementsByClassName("sem-tag"));
            const tagged = semTags.filter((semTag) => 
              !isMissingEntryInTree(node) && semTag.href.includes(node.data.url)
            );
            return tagged.length !== 0;
          }

          function nodeTypeInTree(node) {
            const isVisited = isVisitedEntryInTree(node);
            const isMissing = isMissingEntryInTree(node);            
            if (isVisited) {
              return "visited";
            } else if (!isVisited && !isMissing) {
              return "unvisited";
            } else if (isMissing) {
              return "missing";
            } else {
              console.log("WARN: Not a valid node type.");
              return null;
            }
          }

          function isVisitedEntryInTree(node) {
            var visited = JSON.parse(localStorage.getItem('visited'));
            for (let i = 0; i < visited.length; i++) {
              if (visited[i]['url'] === node.data.url) {
                return true;
              }
            }
            return false;
          }
  
          function isMissingEntryInTree(node) {
            return node.data.url === "";
          }
  
          // from: https://stackoverflow.com/questions/63693132/unable-to-get-node-datum-on-mouseover-in-d3-v6
          // d6 now passes events in vanilla javascript fashion
          function goToEntryFromTree(e, d) {
            if (!isMissingEntryInTree(d)) {
              window.location.href = d.data.url;
              return true;
            } else {
              return false;
            }
          };    

          function onMouseover(e, d) {
            const linkedNodesSet = new Set();
            links
              .filter((n) => n.target.data.id == d.data.id || n.source.data.id == d.data.id)
              .forEach((n) => {
                linkedNodesSet.add(n.target.data.id);
                linkedNodesSet.add(n.source.data.id);
              });
      
            node.attr("class", (node_d) => {
              if (node_d.data.id !== d.data.id && !linkedNodesSet.has(node_d.data.id)) {
                return "inactive";
              }
              return "active";
            });
      
            link.attr("class", (link_d) => {
              if (link_d.source.data.id !== d.data.id && link_d.target.data.id !== d.data.id) {
                return "inactive";
              }
              return "active";
            });
      
            text.attr("class", (text_d) => {
              if (text_d.data.id !== d.data.id) {
                return "inactive";
              }
              return "active";
            });
          };
      
          function onMouseout(d) {
            node.attr("class", "");
            link.attr("class", "");
            text.attr("class", "");
          };

          function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
  
          function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
          }
  
          function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }
                            
          function flatten(root) {
            var nodes = [];
            function recurse(node) {
              if (node.descendents) node.descendents.forEach(recurse);
              nodes.push(node);
            }
            recurse(root);
            return nodes;
          }
      })
      .catch(function(error) {
          console.log(error);
      });
  }
}
