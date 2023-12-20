/**
 * 浏览器环境
 */
import { HttpClient, ZRequest } from "./request";

export default class BrowserHttpClient extends HttpClient {

    constructor() {
        super();
    }

    initHeader(xhr: XMLHttpRequest, config: ZRequest) {
        const {
            method = 'GET',
            header,
        } = config;
        let mixHeader = {};
        if (method === 'POST') {
            mixHeader = {
                'Content-Type': 'application/json',
            };
        }
        mixHeader = Object.assign(mixHeader, header);
        Object.keys(mixHeader).forEach(key => {
            console.log(key, mixHeader[key]);
            xhr.setRequestHeader(key, mixHeader[key]);
        });
    }
    
    getHeaders(xhr: XMLHttpRequest) {
        const headerStr = xhr.getAllResponseHeaders();
        const headers = {};
        headerStr.split(/\n/g).filter(item => Boolean(item.trim())).map(item => {
            const [key, value] = item.split(':');
            headers[key.trim()] = value.trim();
        });
        return headers;
    }

    request(config: ZRequest) {
        const xhr = new XMLHttpRequest();
        return new Promise(async (resolve, reject) => {
            config = await this.interceptor.runRequest(config);
            xhr.onreadystatechange = async () => {
                if (xhr.readyState === 4) {
                    let data = {
                        data: xhr.response,
                        status: xhr.status,
                        headers: this.getHeaders(xhr),
                        config,
                    };
                    data = await this.interceptor.runResponseSuccess(data);
                    resolve(data);
                }
            };
            xhr.onerror = async (err) => {
                const error = await this.interceptor.runResponseError({
                    status: xhr.status,
                    data: err,
                    headers: this.getHeaders(xhr),
                    config,
                });
                reject(error);
            };
            xhr.ontimeout = async () => {
                const error = await this.interceptor.runResponseError({
                    status: xhr.status,
                    data: {
                        msg: 'timeout'
                    },
                    headers: this.getHeaders(xhr),
                    config,
                });
                reject(error);
            };
            this.initUrl(config);
            const {
                url,
                method,
                data,
            } = config;
            xhr.open(method, url);
            this.initHeader(xhr, config);
            xhr.send(data);
        });
    }
}