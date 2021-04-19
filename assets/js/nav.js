---
---
import drawTree from './tree.js';
import drawGraph from './graph.js';

// from: https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
(function() {
    // your page initialization code here
    // the DOM will be available here

    // don't use 'onclick' in html: https://stackoverflow.com/questions/17378199/uncaught-referenceerror-function-is-not-defined-with-onclick
    // prefer explicit registration of event listeners: https://stackoverflow.com/questions/12627443/jquery-click-vs-onclick/12627478#12627478
    // attach event listener to graphTypeCheckbox
    const colorsCheckBox = document.getElementById('colors-checkbox');
    colorsCheckBox.addEventListener('click', function(event) {
      drawD3Nav();
      changeColors();
    }, false);
    
    const graphTypeCheckBox = document.getElementById('graph-type-checkbox');
    graphTypeCheckBox.addEventListener('click', function(event) {
      drawD3Nav();
      changeGraphType();
    }, false);

    const wikiNavCheckBox = document.getElementById('wiki-link-nav-checkbox');
    wikiNavCheckBox.addEventListener('click', function(event) {
      expandGraphNav();
      drawD3Nav();
    }, false);

    // jtd.getTheme = function() {
    //   const cssFileHref = document.querySelector('[rel="stylesheet"]').getAttribute('href');
    //   return cssFileHref.substring(cssFileHref.lastIndexOf('-') + 1, cssFileHref.length - 4);
    // }
    
    // todo: set to default theme value. 
    // todo: set to config default value.
    // todo: once values are set from config, make sure default.html does the same.
    drawTree();
 })();

function changeColors () {
  const cssFile = document.querySelector('[rel="stylesheet"]');
  const colorsCheckBox = document.getElementById('colors-checkbox');
  const colorsEmojiSpan = document.getElementById('colors-emoji-span');
  console.log('checked!');
  var theme_colors = "dark";
  if (colorsCheckBox.checked) {
    colorsEmojiSpan.innerHTML = "🌘";
    theme_colors = "light";
  } else {
    colorsEmojiSpan.innerHTML = "☀️";
    theme_colors = "dark";
  }
  cssFile.setAttribute('href', '{{ "assets/css/styles-" | absolute_url }}' + theme_colors + '.scss');
}

function changeGraphType () {
  const graphTypeCheckBox = document.getElementById('graph-type-checkbox');
  const graphTypeEmojiSpan = document.getElementById('graph-type-emoji-span');
  if (graphTypeCheckBox.checked) {
    graphTypeEmojiSpan.innerHTML = "🕸";
  } else {
    graphTypeEmojiSpan.innerHTML = "🌳";
  }
}

// how to checkbox: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_display_checkbox_text
function drawD3Nav() {
  const graphTypeCheckBox = document.getElementById('graph-type-checkbox'); 
  const svgWrapper = document.getElementById('svg-nav');
  // destroy old chart   
  d3.select(svgWrapper).selectAll('*').remove();
  
  // redraw new chart and set label text
  if (graphTypeCheckBox.checked) {
    drawTree();
  } else {
    drawGraph();
  }
}

function expandGraphNav() {
  // const mainHeader = document.getElementById('main-header');
  const siteNav = document.getElementById('graph-nav');
  const wikiLinkCheckBox = document.getElementById('wiki-link-nav-checkbox');
  // const wikiLinkNavSpan = document.getElementById('wiki-link-nav-span');
  
  if (wikiLinkCheckBox.checked) {
    siteNav.classList.add('nav-open');
    // mainHeader.classList.add('nav-open');
  } else {
    siteNav.classList.remove('nav-open');
    // mainHeader.classList.remove('nav-open');
  }
}

// todo 👇
// for drag events on mobile: https://stackoverflow.com/questions/56226001/drag-event-not-fired-on-mobile-devices
// d3.select("svg").on("touchstart", yourFunction);
// d3.select("svg").on("touchmove", yourFunction);
