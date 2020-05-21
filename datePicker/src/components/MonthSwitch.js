/**
 * 时间选择组件的子组件，用来在周选择器，日期选择器，范围选择器中增加切换月份的功能
 */
import React, { Component } from 'react';
import { Icon } from 'antd-mobile';
import moment from 'moment';

import './MonthSwitch.less';

class MonthSwitch extends Component {

  static defaultProps = {
    type: 'year', // month,仅切换月份，year，同时可以切换年
    value: moment(new Date()).format('YYYY-MM'), // 当前的年月
    isTodayLast: true, // 最大可选时间是否为当前时间
  }

  state = {
    type: 'year',
    value: moment(new Date()).format('YYYY-MM'),
    isTodayLast: true, // 最大可选时间是否为当前时间
  }

  // 上一年
  lastYear = () => {
    const { onChange } = this.props;
    const { value } = this.state;
    const _lastYear = moment(value).subtract(1, 'years').format('YYYY-MM');
    onChange && typeof onChange === 'function' && onChange(_lastYear);
  };

  // 下一年
  nextYear = () => {
    const { onChange } = this.props;
    const { value } = this.state;
    const _nextYear = moment(value).add(1, 'years').format('YYYY-MM');
    onChange && typeof onChange === 'function' && onChange(_nextYear);
  };

  // 上一月
  lastMonth = () => {
    const { onChange } = this.props;
    const { value } = this.state;
    const _lastMonth = moment(value).subtract(1, 'months').format('YYYY-MM');
    onChange && typeof onChange === 'function' && onChange(_lastMonth);
  };

  // 下一月
  nextMonth = () => {
    const { onChange } = this.props;
    const { value } = this.state;
    const _nextMonth = moment(value).add(1, 'months').format('YYYY-MM');
    onChange && typeof onChange === 'function' && onChange(_nextMonth);
  };

  setCommonState = (props) => {
    const { value, type, isTodayLast } = props || this.props;
    this.setState({
      type,
      value,
      isTodayLast
    });
  }

  componentDidMount() {
    this.setCommonState();
  }

  componentWillReceiveProps(nextProps) {
    this.setCommonState(nextProps);
  }

  render() {
    const { value, type, isTodayLast } = this.state;
    return (
      <div className="MonthSwitch">
        <div className={`date-picker-switch ${type}`}>
          <div className="date-picker-switch-operate">
            {type === 'year' && <div className="date-picker-switch_year-last" onClick={this.lastYear}><Icon type="double-left" /></div>}
            <div className="date-picker-switch_month-last" onClick={this.lastMonth}><Icon type="left" /></div>
          </div>

          <div className="date-picker-switch_title">{moment(value).format('YYYY年MM月')}</div>

          <div className="date-picker-switch-operate">
            <div className={`date-picker-switch_month-next ${isTodayLast && moment(value).add(1, 'months').startOf('month').isAfter(moment(new Date())) ? 'disabled' : ''}`} onClick={this.nextMonth}><Icon type="right" /></div>
            {type === 'year' && <div className={`date-picker-switch_year-next ${isTodayLast && moment(value).add(1, 'years').startOf('month').isAfter(moment(new Date())) ? 'disabled' : ''}`} onClick={this.nextYear}><Icon type="double-right" /></div>}
          </div>

        </div>
      </div>
    );
  }
}

export default MonthSwitch;