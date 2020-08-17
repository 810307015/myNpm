### 使用说明

1. 全局安装，`npm i image-cut -g`。
2. 命令行调用：`imageCut [图片路径] [裁剪成几份] [是否横向切，传true就是横向切，不传就是纵向切]`。如`imageCut a.png 3`。
3. 代码引用：
```
const imageCut = require('image-cut');

imageCut('a.png', 3); // 纵向将a.png切成等量三份
imageCut('a.png', 3, true); // 横向将a.png切成等量三份

// 图片路径，根据项目根路径来做相对定位
```