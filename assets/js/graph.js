---
---
export default class GraphNav {

  constructor() {
    // this.graphType set in initGraphType();
    this.svgWrapper = document.getElementById('svg-graph');
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
      this.updateGraphTypeEmoji();
      this.drawD3Nav();
    });
    this.graphTypeCheckBox.addEventListener('click', () => {
      this.updateGraphTypeEmoji();
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
        "radius": 2.5,
        "missing-radius": 2.5,
      }
    } else {
        theme_attrs = {
        "name": "light",
        "radius": 3,
        "missing-radius": 1.5,
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
    this.updateGraphTypeEmoji();
  }

  updateGraphTypeEmoji() {
    if (this.graphTypeCheckBox.checked) {
      this.graphTypeEmojiSpan.innerHTML = "🕸";
      this.graphType = "tree";
    } else {
      this.graphTypeEmojiSpan.innerHTML = "🌳";
      this.graphType = "net-web";
    }
    window.localStorage.setItem('graph-type', this.graphType);
  } 

  // d3
  drawNetWeb (theme_attrs, funcs) {
    // d3.json has been async'd: https://stackoverflow.com/questions/49768165/code-within-d3-json-callback-is-not-executed 
    d3.json("/assets/notes_net_web.json")
      .then(function(data) {       
          // console.log('d3 is building a tree');
          // console.log(data);      
          const svgWrapper = document.getElementById('svg-graph');
          const width = +svgWrapper.getBoundingClientRect().width / 2;
          const height = +svgWrapper.getBoundingClientRect().height / 2;
          const svg = d3.select(svgWrapper)
              .attr("viewBox", [-width / 2, -height / 2, width, height]);
          
          const simulation = d3.forceSimulation()
              .nodes(data.nodes)
              .force("link", d3.forceLink()
                  .id(function(d) {return d.id;})
                  .distance(30)
                  .iterations(1)
                  .links(data.links))
              .force("charge", d3.forceManyBody().strength(-50))
              .force("collide", d3.forceCollide())
              .force("center", d3.forceCenter())
              // see: https://stackoverflow.com/questions/9573178/d3-force-directed-layout-with-bounding-box?answertab=votes#tab-top
              // 'center of gravity'
              .force("forceX", d3.forceX()
                  .strength(.5)
                  .x(.75))
              .force("forceY", d3.forceY()
                  .strength(.1)
                  .y(.9));
  
          const link = svg.append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(data.links)
              .enter().append("line");
  
          // complete node
          const node = svg.selectAll('.nodes')
              .data(data.nodes)
              .enter().append('g')
              .attr('class', 'nodes')
              .attr("active", (d) => isCurrentNoteInNetWeb(d) ? true : null)
          // node's circle
          node.append('circle')
              //svg 2.0 not well-supported: https://stackoverflow.com/questions/47381187/svg-not-working-in-firefox
              // add attributes in javascript instead of css.
              .attr("r",  (d) => isMissingNote(d) ? theme_attrs["missing-radius"] : theme_attrs["radius"])
              .attr("class", (d) => isMissingNote(d) ? "missing" : null)
              .on("click", goToNoteFromNetWeb)
              .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended)
                  .touchable(true))
          // node's label
          // labels need to be nested in a 'g' object alongside the node circle.
          //  docs: https://bl.ocks.org/mbostock/950642
          //  so post: https://stackoverflow.com/questions/49443933/node-labelling-not-working-d3-v5
          //    plnkr: http://plnkr.co/edit/6GqleTU89bSrd9hFQgI2?preview
          node.append("text")
              .attr("dx", 5)
              .attr("dy", ".05em")
              .attr("font-size", "20%")
              .text(function (d) { return d.label });
          // node's tooltip
          node.append("title")
              .text(function(d) { return d.label; });
          // from: https://stackoverflow.com/questions/28415005/d3-js-selection-conditional-rendering
          // use filtering to deal with specific nodes
          // from: https://codepen.io/blackjacques/pen/BaaqKpO
          // add node pulse on the current node
          node.filter( function(d,i) { return isCurrentNoteInNetWeb(d); })
              .append("circle")
              .attr("r", theme_attrs["radius"])
              .classed("pulse", (d) => isCurrentNoteInNetWeb(d) ? true : null)
              .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended)
                  .touchable(true));
  
          simulation.on("tick", () => {
              // node.attr('transform', d => `translate(${d.x},${d.y})`); 
              link
                  .attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; });
              node
                  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
          });
  
           //
          // helpers
           //
  
          function isCurrentNoteInNetWeb(node) {
            if (window.location.pathname == "/") {
              return !isMissingNote(node) && node.label === "{{ site.index_note_title }}";
            } else {
              return !isMissingNote(node) && window.location.pathname.includes(node.id);
            }
          }
          
          function isMissingNote(node) {
            return node.id === node.label;
          }
  
          // from: https://stackoverflow.com/questions/63693132/unable-to-get-node-datum-on-mouseover-in-d3-v6
          // d6 now passes events in vanilla javascript fashion
          function goToNoteFromNetWeb (e, d) {
            if (!isMissingNote(d.id)) {
              if (d.label == '{{ site.index_note_title }}') {
                window.location = '/';
              } else {
                // i have no idea why this needs the preceeding '/'
                window.location = `/note/${d.id}`;
              }
            } else {
              return null;
            }
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
      })
      .catch(function(error) {
          console.log(error);
      });
  }
  
  drawTree (theme_attrs) { 
    // d3.json has been async'd: https://stackoverflow.com/questions/49768165/code-within-d3-json-callback-is-not-executed 
    d3.json("/assets/notes_tree.json")
      .then(function(data) {
          // console.log('d3 is building a tree');
          // console.log(data);
          const svgWrapper = document.getElementById('svg-graph');
          const width = +svgWrapper.getBoundingClientRect().width / 2;
          const height = +svgWrapper.getBoundingClientRect().height / 2;
          const svg = d3.select(svgWrapper)
              .attr("viewBox", [-width / 2, -height / 2, width, height]);
          
          const root = d3.hierarchy(data);
          const links = root.links();
          // flatten(root);
          const nodes = root.descendants();
  
          const simulation = d3.forceSimulation(nodes)
              .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
              .force("charge", d3.forceManyBody().strength(-50))
              .force("collide", d3.forceCollide())
              .force("center", d3.forceCenter())
              // see: https://stackoverflow.com/questions/9573178/d3-force-directed-layout-with-bounding-box?answertab=votes#tab-top
              // 'center of gravity'            
              .force("forceX", d3.forceX()
                  .strength(.5)
                  .x(.9))
              .force("forceY", d3.forceY()
                  .strength(.1)
                  .y(.9));
    
          const link = svg.append("g")
              .attr("class", "links")
              .selectAll("line")
              .data(links)
              .join("line");
  
          // complete node
          const node = svg.selectAll('.nodes')
              .data(nodes)
              .enter().append('g')
              .attr('class', 'nodes')               
          // node's circle
          node.append("circle")
              //svg 2.0 not well-supported: https://stackoverflow.com/questions/47381187/svg-not-working-in-firefox
              // add attributes in javascript instead of css.
              .attr("r",  (d) => isMissingNote(d.data.id) ? theme_attrs["missing-radius"] : theme_attrs["radius"])
              .attr("class", (d) => isMissingNote(d.data.id) ? "missing" : null)
              .on("click", goToNoteFromTree)
              .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended)
                  .touchable(true))
          // node's label
          // labels need to be nested in a 'g' object alongside the node circle.
          //  docs: https://bl.ocks.org/mbostock/950642
          //  so post: https://stackoverflow.com/questions/49443933/node-labelling-not-working-d3-v5
          //    plnkr: http://plnkr.co/edit/6GqleTU89bSrd9hFQgI2?preview
          node.append("text")
              .attr("dx", 5)
              .attr("dy", ".05em")
              .attr("font-size", "20%")
              .text(function (d) { return d.data.label });
          // node tooltip
          node.append("title")
              .text(function(d) { return d.data.label });
          // from: https://stackoverflow.com/questions/28415005/d3-js-selection-conditional-rendering
          // use filtering to deal with specific nodes
          // from: https://codepen.io/blackjacques/pen/BaaqKpO
          // add node pulse on the current node
          node.filter( function(d,i) { return isCurrentNoteInTree(d); })
              .append("circle")
              .attr("r",  (d) => theme_attrs["radius"])
              .classed("pulse", true)
              .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended)
                  .touchable(true));
  
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
          });
  
           //
          // helpers
           //
  
          function isCurrentNoteInTree(node) {
            if (window.location.pathname == "/") {
              return !isMissingNote(node.data.id) && node.data.label === "{{ site.index_note_title }}";
            } else {
              return !isMissingNote(node.data.id) && window.location.pathname.includes(node.data.id);
            }
          }
  
          function isMissingNote(nodeId) {
            return nodeId === "";
          }
  
          // from: https://stackoverflow.com/questions/63693132/unable-to-get-node-datum-on-mouseover-in-d3-v6
          // d6 now passes events in vanilla javascript fashion
          function goToNoteFromTree(e, d) {
              if (!isMissingNote(d.data.id)) {
                if (d.data.label == '{{ site.index_note_title }}') {
                  window.location = '/';
                } else {
                  // i have no idea why this needs the preceeding '/'
                  window.location = `/note/${d.data.id}`;
                }
              } else {
                  return null;
              }
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
      })
      .catch(function(error) {
          console.log(error);
      });
  }
}
