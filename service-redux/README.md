### 安装

- `npm i service-redux --save`

### 简要说明

- 使用`rxjs`实现了一个简单的类似`redux`的功能，实现了全局的状态共享。

### 使用

- 建一个service服务。

```JSX
import { Service, wrapService } from 'service-redux';

/***
 * Service内置了subscribe，set，next三个方法。
 * subscribe(callback)，订阅数据，每次有数据的时候会触发传入的回调，订阅之后默认调用一次next方法，把当前数据流推送给订阅者
 * set(data)，更新数据并触发当前所有的subscribe，set中会调用next方法
 * next(data)，触发当前所有的subscribe
 */

class TestService extends Service {

  constructor(props) {
    super(props);
  }

  add = (data) => {
    this.data.count = Number(data.count) + Number(this.data.count);
    this.next(this.data);
  }
}

const initData = {
  count: 0,
  test1: 'Hello',
  test2: 'World'
};

export default wrapService(TestService, initData)();
```

- 在页面的入口页，使用provider进行包裹，并将所有的service传入Provider。

```JSX
import { ServiceProvider } from 'service-redux';
import testService from 'src/services/TestService';

ReactDOM.render(
  // services是一个服务对象，泪如{ aService: aService, bService: bService }
  // 所以建议将所有的service对象放到一个文件中通过export导出，然后import * as services from 'services/index'，就可以直接传入
  <ServiceProvider services={{ testService: testService }}>
    // 你需要渲染的主体内容
  </ServiceProvider>
  ,
  document.getElementById("root")
);
```

- 在需要使用的页面，使用inject将需要的全局状态和服务进行注入

```JSX
import React, { Component } from 'react';

import { inject } from 'service-redux';

class Subscribe extends Component {
  
  add = () => {
    const { testService } = this.props;
    testService.add({
      count: Number(this.input.value)
    })
  }

  render() {
    const { count } = this.props;
    return (
      <div className="Test">
        <input type="number" ref={input => this.input = input} />
        <div className="add" onClick={this.add}>增加</div>
        <div className="show">{count}</div>
      </div>
    )
  }
}

// 使用该方法，选择自己需要的props属性
const mapStateToProps = (data) => {
  const {
    count,
    testService
  } = data;

  return {
    count,
    testService
  }
}

export default inject(mapStateToProps)(Subscribe);
```

### 使用示例

- [https://github.com/810307015/ReactDemo/tree/custom](https://github.com/810307015/ReactDemo/tree/custom)