let headers = [
    {
        name: 'x-tt-env',
        value: 'boe-111111',
        note: 'demand 1',
        enable: false
    }
];

const tags = [
    'x-tt-env',
    'x-use-ppe',
    'x-tt-staffid',
    'accept',
    'accept-encoding',
    'accept-language',
    'connection',
    'host',
    'referer',
    'cache-control',
    'content-type',
    'content-length',
    'cookie',
    'range',
];

window.onload = function() {
    init();
    renderTags();
    addClickHandler();
}

function init() {
    chrome.storage.local.get(["headers"]).then((result) => {
        if (result && result.headers && Array.isArray(result.headers)) {
            headers = result.headers;
        }
        renderInput();
    });
}

function addClickHandler() {
    window.addEventListener('click', function(e) {
        const { id, className, dataset } = e.target;
        if (id === 'add-btn') {
            // 新增逻辑
            headers.push({
                name: '',
                value: '',
                note: '',
                enable: false
            });
            renderInput();
        }
        if (className.includes('delete-btn')) {
            // 删除
            const index = dataset.index;
            headers.splice(index, 1);
            renderInput();
        }
        if (className.includes('switch')) {
            // 开启或者关闭
            const index = dataset.index;
            const enable = !Number(dataset.enable);
            headers[index].enable = enable;
            renderInput();
        }
        if (className.includes('tag')) {
            const tag = dataset.tag;
            headers.push({
                name: tag,
                value: '',
                note: '',
                enable: false
            });
            renderInput();
        }
    });

    window.addEventListener('change', function(e) {
        const { value, dataset, name } = e.target;
        if (['name', 'value', 'note'].includes(name)) {
            const index = dataset.index;
            headers[index][name] = value;
            renderInput();
        }
    }, true);
}

function renderInput() {
    let html = '';
    headers.forEach((header, index) => {
        html += `<div class="row">
            <input data-index="${index}" type="text" name="name" placeholder="header name" value="${header.name}">
            <input data-index="${index}" type="text" name="value" placeholder="header value" value="${header.value}">
            <input data-index="${index}" type="text" name="note" placeholder="note " value="${header.note}">
            <div data-index="${index}" data-enable="${header.enable ? 1 : 0}" class="switch ${header.enable ? 'switch-on' : ''}"></div>
            <div data-index="${index}" class="delete-btn">一</div>
        </div>`;
    });
    document.getElementById('dynamic-content').innerHTML = html;
    // 重新开启代理
    handlerHeaders(headers);
    // 存入内存中
    chrome.storage.local.set({ headers }).then(() => {
        console.log("Value is set to " + JSON.stringify(headers));
    })
}


function renderTags() {
    let html = '';
    tags.forEach((tag) => {
        html += `<div class="tag" data-tag="${tag}">${tag}</div>`;
    });
    document.getElementById('tag-list').innerHTML = html;
}


chrome.tabs.onActivated.addListener(function(tab) {
    // const { tabId } = tab;
    chrome.storage.local.get(["headers"]).then((result) => {
        if (result && result.headers && Array.isArray(result.headers)) {
            handlerHeaders(result.headers);
        }
    })
    console.log('>>>>>', chrome);
})

// 没有匹配到任何headers时，清空之前的规则
function removeRequestHeaders() {
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
            {
                id: 2,
                priority: 2,
                action: {
                    type: 'allowAllRequests'
                },
                condition: {
                    resourceTypes: [
                        chrome.declarativeNetRequest.ResourceType.MAIN_FRAME
                    ]
                }
            }
        ],
        removeRuleIds: [2]
    }, async (result) => {
        console.log('remove', result);
    });
}

// 处理拿到的headers
function handlerHeaders(data) {
    const headers = data.filter(header => header.enable && header.name && header.value);
    if (headers.length) {
        addRequestHeaders(headers);
    } else {
        removeRequestHeaders();
    }
}

// 匹配到任一headers时，附加对应的headers
function addRequestHeaders(headers) {
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
            {
                id: 2,
                priority: 2,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
                    requestHeaders: headers.map(header => ({
                        header: header.name,
                        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                        value: header.value
                    }))
                },
                condition: {
                    // initiatorDomains: ["localhost"],
                    // regexFilter: "http(s)?://[\w\W]*",
                    resourceTypes: [
                        chrome.declarativeNetRequest.ResourceType.CSP_REPORT,
                        chrome.declarativeNetRequest.ResourceType.FONT,
                        chrome.declarativeNetRequest.ResourceType.IMAGE,
                        chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
                        chrome.declarativeNetRequest.ResourceType.MEDIA,
                        chrome.declarativeNetRequest.ResourceType.OBJECT,
                        chrome.declarativeNetRequest.ResourceType.OTHER,
                        chrome.declarativeNetRequest.ResourceType.PING,
                        chrome.declarativeNetRequest.ResourceType.SCRIPT,
                        chrome.declarativeNetRequest.ResourceType.STYLESHEET,
                        chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
                        chrome.declarativeNetRequest.ResourceType.WEBBUNDLE,
                        chrome.declarativeNetRequest.ResourceType.WEBSOCKET,
                        chrome.declarativeNetRequest.ResourceType.WEBTRANSPORT,
                        chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
                    ]
                }
            }
        ],
        removeRuleIds: [2]
    }, async (result) => {
        console.log('created', result);
    })
}