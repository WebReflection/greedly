import greedily from './index.js';

if (!customElements.get('grid-layout')) {
  const {COMMENT_NODE} = Node;
  const {find} = Array.prototype;
  const applyGridLayout = records => {
    for (const {target} of records) {
      if (isGridComment(target))
        greedily(target.data.slice(1)).applyTo(target.parentElement);
    }
  };
  const isGridComment = target => {
    return target.nodeType === COMMENT_NODE && target.data.startsWith('#');
  };
  customElements.define('grid-layout', class extends HTMLElement {
    /** @type {string} */
    get structure() {
      const target = find.call(this.childNodes, isGridComment);
      return target ? target.data.slice(1) : '';
    }

    /**
     * @param {string} data
     */
    set structure(data) {
      let target = find.call(this.childNodes, isGridComment);
      if (!target)
        target = this.appendChild(document.createComment(''));
      target.data = '#' + data;
      greedily(data).applyTo(this);
    }

    connectedCallback() {
      const {structure} = this;
      if (!structure)
        requestAnimationFrame(() => this.connectedCallback());
      else
        this.structure = structure;
    }
  });
}
