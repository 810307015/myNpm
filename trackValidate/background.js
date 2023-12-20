let list = [];

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        const { type, requestBody, url } = details;
        if (url.indexOf('sa.gif') > -1) {
            if (type === 'ping') { // PC端
                const { raw = [] } = requestBody;
                const { bytes } = (raw[0] || {});
                const decoder = new TextDecoder();
                const content = decodeURIComponent(decoder.decode(bytes));
                list.push(content);
            } else if (type === 'image') { // h5端
                const index = url.indexOf('?');
                const content = decodeURIComponent(url.slice(index + 1));
                list.push(content);
            } else if (type === 'xmlhttprequest') {
                const { formData } = requestBody;
                const { data } = formData;
                const content = decodeURIComponent(data[0] || '');
                if (content) {
                    list.push(`data=${content}`);
                }
            }
        }
    },
    {
        urls: ["<all_urls>"]
    },
    ["requestBody"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    if (message === 'track') {
        sendResponse(list);
    } else if (message === 'clear') {
        const _list = [...list];
        list = [];
        sendResponse(_list);
    }
});
