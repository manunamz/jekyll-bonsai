// tree.js
export default function drawTree () { 
  // d3.json has been async'd: https://stackoverflow.com/questions/49768165/code-within-d3-json-callback-is-not-executed 
    d3.json("/assets/notes_tree.json")
    .then(function(data) {

        // console.log('d3 is building a graph');
        // console.log(graph);
        
        // var data = {"id":"ba626641-0703-46aa-807d-61c497a0374e","namespace":"root","name":"Root","children":[{"id":"81c12a31-fcfe-423a-a3d7-b45dd476e12d","namespace":"root.data-structure","name":"Data Structure","children":[{"id":"93d4ce86-9aa0-47bb-8555-48a6f2f54b14","namespace":"root.data-structure.graph","name":"Graph","children":[]},{"id":"e0f8dea6-1762-4623-b46e-f402d1a2fa0c","namespace":"root.data-structure.tree","name":"Tree","children":[]}]},{"id":"3921276c-f9cc-4748-8272-04b268207a32","namespace":"root.garden","name":"Garden","children":[{"id":"","namespace":"root.garden.lifecycle","name":"","children":[{"id":"9c98f004-cae7-453a-99f7-9510142b7600","namespace":"root.garden.lifecycle.bamboo","name":"Bamboo","children":[]},{"id":"722f3e95-455c-42a5-9030-09e31248a2a3","namespace":"root.garden.lifecycle.bud","name":"Bud","children":[]},{"id":"d70543bd-3d7f-440c-9cd7-8aad889a6928","namespace":"root.garden.lifecycle.sprout","name":"Sprout","children":[]}]}]}]};

        const svgWrapper = document.getElementById('svg-nav');

        const root = d3.hierarchy(data);
        const links = root.links();
        const nodes = root.descendants();

        const treeSim = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
            .force("charge", d3.forceManyBody().strength(-50))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        // const svg = d3.create("svg")
        //     .attr("viewBox", [-width / 2, -height / 2, width, height]);

        var svg = d3.select(svgWrapper),
            width = +svg.node().getBoundingClientRect().width,
            height = +svg.node().getBoundingClientRect().height;

            const link = svg.append("g")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line");

        const node = svg.append("g")
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
            .attr("fill", d => d.children ? null : "#000")
            .attr("stroke", d => d.children ? null : "#fff")
            .attr("r", 3.5)
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        node.append("title")
            .text(d => d.data.name);

        treeSim.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        });

        // invalidation.then(() => treeSim.stop());

        // return svg.node();

        function dragstarted(event, d) {
            if (!event.active) treeSim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) treeSim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}