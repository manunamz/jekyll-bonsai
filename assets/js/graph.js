// import { dragstarted, dragged, dragended } from "./drag.js";

export default function drawGraph () {
  // d3.json has been async'd: https://stackoverflow.com/questions/49768165/code-within-d3-json-callback-is-not-executed 
  d3.json("/assets/notes_graph.json")
    .then(function(data) {
        // console.log('d3 is building a tree');
        // console.log(data);
        const svgWrapper = document.getElementById('svg-nav');
        var width = +svgWrapper.getBoundingClientRect().width / 2;
        var height = +svgWrapper.getBoundingClientRect().height / 2;
        var svg = d3.select(svgWrapper)
            .attr("viewBox", [-width / 2, -height / 2, width, height]);
        
        const radius = 3.5;

        const simulation = d3.forceSimulation()
            .nodes(data.nodes)
            .force("link", d3.forceLink()
                .id(function(d) {return d.id;})
                .distance(30)
                .iterations(1)
                .links(data.links))
            .force("charge", d3.forceManyBody())
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

        const node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(data.nodes)
                .enter().append("circle")
                .attr("r", radius)
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

        // node tooltip
        node.append("title")
            .text(function(d) { return d.label; });
        
        simulation.on("tick", () => {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}
