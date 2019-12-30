# myNpm

- some npm package of me

### 发布 npm 包流程

- `npm init`初始化一个 npm 包，并且设置入口以及关键字和描述。
- 编写相关的功能，在入口文件中使用`module.exports = obj`，将需要暴露的方法或者内容放进该`obj`中。
- `npm adduser`登录 npm 账户。
- `npm publish`发布 npm 包。
- 已经发布过的版本不可重复发布，需要更改`package.json`中的`version`版本号之后才可重新发布。
