

class ResizableBox extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' })!;
        const root = document.createElement('div');
        root.id = 'resizable-box';
        root.draggable = true;
        shadowRoot.appendChild(root);
        const style = document.createElement('style');
        style.textContent = `
            .resizable-box {
                display: inline-block;
                resize: both;
                overflow: auto;
                border: 3px solid #333;
            }
        `;
        shadowRoot.appendChild(style);
    }

    connectedCallback() {
        console.log('connectedCallback');
        const root = this.shadowRoot?.querySelector('#resizable-box')! as HTMLDivElement;

        const style = this.getAttribute('style') || '';
        const className = this.getAttribute('class') || '';
        root.setAttribute('style', style);
        root.setAttribute('class', `resizable-box ${className}`);

        Array.prototype.slice.apply(this.childNodes).forEach(node => {
            root.appendChild(node);
        });
    }

    disconnectedCallback() {
        console.log('disconnectedCallback');
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log('attributeChangedCallback', name, oldValue, newValue);
    }

    adoptedCallback(oldDocument: Document, newDocument: Document) {
        console.log('adoptedCallback', oldDocument, newDocument);
    }
}

export default ResizableBox;