customElements.whenDefined('grid-layout').then(
  (GridLayout = customElements.get('grid-layout')) => {
    if (!customElements.get('grid-layout-editor')) {
      document.head.appendChild(document.createElement('style')).textContent = `
        grid-layout-editor {
          --outline: silver;
          --width: 320px;
          --height: 320px;
          margin: auto;
          width: var(--width);
          height: var(--height);
          outline: 1px solid var(--outline);
          background-color: hsl(0, 0%, 95%);
          transition: all 250ms;
          gap: 1px;
        }
        grid-layout-editor > * {
          border: 0;
          background-color: hsl(0, 100%, 100%);
          outline: 1px solid var(--outline);
          transition: all 250ms;
        }
        grid-layout-editor:hover {
          outline: 2px solid var(--outline);
        }
        grid-layout-editor > *:focus,
        grid-layout-editor > *:hover {
          outline: 3px solid var(--outline);
          z-index: 1;
        }
      `;
      customElements.define('grid-layout-editor', class extends GridLayout {
        static observedAttributes = ['width', 'height'];
        attributeChangedCallback(name, _, value) {
          this.style.setProperty(name, value.replace(/^(\d+)$/, '$1px'));
        }

        /** @type {string} */
        get structure() {
          return super.structure;
        }

        /**
         * @param {string} data
         */
        set structure(data) {
          const set = new Set;
          const identifiers = /\S+/g;
          let match;
          while ((match = identifiers.exec(data)))
            set.add(match[0]);
          this.replaceChildren(...Array.from(
            {length: set.size},
            () => document.createElement('button')
          ));
          super.structure = data;
        }

        connectedCallback() {
          if (!this.structure)
            this.reset();
        }

        reset() {
          this.structure = 'x';
        }
      });
    }
  }
);
