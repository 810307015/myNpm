const clearBtn = document.getElementById('clear');
const typeList = document.getElementById('type');
let hiddenEvent = [];
let trackList = [];

window.onload = function() {
    init();
}

function init() {
    chrome.runtime.sendMessage('track', (list) => {
        list.forEach(content => {
            const query = getQuery(content);
            const origin = base64_decode(query.data, false, 'text');
            try {
                const json = JSON.parse(origin);
                const {
                    event,
                    properties,
                    time,
                } = json;
                console.log(json)
                const {
                    eventType,
                    parameter,
                    self,
                    source
                } = properties || {};
                trackList.push({
                    event,
                    eventType,
                    parameter: parameter || self,
                    source,
                    date: `${new Date(time).toLocaleDateString()} ${new Date(time).toLocaleTimeString()}`,
                });
            } catch(e) {
                console.log(e);
            }
        });
        if (trackList.length) {
            renderList(trackList);
            renderTagList(trackList);
        }
    });

    clearBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage('clear', (list) => {
            console.log('已清空的list', );
        });
        renderList([]);
        renderTagList([]);
    });

    typeList.addEventListener('click', e => {
        const { className, innerText } = e.target;
        if (className === 'type-list-item') {
            hiddenEvent.push(innerText)
            e.target.setAttribute('class', 'type-list-item hidden');
        } else if (className === 'type-list-item hidden') {
            hiddenEvent = hiddenEvent.filter(event => event !== innerText);
            e.target.setAttribute('class', 'type-list-item');
        }
        renderList(trackList);
    });
}

function getQuery(queryString) {
    const query = {};
    queryString.split('&').map(item => {
        const [key, value] = item.split('=');
        query[key] = value;
    });
    return query;
}

function renderList(list = []) {
    let html = '';
    list.forEach(track => {
        const {
            event,
            eventType,
            parameter,
            date,
            source,
        } = track;
        if (hiddenEvent.includes(event)) {
            return;
        }
        html += `
            <div class="list-item">
                <div class="list-item-title">事件名：${event}</div>
                <div class="list-item-type">事件类型：${eventType}</div>
                <div class="list-item-type">事件参数：${parameter}</div>
                <div class="list-item-type">事件来源：${source}</div>
                <div class="list-item-params">触发时间：${date}</div>
            </div>
        `;
    });
    document.querySelector('#list').innerHTML = html;
}

function renderTagList(list = []) {
    const eventList = [...new Set(list.map(item => item.event))];
    let html = '';
    eventList.forEach(event => {
        html += `
            <div class="type-list-item">
                ${event}
            </div>
        `;
    });
    typeList.innerHTML = html;
}