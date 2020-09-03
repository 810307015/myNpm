### 说明

- 该高阶函数只是帮助组件在销毁前记录了当前所有`state`的值，然后下次进入的时候会把上次销毁前的`state`还原回去，从而实现一种类似的激活状态。

### 安装

- `npm install keep-alive-react --save`

### 使用方法

```jsx
import React from 'react';
import keepAlive from 'keep-alive-react';

class Test extends React.Component {
  state = {
    count: 0
  }

  render() {
    const { count } = this.state;
    return (
      <div className="Test">
      Test
      <div>count: {count}</div>
      <div onClick={() => {
        this.setState({
          count: count + 1
        })
      }}>add</div>
    </div>
    );
  }
}

export default keepAlive(Test);
```

### 注意事项

- 目前不支持函数式组件，只能支持继承`React.Component`的组件。