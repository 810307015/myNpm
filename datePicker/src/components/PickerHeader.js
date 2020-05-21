/**
 * 时间选择器各个类型都公共的头部部分
 */
import React, { Component } from 'react';

import './PickerHeader.less';

class PickerHeader extends Component {

  reset = () => {
    const { reset } = this.props;
    reset && typeof reset === 'function' && reset();
  }

  render() {
    return (
      <div className="PickerHeader">
        <div className="placeholder">占位</div>
        <div className="title">日期选择</div>
        <div className="reset" onClick={this.reset}>重置</div>
      </div>
    );
  }
}

export default PickerHeader;