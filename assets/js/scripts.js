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
    // go
    updateColors();
    updateGraphTypeEmoji();
    drawD3Nav();
    if (document.getElementById('fork-checkbox')) {
      toggleForkCollapse();
    }
 })();

 //
// init
 //
function initDefaults () {
  // theme-colors
  var theme = localStorage.getItem("theme-colors");
  if (theme !== "dark" && theme !== "light") {
    theme = getComputedStyle(document.documentElement).getPropertyValue('content');	
  }
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('theme-colors-checkbox').checked = (theme === "dark");
  // graph-type
  var graphType = localStorage.getItem('graph-type');
  if (graphType !== "tree" && graphType !== "net-web") {
    graphType = '{{ site.graph_type }}';	
  }
  document.getElementById('graph-type-checkbox').checked = (graphType === "tree");
  // fork-status
  if (document.getElementById('fork-checkbox')) {
    var forkStatus = localStorage.getItem('fork-status');
    if (forkStatus !== "open" && forkStatus !== "closed") {
      forkStatus = '{{ site.fork_status }}';	
    }
    document.getElementById('fork-checkbox').checked = (forkStatus === "closed"); 
  }
}

function initListeners () {
  // open external links in new window; wiki-links in current window.
  document.querySelectorAll("a:not(.wiki-link):not(.plant-list-item):not(.footnote):not(.reversefootnote)").forEach(setupLinkOpen);
  // init note-preview.html listeners.
  document.querySelectorAll('{{ include.wrapperQuerySelector }} a:not(.plant-list-item)').forEach(setupListeners);

  // don't use 'onclick' in html: https://stackoverflow.com/questions/17378199/uncaught-referenceerror-function-is-not-defined-with-onclick
  // prefer explicit registration of event listeners: https://stackoverflow.com/questions/12627443/jquery-click-vs-onclick/12627478#12627478
  // attach event listener to graphTypeCheckbox
  document.getElementById('theme-colors-checkbox')
    .addEventListener('click', function(event) {
      updateColors();
      drawD3Nav();
    }, false);
  document.getElementById('graph-type-checkbox')
    .addEventListener('click', function(event) {
      updateGraphTypeEmoji();
      drawD3Nav();
    }, false);
  if (document.getElementById('fork-checkbox')) {
    // setup listeners
    document.getElementById('fork-checkbox')
    .addEventListener('click', function(event) {
      toggleForkCollapse();
    }, false);
  }

  // todo: this is hacky, make it a proper button with this styling instead of a checkbox
  document.getElementById('plant-tag-checkbox')
    .addEventListener('click', function(event) {
      goTo('{{ site.baseurl }}/plant/tags');
    }, false);
  document.getElementById('weather-checkbox')
  .addEventListener('click', function(event) {
    goTo('{{ site.baseurl }}/weather');
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
function goTo (location) {
  window.location.href = location;
}

function setupLinkOpen (link) {
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener");  // for security: https://css-tricks.com/use-target_blank/#correct-html
}

function updateColors () {
  var theme_colors = localStorage.getItem("theme-colors");
  const colorsEmojiSpan = document.getElementById('colors-emoji-span');
  if (document.getElementById('theme-colors-checkbox').checked) {
    colorsEmojiSpan.innerHTML = "☀️";
    theme_colors = "dark";
  } else {
    colorsEmojiSpan.innerHTML = "🌘";
    theme_colors = "light";
  }
  var cssFile = document.querySelector('[rel="stylesheet"]');
  const yesThisReallyIsSupposedToBeCSSNotSCSS = '.css'
  cssFile.setAttribute('href', '{{ "assets/css/styles-" | absolute_url }}' + theme_colors + yesThisReallyIsSupposedToBeCSSNotSCSS);
  window.localStorage.setItem("theme-colors", theme_colors);
}

function updateGraphTypeEmoji () {
  var graphType = localStorage.getItem("graph-type");
  const graphTypeEmojiSpan = document.getElementById('graph-type-emoji-span');
  if (document.getElementById('graph-type-checkbox').checked) {
    graphTypeEmojiSpan.innerHTML = "🕸";
    graphType = "tree";
  } else {
    graphTypeEmojiSpan.innerHTML = "🌳";
    graphType = "net-web";
  }
  window.localStorage.setItem('graph-type', graphType);
}

// how to checkbox: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_display_checkbox_text
function drawD3Nav() {
  const graphTypeCheckBox = document.getElementById('graph-type-checkbox'); 
  const svgWrapper = document.getElementById('svg-graph');
  
  // destroy old chart   
  d3.select(svgWrapper).selectAll('*').remove();

  let theme_attrs = {};
  // set theme-dependent graph attributes.
  if (document.getElementById('theme-colors-checkbox').checked) {
    theme_attrs = {
      "name": "dark",
      "radius": 2.5,
      "missing-radius": 2.5,
    }
  } else {
      theme_attrs = {
      "name": "light",
      "radius": 3,
      "missing-radius": 1.5,
    }
  }

  // redraw new chart and set label text
  if (graphTypeCheckBox.checked) {
    drawTree(theme_attrs);
  } else {
    drawNetWeb(theme_attrs);
  }
}

function expandGraphNav() {
  const siteNav = document.getElementById('garden-nav');
  
  if (document.getElementById('wiki-link-nav-checkbox').checked) {
    siteNav.classList.add('nav-open');
    // mainHeader.classList.add('nav-open');
  } else {
    siteNav.classList.remove('nav-open');
    // mainHeader.classList.remove('nav-open');
  }
}

function toggleForkCollapse () {
  // from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
  var collapsibleEl = document.getElementsByClassName("fork-nav")[0];
  var forkStatus = '{{ site.fork_status }}';
  if (document.getElementById('fork-checkbox').checked) {
    collapsibleEl.style.display = "none";
    forkStatus = "closed";
  } else {
    collapsibleEl.style.display = "flex";
    forkStatus = "open";
  }
  window.localStorage.setItem('fork-status', forkStatus);
} 
