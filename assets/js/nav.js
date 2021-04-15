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
      drawD3Nav();
      changeGraphType();
    }, false);

    var wikiNavCheckBox = document.getElementById('wiki-link-nav-checkbox');
    wikiNavCheckBox.addEventListener('click', function(event) {
      expandGraphNav();
      drawD3Nav();
    }, false);

    drawTree();
 })();

function changeGraphType () {
  var graphTypeCheckBox = document.getElementById('graphType');
  var graphTypeCheckBoxLabel = document.getElementById('graphTypeEmojiSpan');
  if (graphTypeCheckBox.checked) {
    graphTypeCheckBoxLabel.innerHTML = "🕸";
  } else {
    graphTypeCheckBoxLabel.innerHTML = "🌳";
  }
}

// how to checkbox: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_display_checkbox_text
function drawD3Nav() {
  var graphTypeCheckBox = document.getElementById('graphType');
  // var graphTypeCheckBoxLabel = document.getElementById('graphTypeEmojiSpan');
  // destroy old chart   
  const svgWrapper = document.getElementById('svg-nav');
  d3.select(svgWrapper).selectAll('*').remove();
  // redraw new chart and set label text
  if (graphTypeCheckBox.checked) {
    // graphTypeCheckBoxLabel.innerHTML = "🕸";
    drawTree();
  } else {
    // graphTypeCheckBoxLabel.innerHTML = "🌳";
    drawGraph();
  }
}

function expandGraphNav() {
  // e.preventDefault();

  const mainHeader = document.getElementById('main-header');
  const siteNav = document.getElementById('graph-nav');
  const wikiLinkCheckBox = document.getElementById('wiki-link-nav-checkbox');
  const wikiLinkNavSpan = document.getElementById('wiki-link-nav-span');
  
  if (wikiLinkCheckBox.checked) {
    siteNav.classList.add('nav-open');
    mainHeader.classList.add('nav-open');
  } else {
    siteNav.classList.remove('nav-open');
    mainHeader.classList.remove('nav-open');
  }
}

// for drag events on mobile: https://stackoverflow.com/questions/56226001/drag-event-not-fired-on-mobile-devices
// d3.select("svg").on("touchstart", yourFunction);
// d3.select("svg").on("touchmove", yourFunction);