import drawTree from './tree.js';
import drawGraph from './graph.js';

// from: https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
(function() {
    // your page initialization code here
    // the DOM will be available here

    // don't use 'onclick' in html: https://stackoverflow.com/questions/17378199/uncaught-referenceerror-function-is-not-defined-with-onclick
    // prefer explicit registration of event listeners: https://stackoverflow.com/questions/12627443/jquery-click-vs-onclick/12627478#12627478
    // attach event listener to graphTypeCheckbox
    var graphTypeCheckBox = document.getElementById('graphType');
    graphTypeCheckBox.addEventListener('click', function(event) {
        changeGraphType();
    }, false);

    drawGraph();
 })();

// how to checkbox: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_display_checkbox_text
function changeGraphType() {
  console.log('i got clicked!');
  var graphTypeCheckBox = document.getElementById('graphType');
  console.log(graphTypeCheckBox);
  const svgWrapper = document.getElementById('svg-nav');
  d3.select(svgWrapper).selectAll('*').remove();
  if (graphTypeCheckBox.checked == true) {
    drawTree();
  } else {
    drawGraph();
  }
}

// for drag events on mobile: https://stackoverflow.com/questions/56226001/drag-event-not-fired-on-mobile-devices
// d3.select("svg").on("touchstart", yourFunction);
// d3.select("svg").on("touchmove", yourFunction);