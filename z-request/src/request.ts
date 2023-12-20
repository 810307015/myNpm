/**
 * 基础通用类
 */
export interface ZRequest {
    url: string;
    data?: XMLHttpRequestBodyInit;
    query?: Object;
    header?: Object;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS';
    dataType?: 'json' | 'text' | 'blob' | 'form' | 'arraybuffer' | 'jsonp' | 'script';
}

export interface ZResponse {
    data: Object | string | boolean | number;
    status: number;
    headers: Object;
    config: ZRequest;
}

export type RequestCallback = (config: ZRequest) => ZRequest | Promise<ZRequest>;
export type ResponseSuccess = (data: ZResponse) => any;
export type ResponseError = (error: ZResponse) => any;

/**
 * 拦截器
 */
export class Interceptor {

    __requestInterceptors: Array<RequestCallback>;
    __responseInterceptors: Array<[ResponseSuccess, ResponseError]>;

    constructor() {
        this.__requestInterceptors = [];
        this.__responseInterceptors = [];
    }

    async runRequest(config: ZRequest) {
        for (let i = 0;i < this.__requestInterceptors.length;i++) {
            config = await this.__requestInterceptors[i](config);
        }
        return config;
    }

    async runResponseSuccess(data: ZResponse) {
        for (let i = 0;i < this.__responseInterceptors.length;i++) {
            const [success] = this.__responseInterceptors[i];
            data = await success(data);
        }
        return data;
    }

    async runResponseError(error: ZResponse) {
        for (let i = 0;i < this.__responseInterceptors.length;i++) {
            const [,fail] = this.__responseInterceptors[i];
            error = await fail(error);
        }
        return error;
    }

    request(callback: RequestCallback) {
        this.__requestInterceptors.push(callback);
    }

    response(success: ResponseSuccess, error: ResponseError) {
        this.__responseInterceptors.push([success, error]);
    }
}

export class HttpClient {

    interceptor: Interceptor;

    constructor() {
        this.interceptor = new Interceptor();
    }

    initUrl(config: ZRequest) {
        const {
            url,
            method,
            query,
        } = config;
        if (query) {
            config.url = `${url}?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
        }
        config.method = method || 'GET';
    }
}