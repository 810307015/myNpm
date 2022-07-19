### 一个简单的import引用分析插件

- 使用
  
```js
{
  ...
  plugins: [
    new WebpackImportAnalysisPlugin({
      output: path.resolve(__dirname, `./output.json`)
    })
  ]
  ...
}
```

- 输出结果

```json
// 以文件为基准，扁平化输出所有的import
[
  {
    "name": "./src/routes",
    "resource": "/Users/bytedance/codes/byted/fe_room_web/packages/app-approval/src/routes.tsx",
    "children": [
      {
        "name":"react",
        "exportName":"lazy",
        "identifierName":"lazy",
        "importStr":"import { lazy } from 'react'",
        "resource":"/Users/bytedance/codes/byted/fe_room_web/node_modules/.pnpm/react@17.0.2/node_modules/react/index.js"
      },
    ...  
    ]
  },
  ...
]
```