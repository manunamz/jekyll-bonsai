---
---
import JekyllGraph from './jekyll-graph.js';

export default class GraphNav extends JekyllGraph {

  constructor() {
    super(); // 'this.graph' + 'this.graphDiv' set in JekyllGraph
    this.graphTypeCheckBox = document.getElementById('graph-type-checkbox');
    this.graphTypeEmojiSpan = document.getElementById('graph-type-emoji-span');
    this.init(); // this.graphType set in initGraphType();
  }

  init() {
    this.initGraphType();
    this.bindEvents();
    this.draw();
  }
  
  bindEvents() {
    this.graphTypeCheckBox.addEventListener('click', () => {
      this.updateGraphType();
      this.draw();
    });
  }

  // draw
  
  draw() {
    // redraw new chart
    if (this.graphTypeCheckBox.checked) {
      this.drawTree();
    } else {
      this.drawNetWeb();
    }
  }

  redraw() {
    this.updateGraphType();
    this.draw();
  }

  // type
  
  initGraphType() {
    this.graphType = localStorage.getItem('graph-type');
    if (this.graphType !== "tree" && this.graphType !== "net-web") {
      this.graphType = '{{ site.bonsai.nav.graph.type }}';	
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
