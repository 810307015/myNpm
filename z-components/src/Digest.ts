class ZDigest extends HTMLElement {
    constructor() {
        super();
        setTimeout(() => {
            const parseFn = this.dataset.parse;
            const encrypt = this.dataset.encrypt;
            const shadowRoot = this.attachShadow({ mode: 'closed' })!;
            const span = document.createElement('span');
            shadowRoot.appendChild(span);
            // const style = document.createElement('style');
            // style.textContent = '';
            // shadowRoot.appendChild(style);
            Array.prototype.slice.apply(this.childNodes).forEach(node => {
                if (node.nodeType === 3) {
                    // 文字
                    node.nodeValue = window[parseFn as keyof Window](node.nodeValue);
                    span.appendChild(node);
                } else {
                    span.appendChild(node);
                }
            });
        });
    }

    connectedCallback() {
        //
    }

    disconnectedCallback() {
        // console.log('Custom square element removed from page.');
    }

    adoptedCallback() {
        // console.log('Custom square element moved to new page.');
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        // console.log('Custom square element attributes changed.', name, oldValue, newValue);
        // attributeChangedHandler(this, name, oldValue, newValue);
    }
}

export default ZDigest;