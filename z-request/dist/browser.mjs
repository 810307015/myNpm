class Interceptor {
  constructor() {
    this.__requestInterceptors = [];
    this.__responseInterceptors = [];
  }
  async runRequest(config) {
    for (let i = 0; i < this.__requestInterceptors.length; i++) {
      config = await this.__requestInterceptors[i](config);
    }
    return config;
  }
  async runResponseSuccess(data) {
    for (let i = 0; i < this.__responseInterceptors.length; i++) {
      const [success] = this.__responseInterceptors[i];
      data = await success(data);
    }
    return data;
  }
  async runResponseError(error) {
    for (let i = 0; i < this.__responseInterceptors.length; i++) {
      const [, fail] = this.__responseInterceptors[i];
      error = await fail(error);
    }
    return error;
  }
  request(callback) {
    this.__requestInterceptors.push(callback);
  }
  response(success, error) {
    this.__responseInterceptors.push([success, error]);
  }
}
class HttpClient {
  constructor() {
    this.interceptor = new Interceptor();
  }
  initUrl(config) {
    const {
      url,
      method,
      query
    } = config;
    if (query) {
      config.url = `${url}?${Object.keys(query).map((key) => `${key}=${query[key]}`).join("&")}`;
    }
    config.method = method || "GET";
  }
}
class BrowserHttpClient extends HttpClient {
  constructor() {
    super();
  }
  initHeader(xhr, config) {
    const {
      method = "GET",
      header
    } = config;
    let mixHeader = {};
    if (method === "POST") {
      mixHeader = {
        "Content-Type": "application/json"
      };
    }
    mixHeader = Object.assign(mixHeader, header);
    Object.keys(mixHeader).forEach((key) => {
      console.log(key, mixHeader[key]);
      xhr.setRequestHeader(key, mixHeader[key]);
    });
  }
  getHeaders(xhr) {
    const headerStr = xhr.getAllResponseHeaders();
    const headers = {};
    headerStr.split(/\n/g).filter((item) => Boolean(item.trim())).map((item) => {
      const [key, value] = item.split(":");
      headers[key.trim()] = value.trim();
    });
    return headers;
  }
  request(config) {
    const xhr = new XMLHttpRequest();
    return new Promise(async (resolve, reject) => {
      config = await this.interceptor.runRequest(config);
      xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4) {
          let data2 = {
            data: xhr.response,
            status: xhr.status,
            headers: this.getHeaders(xhr),
            config
          };
          data2 = await this.interceptor.runResponseSuccess(data2);
          resolve(data2);
        }
      };
      xhr.onerror = async (err) => {
        const error = await this.interceptor.runResponseError({
          status: xhr.status,
          data: err,
          headers: this.getHeaders(xhr),
          config
        });
        reject(error);
      };
      xhr.ontimeout = async () => {
        const error = await this.interceptor.runResponseError({
          status: xhr.status,
          data: {
            msg: "timeout"
          },
          headers: this.getHeaders(xhr),
          config
        });
        reject(error);
      };
      this.initUrl(config);
      const {
        url,
        method,
        data
      } = config;
      xhr.open(method, url);
      this.initHeader(xhr, config);
      xhr.send(data);
    });
  }
}
export {
  BrowserHttpClient as default
};
