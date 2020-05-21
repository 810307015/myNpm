/**
 * 时间选择器底部公共的按钮组
 */
import React, { Component } from 'react';

import './ButtonGroup.less';

class ButtonGroup extends Component {

  cancel = () => {
    const { cancel } = this.props;
    cancel && typeof cancel === 'function' && cancel();
  }

  confirm = () => {
    const { confirm } = this.props;
    confirm && typeof confirm === 'function' && confirm();
  }

  render() {
    return (
      <div className="ButtonGroup">
        <div className="btn cancel" onClick={this.cancel}>取消</div>
        <div className="btn confirm" onClick={this.confirm}>确认</div>
      </div>
    );
  }
}

export default ButtonGroup;