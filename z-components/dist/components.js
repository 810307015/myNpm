/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Button.ts":
/*!***********************!*\
  !*** ./src/Button.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst buttonStyle = `\nspan {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    height: 32px;\n    padding: 0 12px;\n    border-radius: 4px;\n    box-sizing: border-box;\n    border: 1px solid var(--border-color);\n    cursor: pointer;\n    font-size: 14px;\n    color: var(--color-0);\n    background-color: var(--white-color);\n}\nspan:hover {\n    color: var(--primary-color);\n    border-color: var(--primary-color);\n}\nspan.small {\n    height: 24px;\n    font-size: 12px;\n    padding: 0 9px;\n}\nspan.large {\n    height: 40px;\n    font-size: 16px;\n    padding: 0 15px;\n}\nspan.primary {\n    background-color: var(--primary-color);\n    border-color: var(--primary-color);\n    color: var(--white-color);\n}\nspan.warning {\n    background-color: var(--warning-color);\n    border-color: var(--warning-color);\n    color: var(--white-color);\n}\nspan.error {\n    background-color: var(--danger-color);\n    border-color: var(--danger-color);\n    color: var(--white-color);\n}\nspan.primary:hover,\nspan.warning:hover,\nspan.error:hover {\n    opacity: 0.8;\n}\nspan.dashed {\n    border-style: dashed;\n}\nspan.disabled {\n    cursor: not-allowed;\n    color: rgba(0,0,0,.25);\n    background-color: rgba(0,0,0,.04);\n}\nspan.disabled:hover {\n    border-color: var(--border-color);\n}`;\nconst attributeChangedHandler = (self, name, oldValue, newValue) => {\n  let className = self.className;\n  switch (name) {\n    case 'type':\n    case 'size':\n      className = className.replace(oldValue, newValue);\n      break;\n    case 'dashed':\n    case 'disabled':\n      className = newValue === null ? className.replace(name, '') : `${className} ${name}`;\n      break;\n  }\n};\nconst hanlderClick = (e, self) => {\n  const disabled = self.getAttribute('disabled');\n  if (disabled !== null) {\n    e.stopPropagation();\n    e.preventDefault();\n  }\n};\nclass ZButton extends HTMLElement {\n  constructor() {\n    super();\n    const shadowRoot = this.attachShadow({\n      mode: 'open'\n    });\n    const span = document.createElement('span');\n    shadowRoot.appendChild(span);\n    const style = document.createElement('style');\n    style.textContent = buttonStyle;\n    shadowRoot.appendChild(style);\n  }\n  connectedCallback() {\n    // console.log('Custom square element added to page.');\n    const type = this.getAttribute('type') || 'default';\n    const size = this.getAttribute('size') || 'middle';\n    const dashed = this.getAttribute('dashed');\n    const disabled = this.getAttribute('disabled');\n    const span = this.shadowRoot?.querySelector('span');\n    span.className = `${type} ${size} ${dashed !== null ? 'dashed' : ''} ${disabled !== null ? 'disabled' : ''} ${this.className}`;\n    this.removeAttribute('class');\n    span.addEventListener('click', e => hanlderClick(e, this));\n    Array.prototype.slice.apply(this.childNodes).forEach(node => {\n      span.appendChild(node);\n    });\n  }\n  disconnectedCallback() {\n    // console.log('Custom square element removed from page.');\n  }\n  adoptedCallback() {\n    // console.log('Custom square element moved to new page.');\n  }\n  attributeChangedCallback(name, oldValue, newValue) {\n    // console.log('Custom square element attributes changed.', name, oldValue, newValue);\n    attributeChangedHandler(this, name, oldValue, newValue);\n  }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ZButton);\n\n//# sourceURL=webpack://z-components/./src/Button.ts?");

/***/ }),

