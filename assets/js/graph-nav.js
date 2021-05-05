---
---
import drawTree from './tree.js';
import drawNetWeb from './net-web.js';

export default class GraphNav {

  constructor() {
    // this.graphType set in initGraphType();
    this.svgWrapper = document.getElementById('svg-graph');
    this.graphTypeCheckBox = document.getElementById('graph-type-checkbox');
    this.graphTypeEmojiSpan = document.getElementById('graph-type-emoji-span');
    this.init();
  }

  init() {
    this.initGraphType();
    this.bindEvents();
    this.drawD3Nav();
  }
  
  bindEvents() {
    // listen for draw event (esp. from theme colors)
    this.svgWrapper.addEventListener('draw', () => {
      this.updateGraphTypeEmoji();
      this.drawD3Nav();
    });
    this.graphTypeCheckBox.addEventListener('click', () => {
      this.updateGraphTypeEmoji();
      this.drawD3Nav();
    });
  }
  
  // how to checkbox: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_display_checkbox_text
  drawD3Nav() {   
    // destroy old chart   
    d3.select(this.svgWrapper).selectAll('svg > *').remove();
  
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
    // redraw new chart
    if (this.graphTypeCheckBox.checked) {
      drawTree(theme_attrs);
    } else {
      drawNetWeb(theme_attrs);
    }
  }
  
  initGraphType() {
    if (this.graphType !== "tree" && this.graphType !== "net-web") {
      this.graphType = '{{ site.graph_type }}';	
    }
    this.graphTypeCheckBox.checked = (this.graphType === "tree");
    this.updateGraphTypeEmoji();
  }

  updateGraphTypeEmoji() {
    if (this.graphTypeCheckBox.checked) {
      this.graphTypeEmojiSpan.innerHTML = "🕸";
      this.graphType = "tree";
    } else {
      this.graphTypeEmojiSpan.innerHTML = "🌳";
      this.graphType = "net-web";
    }
    window.localStorage.setItem('graph-type', this.graphType);
  } 
}
