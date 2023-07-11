### 简介

- 由于vue提供的devtools的插件，在打开节点对应文件时偶尔会出现各种各样的问题，所以就实现了针对vue项目一个类似的选取节点打开文件的功能。

### 使用

```js
import initOpenVueInEditor from 'open-vue-in-editor';

// 最好是在开发环境才生效，线上环境是没有对应的文件信息的，例如
if (process.env.NODE_ENV === 'development') {
    initOpenVueInEditor();
}

// 有一点需要注意的是vue3项目基本不用传递任何参数，但是vue2项目，需要传入你的项目根目录，如下
initOpenVueInEditor({
    root: '/User/xxx/xxx'
});
// 如果觉得这样写死不太优雅，可以通过全局注入的方式，以webpack为例

// 在dev环境中注入全局的root变量
new webpack.DefinePlugin({
    ROOT: JSON.stringify(path.resolve(__dirname, '../')),  // 编译环境（development/test/production）
}),
// 在初始化的时候传入初始化方法
initOpenVueInEditor({
    root: ROOT
});

// 默认是使用的vscode打开，如果需要切换其它编辑器打开可以传入editor属性，如
initOpenVueInEditor({
    editor: 'webstorm'
});
```
- 引入并初始化完成后，按下shift+x键，然后移动鼠标到需要查看的节点上，最后点击就会自动跳转到节点对应的文件中，如例

![演示视频]("https://github.com/810307015/myNpm/blob/master/openVueInEditor/openInEditor.mov")

### 原理

- 其实就是vue2和vue3项目在打包的过程中会把组件的文件信息存到对应节点上，去遍历节点属性获取到对应的文件信息，唯一区别就在于vue2的项目只存了相对路径，vue3存的是绝对路径，这也是为什么vue2项目使用时需要带上根目录路径。