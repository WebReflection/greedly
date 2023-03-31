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
        // Custom Elements related
        static observedAttributes = ['width', 'height'];
        attributeChangedCallback(name, _, value) {
          this.style.setProperty(name, value.replace(/^(\d+)$/, '$1px'));
        }
        connectedCallback() {
          if (!this.structure)
            this.reset();
        }

        // GridLayout override
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

        // extra features
        exportAsComponent(enforceWidth = false) {
          const {children, structure} = this;
          const gl = document.createElement('grid-layout');
          const childNodes = [document.createComment('#' + structure)];
          if (enforceWidth) {
            const {width, height} = getComputedStyle(this);
            Object.assign(gl.style, {width, height});
          }
          for (const {firstElementChild} of children) {
            if (firstElementChild)
              childNodes.push(firstElementChild.cloneNode(true));
            else
              childNodes.push(document.createElement('div'));
          }
          gl.append(...childNodes);
          return gl;
        }

        exportAsHTML(enforceWidth = false) {
          return this.exportAsComponent(enforceWidth).outerHTML;
        }

        reset() {
          this.structure = 'x';
        }
      });
    }
  }
);
