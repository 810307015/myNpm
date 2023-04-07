// function reddenPage() {
//     document.body.style.backgroundColor = 'red';
// }

// chrome.action.onClicked.addListener((tab) => { 
//     console.log(chrome);
    
//     if(!tab.url.includes("chrome://")) {
//         chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             function: reddenPage
//         });
//     }
// });



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

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(function(info) {
    // console.log(info);
})

chrome.runtime.onMessage.addListener(function(message) {
    const { type, data } = message;
    if (type === 'headers') {
        handlerHeaders(data);
    }
})