---
---
import JekyllGraph from './jekyll-graph.js';

export default class GraphNav extends JekyllGraph {

  constructor() {
    super(); // this.graphDiv set in JekyllGraph
    this.graphTypeCheckBox = document.getElementById('graph-type-checkbox');
    this.graphTypeEmojiSpan = document.getElementById('graph-type-emoji-span');
    this.init(); // this.graphType set in initGraphType();
  }

  init() {
    this.initGraphType();
    this.bindEvents();
    this.drawD3Nav();
  }
  
  bindEvents() {
    // listen for draw event (esp. from theme colors)
    this.graphDiv.addEventListener('draw', () => {
      this.updateGraphType();
      this.drawD3Nav();
    });
    this.graphTypeCheckBox.addEventListener('click', () => {
      this.updateGraphType();
      this.drawD3Nav();
    });
  }
  
  // how to checkbox: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_display_checkbox_text
  drawD3Nav() {
    // redraw new chart
    if (this.graphTypeCheckBox.checked) {
      this.drawTree();
    } else {
      this.drawNetWeb();
    }
  }
  
  initGraphType() {
    this.graphType = localStorage.getItem('graph-type');
    if (this.graphType !== "tree" && this.graphType !== "net-web") {
      this.graphType = '{{ site.bonsai.nav.graph_type }}';	
    }
    this.graphTypeCheckBox.checked = (this.graphType === "tree");
    this.updateGraphType();
  }

  updateGraphType() {
    if (this.graphTypeCheckBox.checked) {
      this.graphTypeEmojiSpan.innerText = "{{ site.data.emoji.net-web }}";
      this.graphType = "tree";
    } else {
      this.graphTypeEmojiSpan.innerText = "{{ site.data.emoji.tree }}";
      this.graphType = "net-web";
    }
    localStorage.setItem('graph-type', this.graphType);
  } 
}
