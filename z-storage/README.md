### 介绍

- 简单的带缓存机制的storage操作。

### 安装使用

- 安装

```bash
npm install storage-with-expires --save
```

- 使用

```js
import {
    setStorage,
    getStorage,
    removeStorage,
    clearStorage,
} from 'storage-with-expires';
// key value expires（秒） true/false - localStorage/sessionStorage
// 布尔值默认都为true，即使用localStorage，可以不传
setStorage('key', 'value', 10, true); // 设置缓存，默认为true，使用localStorage
getStorage('key', true); // 获取缓存
removeStorage('key', true); // 移除缓存
clearStorage(true); // 清空缓存
```