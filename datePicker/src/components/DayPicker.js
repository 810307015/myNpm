/**
 * 日期选择器
 */
import React, { Component } from 'react';
import moment from 'moment';

import CustomCalendar from './CustomCalendar';
import MonthSwitch from './MonthSwitch';

class DayPicker extends Component {

  static defaultProps = {
    value: [], // 当前选中的时间
    option: {
      isTodayLast: true, // 最大可选时间是否为当前时间
    },
  }

  state = {
    value: [], // 当前选中的时间
    currentMonth: moment(new Date()).format('YYYY-MM'),// 当前月份
    option: {
      isTodayLast: true, // 最大可选时间是否为当前时间
    },
  }

  // 获取选中的时间
  onSelected = (value) => {
    this.setState({
      value: [value],
      currentMonth: value
    });
  }

  // 监听月份变化
  handleMonthChange = (date) => {
    this.setState({
      currentMonth: date
    });
  }

  setCommonState = (props) => {
    const { value, option = {} } = props || this.props;
    const currentMonth = value[0];
    this.setState({
      value,
      currentMonth,
      option: { ...this.state.option, ...option }
    });
  }

  componentDidMount() {
    this.setCommonState();
  }

  componentWillReceiveProps(nextProps) {
    this.setCommonState(nextProps);
  }

  render() {
    const { currentMonth, value, option: { isTodayLast = true } } = this.state;
    return (
      <div className="DayPicker">
        <MonthSwitch
          type="year"
          value={currentMonth}
          isTodayLast={isTodayLast}
          onChange={this.handleMonthChange}
        />
        <CustomCalendar
          value={value}
          month={currentMonth}
          onSelected={this.onSelected}
          isTodayLast={isTodayLast}
        />
      </div>
    );
  }
}

export default DayPicker;