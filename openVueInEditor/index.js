export default function initOpenInEditor (options = {}) {
    let flag = false;
    const root = options.root || ''; // vue3不用传，vue需要传
    const editor = options.editor || 'vscode';
    const block = document.createElement('div');
    block.style.backgroundColor = options.color || 'rgba(20, 125, 80, 0.3)';
    block.style.position = 'fixed';
    block.style.zIndex = options.zIndex || '1000000';
    block.style.pointerEvents = 'none';

    const getFile = (component) => {
        if (!component) {
            return '';
        }
        let temp;
        let file = '';
        if ((
              (temp = component.type)
            ) || (
                (temp = component.$vnode)
                    && (temp = temp.componentOptions)
                    && (temp = temp.Ctor)
                    && (temp = temp.options)
                )
        ) {
            file = temp.__file;
        }
        if (!file) {
            return '';
        }
        if (file && !file.includes('runner')) {
            return file;
        }
        return getFile(component.parent || component.$parent);
    };

    const findComponent = (dom) => {
        if (dom.__vueParentComponent) {
            return dom.__vueParentComponent;
        }
        if (dom.__vue__) {
            return dom.__vue__;
        }
        return findComponent(dom.parentNode);
    };

    const handleMouseMove = e => {
        const { x, y, width, height } = e.target.getBoundingClientRect();
        block.style.width = `${width}px`;
        block.style.height = `${height}px`;
        block.style.border = '1px dashed rgba(60, 150, 100, 1)';
        block.style.cursor = 'crosshair';
        block.style.left = `${x}px`;
        block.style.top = `${y}px`;
    };

    window.addEventListener('keydown', e => {
        if (e.shiftKey === true && e.key === 'X') {
            flag = !flag;
            if (flag) {
                document.body.appendChild(block);
                window.addEventListener('mousemove', handleMouseMove);
            } else {
                document.body.removeChild(block);
                window.removeEventListener('mousemove', handleMouseMove);
            }
        }
    });
    
    window.addEventListener('click', e => {
        if (!flag) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const path = getFile(findComponent(e.target));
        if (path) {
            console.log(root, path);
            window.open(`${editor}://file${root}${root ? (root[root.length - 1] === '/' ? path : `/${path}`) : path}`);
            flag = false;
            document.body.removeChild(block);
            window.removeEventListener('mousemove', handleMouseMove);
        } else {
            alert('当前节点未找到文件，请切换节点后重试');
        }
    });
}