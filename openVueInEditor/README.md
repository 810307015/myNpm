### 简介

- 由于vue提供的devtools的插件，在打开节点对应文件时偶尔会出现各种各样的问题，所以就实现了针对vue项目一个类似的选取节点打开文件的功能。

### 使用

```js
import initOpenVueInEditor from 'open-vue-in-editor';

// 最好是在开发环境才生效，线上环境是没有对应的文件信息的，例如
if (process.env.NODE_ENV === 'development') {
    initOpenVueInEditor();
}
```