// graph.js
export default function drawGraph () {
  // d3.json has been async'd: https://stackoverflow.com/questions/49768165/code-within-d3-json-callback-is-not-executed 
  d3.json("/assets/notes_graph.json")
    .then(function(data) {
        // console.log('d3 is building a graph');
        // console.log(graph);
        const svgWrapper = document.getElementById('svg-nav');
        var svg = d3.select(svgWrapper),
            width = +svg.node().getBoundingClientRect().width,
            height = +svg.node().getBoundingClientRect().height;
        
        var graph = data;
        // svg objects
        var link, node;    
        // values for all forces
        var forceProperties = {
            center: {
                x: 0.5,
                y: 0.5
            },
            charge: {
                enabled: true,
                strength: -30,
                distanceMin: 1,
                distanceMax: 2000
            },
            collide: {
                enabled: true,
                strength: .7,
                iterations: 1,
                radius: 5
            },
            forceX: {
                enabled: false,
                strength: .1,
                x: .5
            },
            forceY: {
                enabled: false,
                strength: .1,
                y: .5
            },
            link: {
                enabled: true,
                distance: 30,
                iterations: 1
            }
        }
        // force simulator
        var simulation = d3.forceSimulation();
        initializeDisplay();
        initializeSimulation();

        //////////// FORCE simulation //////////// 

        // set up the simulation and event to update locations after each tick
        function initializeSimulation() {
            simulation.nodes(graph.nodes);
            initializeForces();
            simulation.on("tick", ticked);
        }

        // add forces to the simulation
        function initializeForces() {
            // add forces and associate each with a name
            simulation
                .force("link", d3.forceLink())
                .force("charge", d3.forceManyBody())
                .force("collide", d3.forceCollide())
                .force("center", d3.forceCenter())
                .force("forceX", d3.forceX())
                .force("forceY", d3.forceY());
            // apply properties to each of the forces
            updateForces();
        }

        // apply new force properties
        function updateForces() {
            // get each force by name and update the properties
            simulation.force("center")
                .x(width * forceProperties.center.x)
                .y(height * forceProperties.center.y);
            simulation.force("charge")
                .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
                .distanceMin(forceProperties.charge.distanceMin)
                .distanceMax(forceProperties.charge.distanceMax);
            simulation.force("collide")
                .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
                .radius(forceProperties.collide.radius)
                .iterations(forceProperties.collide.iterations);
            simulation.force("forceX")
                .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
                .x(width * forceProperties.forceX.x);
            simulation.force("forceY")
                .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
                .y(height * forceProperties.forceY.y);
            simulation.force("link")
                .id(function(d) {return d.id;})
                .distance(forceProperties.link.distance)
                .iterations(forceProperties.link.iterations)
                .links(forceProperties.link.enabled ? graph.links : []);

            // updates ignored until this is run
            // restarts the simulation (important if simulation has already slowed down)
            simulation.alpha(1).restart();
        }

        //////////// DISPLAY ////////////

        // generate the svg objects and force simulation
        function initializeDisplay() {
        // set the data and properties of link lines
        link = svg.append("g")
                .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line");

        // set the data and properties of node circles
        node = svg.append("g")
                .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

        // node tooltip
        node.append("title")
            .text(function(d) { return d.label; });
        // visualize the graph
        updateDisplay();
        }

        // update the display based on the forces (but not positions)
        function updateDisplay() {
            node
                .attr("r", forceProperties.collide.radius)
                .attr("stroke", forceProperties.charge.strength > 0 ? "blue" : "#31AF31")
                .attr("stroke-width", forceProperties.charge.enabled==false ? 0 : Math.abs(forceProperties.charge.strength)/15);

            link
                .attr("stroke-width", forceProperties.link.enabled ? 1 : .5)
                .attr("opacity", forceProperties.link.enabled ? 1 : 0);
        }

        // update the display positions after each simulation tick
        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
            d3.select('#alpha_value').style('flex-basis', (simulation.alpha()*100) + '%');
        }



        //////////// UI EVENTS ////////////


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

        // update size-related forces
        d3.select(window).on("resize", function(){
            width = +svg.node().getBoundingClientRect().width;
            height = +svg.node().getBoundingClientRect().height;
            updateForces();
        });

        // convenience function to update everything (run after UI input)
        function updateAll() {
            updateForces();
            updateDisplay();
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}