/***/ "./src/Digest.ts":
/*!***********************!*\
  !*** ./src/Digest.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass ZDigest extends HTMLElement {\n  constructor() {\n    super();\n    setTimeout(() => {\n      const parseFn = this.dataset.parse;\n      const encrypt = this.dataset.encrypt;\n      const shadowRoot = this.attachShadow({\n        mode: 'closed'\n      });\n      const span = document.createElement('span');\n      shadowRoot.appendChild(span);\n      // const style = document.createElement('style');\n      // style.textContent = '';\n      // shadowRoot.appendChild(style);\n      Array.prototype.slice.apply(this.childNodes).forEach(node => {\n        if (node.nodeType === 3) {\n          // 文字\n          node.nodeValue = window[parseFn](node.nodeValue);\n          span.appendChild(node);\n        } else {\n          span.appendChild(node);\n        }\n      });\n    });\n  }\n  connectedCallback() {\n    //\n  }\n  disconnectedCallback() {\n    // console.log('Custom square element removed from page.');\n  }\n  adoptedCallback() {\n    // console.log('Custom square element moved to new page.');\n  }\n  attributeChangedCallback(name, oldValue, newValue) {\n    // console.log('Custom square element attributes changed.', name, oldValue, newValue);\n    // attributeChangedHandler(this, name, oldValue, newValue);\n  }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ZDigest);\n\n//# sourceURL=webpack://z-components/./src/Digest.ts?");

/***/ }),

/***/ "./src/MovableBox.ts":
/*!***************************!*\
  !*** ./src/MovableBox.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction isMobile() {\n  const userAgent = navigator.userAgent || navigator.vendor || window.opera;\n  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);\n}\nclass CustomEvent extends Event {\n  constructor(type, eventInitDict) {\n    super(type, eventInitDict);\n    Object.defineProperty(this, \"moveX\", {\n      enumerable: true,\n      configurable: true,\n      writable: true,\n      value: 0\n    });\n    Object.defineProperty(this, \"moveY\", {\n      enumerable: true,\n      configurable: true,\n      writable: true,\n      value: 0\n    });\n  }\n  setData(x, y) {\n    this.moveX = x;\n    this.moveY = y;\n  }\n}\nclass MovableBox extends HTMLElement {\n  constructor() {\n    super();\n    Object.defineProperty(this, \"x\", {\n      enumerable: true,\n      configurable: true,\n      writable: true,\n      value: 0\n    });\n    Object.defineProperty(this, \"y\", {\n      enumerable: true,\n      configurable: true,\n      writable: true,\n      value: 0\n    });\n    Object.defineProperty(this, \"startX\", {\n      enumerable: true,\n      configurable: true,\n      writable: true,\n      value: 0\n    });\n    Object.defineProperty(this, \"startY\", {\n      enumerable: true,\n      configurable: true,\n      writable: true,\n      value: 0\n    });\n    Object.defineProperty(this, \"endX\", {\n      enumerable: true,\n      configurable: true,\n      writable: true,\n      value: 0\n    });\n    Object.defineProperty(this, \"endY\", {\n      enumerable: true,\n      configurable: true,\n      writable: true,\n      value: 0\n    });\n    Object.defineProperty(this, \"isMobile\", {\n      enumerable: true,\n      configurable: true,\n      writable: true,\n      value: true\n    });\n    this.init();\n  }\n  init() {\n    const shadowRoot = this.attachShadow({\n      mode: 'open'\n    });\n    const root = document.createElement('div');\n    root.id = 'movable-box';\n    root.draggable = true;\n    shadowRoot.appendChild(root);\n    const style = document.createElement('style');\n    style.textContent = `\n            .movable-box {\n                cursor: move;\n                display: inline-block;\n            }\n        `;\n    shadowRoot.appendChild(style);\n    this.isMobile = isMobile();\n    if (this.isMobile) {\n      root.addEventListener('touchstart', this.onDragStart.bind(this));\n      root.addEventListener('touchmove', this.onDrag.bind(this));\n      root.addEventListener('touchend', this.onDragEnd.bind(this));\n      // div.addEventListener('touch', this.onDragOver.bind(this));\n    } else {\n      root.addEventListener('dragstart', this.onDragStart.bind(this));\n      root.addEventListener('drag', this.onDrag.bind(this));\n      root.addEventListener('dragend', this.onDragEnd.bind(this));\n      root.addEventListener('dragover', this.onDragOver.bind(this));\n    }\n  }\n  onDragStart(e) {\n    e.stopPropagation();\n    let x, y;\n    if ('touches' in e) {\n      x = e.touches[0].clientX;\n      y = e.touches[0].clientY;\n    } else {\n      x = e.clientX;\n      y = e.clientY;\n    }\n    this.startX = x;\n    this.startY = y;\n  }\n  onDrag(e) {\n    e.stopPropagation();\n    const root = this.shadowRoot?.querySelector('#movable-box');\n    let x, y;\n    if ('touches' in e) {\n      x = e.touches[0].clientX;\n      y = e.touches[0].clientY;\n    } else {\n      x = e.clientX;\n      y = e.clientY;\n    }\n    root.style.transform = `translate(${this.x + x - this.startX}px, ${this.y + y - this.startY}px)`;\n    this.endX = x;\n    this.endY = y;\n  }\n  onDragEnd(e) {\n    e.stopPropagation();\n    this.x += this.endX - this.startX;\n    this.y += this.endY - this.startY;\n    console.log(this.x, this.y);\n    const event = new CustomEvent('moveend');\n    event.setData(this.x, this.y);\n    this.dispatchEvent(event);\n    const onMoveEnd = this.getAttribute('onmoveend');\n    if (onMoveEnd && typeof globalThis[onMoveEnd] === 'function') {\n      globalThis[onMoveEnd](event);\n    }\n  }\n  onDragOver(e) {\n    e.preventDefault();\n    e.stopPropagation();\n  }\n  connectedCallback() {\n    // console.log('Custom square element added to page.');\n    const root = this.shadowRoot?.querySelector('#movable-box');\n    const style = this.getAttribute('style') || '';\n    const className = this.getAttribute('class') || '';\n    root.setAttribute('style', style);\n    root.setAttribute('class', `movable-box ${className}`);\n    Array.prototype.slice.apply(this.childNodes).forEach(node => {\n      root.appendChild(node);\n    });\n  }\n  disconnectedCallback() {\n    // console.log('Custom square element removed from page.');\n  }\n  adoptedCallback() {\n    // console.log('Custom square element moved to new page.');\n  }\n  attributeChangedCallback(name, oldValue, newValue) {\n    // console.log('Custom square element attributes changed.', name, oldValue, newValue);\n    const root = this.shadowRoot?.querySelector('#movable-box');\n    root.setAttribute(name, newValue);\n  }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MovableBox);\n\n//# sourceURL=webpack://z-components/./src/MovableBox.ts?");

/***/ }),

