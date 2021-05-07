---
---
import GraphNav from './graph.js';
import ThemeColors from './theme-colors.js';
import NoteFootController from './note-foot.js';

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
  if (document.getElementById('note-foot-checkbox')) {
    new NoteFootController();
  }
 })();

 //
// init
 //
function initListeners () {
  // open external links in new window; wiki-links in current window.
  document.querySelectorAll("a:not(.wiki-link):not(.tags-list-item):not(.footnote):not(.reversefootnote)").forEach(setupLinkOpen);
  // init note-preview.html listeners.
  document.querySelectorAll('{{ include.wrapperQuerySelector }} a:not(.tags-list-item)').forEach(setupListeners);

  // todo: this is hacky, make it a proper button with this styling instead of a checkbox
  document.getElementById('tags-checkbox')
    .addEventListener('click', function(event) {
      goTo('{{ site.baseurl }}/tag/tags');
    }, false);
  document.getElementById('recent-checkbox')
    .addEventListener('click', function(event) {
      goTo('{{ site.baseurl }}/recent');
    }, false);

  document.getElementById('wiki-link-nav-checkbox')
    .addEventListener('click', function(event) {
      expandGraphNav();
      document.getElementById('svg-graph').dispatchEvent(new Event('draw')); // tell graph to redraw itself
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
  var siteNav = document.getElementById('site-nav');
  var wikiBonsai = document.getElementById('wiki-link-nav-bonsai');
  
  if (document.getElementById('wiki-link-nav-checkbox').checked) {
    siteNav.classList.add('nav-open');
    wikiBonsai.hidden = false;
  } else {
    siteNav.classList.remove('nav-open');
    wikiBonsai.hidden = true;
  }
}
