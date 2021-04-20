// import { dragstarted, dragged, dragended } from "./drag.js";

export default function drawTree () { 
  // d3.json has been async'd: https://stackoverflow.com/questions/49768165/code-within-d3-json-callback-is-not-executed 
  d3.json("/assets/notes_tree.json")
    .then(function(data) {
        // console.log('d3 is building a graph');
        // console.log(data);
        const svgWrapper = document.getElementById('svg-nav');
        
        var width = +svgWrapper.getBoundingClientRect().width / 2;
        var height = +svgWrapper.getBoundingClientRect().height / 2;
        
        var svg = d3.select(svgWrapper)
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
                .y(.9));;
  
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
            .attr("active", (d) => isCurrentNoteInTree(d.data.id) ? true : null)
            // tree-only
            .attr("class", (d) => d.data.id === "" ? "missing" : null)
            .on("click", goToNoteFromTree)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
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
        node.filter( function(d,i) { return isCurrentNoteInTree(d.data.id); })
            .append("circle")
            .classed("pulse", (d) => isCurrentNoteInTree(d.data.id) ? true : null);
        simulation.on("tick", () => {
            // from: https://mbostock.github.io/d3/talk/20110921/parent-foci.html
            // preserve hierarchical shape via link positioning
            var kx = .2 * simulation.alpha();
            var ky = 1.2 * simulation.alpha();
            links.forEach(function(d, i) {
              d.target.x += (d.source.x - d.target.x) * kx;
              d.target.y += (d.source.y + (height * .5) - d.target.y) * ky;
            });

            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });  
        });

        function isCurrentNoteInTree(noteId) {
            var isMissingNote = noteId === "";
            console.log(!isMissingNote && window.location.pathname.includes(noteId));
            return !isMissingNote && window.location.pathname.includes(noteId);
        }

        // from: https://stackoverflow.com/questions/63693132/unable-to-get-node-datum-on-mouseover-in-d3-v6
        // d6 now passes events in vanilla javascript fashion
        function goToNoteFromTree(e, d) {
            var isMissingNote = d.data.id === "";
            if (!isMissingNote) {
                // i have no idea why this needs the preceeding '/'
                window.location = `/${d.data.id}`;
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