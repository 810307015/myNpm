const buttonStyle = `
span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 12px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid var(--border-color);
    cursor: pointer;
    font-size: 14px;
    color: var(--color-0);
    background-color: var(--white-color);
}
span:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
}
span.small {
    height: 24px;
    font-size: 12px;
    padding: 0 9px;
}
span.large {
    height: 40px;
    font-size: 16px;
    padding: 0 15px;
}
span.primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--white-color);
}
span.warning {
    background-color: var(--warning-color);
    border-color: var(--warning-color);
    color: var(--white-color);
}
span.error {
    background-color: var(--danger-color);
    border-color: var(--danger-color);
    color: var(--white-color);
}
span.primary:hover,
span.warning:hover,
span.error:hover {
    opacity: 0.8;
}
span.dashed {
    border-style: dashed;
}
span.disabled {
    cursor: not-allowed;
    color: rgba(0,0,0,.25);
    background-color: rgba(0,0,0,.04);
}
span.disabled:hover {
    border-color: var(--border-color);
}`;

const attributeChangedHandler = (self: ZButton, name: string, oldValue: string, newValue: string) => {
    let className = self.className;
    switch (name) {
        case 'type':
        case 'size':
            className = className.replace(oldValue, newValue);
            break;
        case 'dashed':
        case 'disabled':
            className = newValue === null ? className.replace(name, '') : `${className} ${name}`;
            break;
    }
};

const hanlderClick = (e: MouseEvent, self: ZButton) => {
    const disabled = self.getAttribute('disabled');
    if (disabled !== null) {
        e.stopPropagation();
        e.preventDefault();
    }
};

class ZButton extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' })!;
        const span = document.createElement('span');
        shadowRoot.appendChild(span);
        const style = document.createElement('style');
        style.textContent = buttonStyle;
        shadowRoot.appendChild(style);
    }

    connectedCallback() {
        // console.log('Custom square element added to page.');
        const type = this.getAttribute('type') || 'default';
        const size = this.getAttribute('size') || 'middle';
        const dashed = this.getAttribute('dashed');
        const disabled = this.getAttribute('disabled');
        const span = this.shadowRoot?.querySelector('span')!;
        span.className = `${type} ${size} ${dashed !== null ? 'dashed' : ''} ${disabled !== null ? 'disabled' : ''} ${this.className}`;
        this.removeAttribute('class');

        span.addEventListener('click', (e) => hanlderClick(e, this));

        Array.prototype.slice.apply(this.childNodes).forEach(node => {
            span.appendChild(node);
        });
    }

    disconnectedCallback() {
        // console.log('Custom square element removed from page.');
    }

    adoptedCallback() {
        // console.log('Custom square element moved to new page.');
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        // console.log('Custom square element attributes changed.', name, oldValue, newValue);
        attributeChangedHandler(this, name, oldValue, newValue);
    }
}

export default ZButton;