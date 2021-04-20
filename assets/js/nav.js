---
---
import drawTree from './tree.js';
import drawNetWeb from './net-web.js';

 //
// go
 //

// from: https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
(function() {
    // your page initialization code here
    // the DOM will be available here
    initListeners();
    initDefaults();
 })();

 //
// init
 //
function initDefaults () {
  if ('{{ site.theme_colors }}' === "dark") { 
    document.getElementById('theme-colors-checkbox').checked = true; 
  } else {
    document.getElementById('theme-colors-checkbox').checked = false; 
  }
  if ('{{ site.graph_type }}' === "tree") { 
    document.getElementById('graph-type-checkbox').checked = true;
  } else {
    document.getElementById('graph-type-checkbox').checked = false;
  }
  updateColors();
  updateGraphTypeEmoji();
  drawD3Nav();
}

function initListeners () {
    // don't use 'onclick' in html: https://stackoverflow.com/questions/17378199/uncaught-referenceerror-function-is-not-defined-with-onclick
    // prefer explicit registration of event listeners: https://stackoverflow.com/questions/12627443/jquery-click-vs-onclick/12627478#12627478
    // attach event listener to graphTypeCheckbox
    document.getElementById('theme-colors-checkbox')
      .addEventListener('click', function(event) {
        drawD3Nav();
        updateColors();
      }, false);
    
    document.getElementById('graph-type-checkbox')
      .addEventListener('click', function(event) {
        drawD3Nav();
        updateGraphTypeEmoji();
      }, false);

    document.getElementById('wiki-link-nav-checkbox')
      .addEventListener('click', function(event) {
        expandGraphNav();
        drawD3Nav();
      }, false);
}

 //
// helpers
 //

function updateColors () {
  var cssFile = document.querySelector('[rel="stylesheet"]');
  const colorsEmojiSpan = document.getElementById('colors-emoji-span');

  var theme_colors = "dark";
  if (document.getElementById('theme-colors-checkbox').checked) {
    colorsEmojiSpan.innerHTML = "☀️";
    theme_colors = "dark";
  } else {
    colorsEmojiSpan.innerHTML = "🌘";
    theme_colors = "light";
  }
  const yesThisReallyIsSupposedToBeCSSNotSCSS = '.css'
  cssFile.setAttribute('href', '{{ "assets/css/styles-" | absolute_url }}' + theme_colors + yesThisReallyIsSupposedToBeCSSNotSCSS);
}

function updateGraphTypeEmoji () {
  const graphTypeEmojiSpan = document.getElementById('graph-type-emoji-span');
  if (document.getElementById('graph-type-checkbox').checked) {
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
    drawNetWeb();
  }
}

function expandGraphNav() {
  // const mainHeader = document.getElementById('main-header');
  const siteNav = document.getElementById('garden-nav');
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
