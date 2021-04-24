// import { dragstarted, dragged, dragended } from "./drag.js";

export default function drawNetWeb (theme_attrs) {
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
            .attr("active", (d) => isCurrentNoteInNetWeb(d.id) ? true : null)
        // node's circle
        node.append('circle')
            //svg 2.0 not well-supported: https://stackoverflow.com/questions/47381187/svg-not-working-in-firefox
            // add attributes in javascript instead of css.
            .attr("r", theme_attrs["radius"])
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
        node.filter( function(d,i) { return isCurrentNoteInNetWeb(d.id); })
            .append("circle")
            .attr("r", theme_attrs["radius"])
            .classed("pulse", (d) => isCurrentNoteInNetWeb(d.id) ? true : null)
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

        function isCurrentNoteInNetWeb(noteId) {
            return window.location.pathname.includes(noteId);
        }
        
        // from: https://stackoverflow.com/questions/63693132/unable-to-get-node-datum-on-mouseover-in-d3-v6
        // d6 now passes events in vanilla javascript fashion
        function goToNoteFromNetWeb (e, d) {
            // i have no idea why this needs the preceeding '/'
            window.location = `/note/${d.id}`;
        };

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
