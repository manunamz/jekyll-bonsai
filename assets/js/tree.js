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
  
        const radius = 3.5;

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
            .force("forceX", d3.forceX())
            .force("forceY", d3.forceY());
  
        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .join("line");

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", radius)
            .attr("active", (d) => isCurrentNoteInTree(d.data.id) ? true : null)
            // tree-only
            .attr("class", (d) => d.data.id === "" ? "missing" : null)
            .on("click", goToNoteFromTree)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
        
        // node tooltip
        node.append("title")
            .text(function(d) { return d.data.name });

        simulation.on("tick", () => {
            // from: https://mbostock.github.io/d3/talk/20110921/parent-foci.html
            // preserve hierarchical shape via link positioning
            var kx = .2 * simulation.alpha();
            var ky = 1.2 * simulation.alpha();
            links.forEach(function(d, i) {
              d.target.x += (d.source.x - d.target.x) * kx;
              d.target.y += (d.source.y + 40 - d.target.y) * ky;
            });

            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
                
        });

        function isCurrentNoteInTree(noteId) {
            var isMissingNote = noteId === "";
            return !isMissingNote && window.location.pathname.includes(noteId);
        }

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