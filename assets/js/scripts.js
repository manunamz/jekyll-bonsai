---
---
import GraphNav from './graph-nav.js';
import ThemeColors from './theme-colors.js';
import ForkController from './fork.js';

 //
// go
 //
// from: https://stackoverflow.com/questions/9899372/pure-javascript-equivalent-of-jquerys-ready-how-to-call-a-function-when-t
(function() {
    // your page initialization code here
    // the DOM will be available here
    initListeners();
    new ThemeColors();
    new GraphNav();
    if (document.getElementById('fork-checkbox')) {
      new ForkController();
    }
 })();

 //
// init
 //
function initListeners () {
  // open external links in new window; wiki-links in current window.
  document.querySelectorAll("a:not(.wiki-link):not(.plant-list-item):not(.footnote):not(.reversefootnote)").forEach(setupLinkOpen);
  // init note-preview.html listeners.
  document.querySelectorAll('{{ include.wrapperQuerySelector }} a:not(.plant-list-item)').forEach(setupListeners);

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

function expandGraphNav() {
  var siteNav = document.getElementById('garden-nav');
  var wikiBonsai = document.getElementById('wiki-bonsai');
  
  if (document.getElementById('wiki-link-nav-checkbox').checked) {
    siteNav.classList.add('nav-open');
    wikiBonsai.hidden = false;
  } else {
    siteNav.classList.remove('nav-open');
    wikiBonsai.hidden = true;
  }
}
