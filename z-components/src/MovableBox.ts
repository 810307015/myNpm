interface Movable {
    x: number;
    y: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isMobile: boolean;
}

function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || (window as  any).opera;
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}


class CustomEvent extends Event {
    moveX: number = 0;
    moveY: number = 0;
    constructor(type: string, eventInitDict?: EventInit) {
        super(type, eventInitDict);
    }

    setData(x: number, y: number) {
        this.moveX = x;
        this.moveY = y;
    }
}

class MovableBox extends HTMLElement implements Movable {
    x: number = 0;
    y: number = 0;
    startX: number = 0;
    startY: number = 0;
    endX: number = 0;
    endY: number = 0;
    isMobile: boolean = true;

    constructor() {
        super();
        this.init();
    }

    init() {
        const shadowRoot = this.attachShadow({ mode: 'open' })!;
        const root = document.createElement('div');
        root.id = 'movable-box';
        root.draggable = true;
        shadowRoot.appendChild(root);
        const style = document.createElement('style');
        style.textContent = `
            .movable-box {
                cursor: move;
                display: inline-block;
            }
        `;
        shadowRoot.appendChild(style);

        this.isMobile = isMobile();
        if (this.isMobile) {
            root.addEventListener('touchstart', this.onDragStart.bind(this));
            root.addEventListener('touchmove', this.onDrag.bind(this));
            root.addEventListener('touchend', this.onDragEnd.bind(this));
            // div.addEventListener('touch', this.onDragOver.bind(this));
        } else {
            root.addEventListener('dragstart', this.onDragStart.bind(this));
            root.addEventListener('drag', this.onDrag.bind(this));
            root.addEventListener('dragend', this.onDragEnd.bind(this));
            root.addEventListener('dragover', this.onDragOver.bind(this));
        }
    }

    onDragStart(e: DragEvent | TouchEvent) {
        e.stopPropagation();
        let x, y;
        if ('touches' in e) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        this.startX = x;
        this.startY = y;
    }

    onDrag(e: DragEvent  | TouchEvent) {
        e.stopPropagation();
        const root = this.shadowRoot?.querySelector('#movable-box')! as HTMLDivElement;
        let x, y;
        if ('touches' in e) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        root.style.transform = `translate(${this.x + x - this.startX}px, ${this.y + y - this.startY}px)`;
        this.endX = x;
        this.endY = y;
    }

    onDragEnd(e: DragEvent  | TouchEvent) {
        e.stopPropagation();
        this.x += this.endX - this.startX;
        this.y += this.endY - this.startY;
        console.log(this.x, this.y);
        const event = new CustomEvent('moveend');
        event.setData(this.x, this.y);
        this.dispatchEvent(event);
        const onMoveEnd = this.getAttribute('onmoveend');
        if (onMoveEnd && typeof (globalThis as any)[onMoveEnd] === 'function') {
            (globalThis as any)[onMoveEnd](event);
        }
    }

    onDragOver(e: DragEvent | TouchEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    connectedCallback() {
        // console.log('Custom square element added to page.');
        const root = this.shadowRoot?.querySelector('#movable-box')! as HTMLDivElement;

        const style = this.getAttribute('style') || '';
        const className = this.getAttribute('class') || '';
        root.setAttribute('style', style);
        root.setAttribute('class', `movable-box ${className}`);

        Array.prototype.slice.apply(this.childNodes).forEach(node => {
            root.appendChild(node);
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
        const root = this.shadowRoot?.querySelector('#movable-box')!;
        root.setAttribute(name, newValue);
    }
}

export default MovableBox;