/***/ "./src/ResizableBox.ts":
/*!*****************************!*\
  !*** ./src/ResizableBox.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass ResizableBox extends HTMLElement {\n  constructor() {\n    super();\n    const shadowRoot = this.attachShadow({\n      mode: 'open'\n    });\n    const root = document.createElement('div');\n    root.id = 'resizable-box';\n    root.draggable = true;\n    shadowRoot.appendChild(root);\n    const style = document.createElement('style');\n    style.textContent = `\n            .resizable-box {\n                display: inline-block;\n                resize: both;\n                overflow: auto;\n                border: 3px solid #333;\n            }\n        `;\n    shadowRoot.appendChild(style);\n  }\n  connectedCallback() {\n    console.log('connectedCallback');\n    const root = this.shadowRoot?.querySelector('#resizable-box');\n    const style = this.getAttribute('style') || '';\n    const className = this.getAttribute('class') || '';\n    root.setAttribute('style', style);\n    root.setAttribute('class', `resizable-box ${className}`);\n    Array.prototype.slice.apply(this.childNodes).forEach(node => {\n      root.appendChild(node);\n    });\n  }\n  disconnectedCallback() {\n    console.log('disconnectedCallback');\n  }\n  attributeChangedCallback(name, oldValue, newValue) {\n    console.log('attributeChangedCallback', name, oldValue, newValue);\n  }\n  adoptedCallback(oldDocument, newDocument) {\n    console.log('adoptedCallback', oldDocument, newDocument);\n  }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ResizableBox);\n\n//# sourceURL=webpack://z-components/./src/ResizableBox.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Button */ \"./src/Button.ts\");\n/* harmony import */ var _Digest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Digest */ \"./src/Digest.ts\");\n/* harmony import */ var _MovableBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MovableBox */ \"./src/MovableBox.ts\");\n/* harmony import */ var _ResizableBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ResizableBox */ \"./src/ResizableBox.ts\");\n\n\n\n\ncustomElements.define('z-button', _Button__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\ncustomElements.define('z-digest', _Digest__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\ncustomElements.define('z-movable-box', _MovableBox__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\ncustomElements.define('z-resizable-box', _ResizableBox__WEBPACK_IMPORTED_MODULE_3__[\"default\"]);\n\n//# sourceURL=webpack://z-components/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;