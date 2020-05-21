/**
 * 日期选择器
 */
import React, { Component } from 'react';
import moment from 'moment';

import CustomCalendar from './CustomCalendar';
import MonthSwitch from './MonthSwitch';

class RangePicker extends Component {

  static defaultProps = {
    value: [], // 当前选中的时间
    option: {
      isTodayLast: true, // 最大可选时间是否为当前时间
    },
  }

  state = {
    value: [], // 当前选中的时间
    option: {
      isTodayLast: true, // 最大可选时间是否为当前时间
    },
    currentMonth: moment(new Date()).format('YYYY-MM'),// 当前月份
  }

  // 获取选中的时间
  onSelected = (date) => {
    const { value } = this.state;
    let val = [];
    if(value.length === 0 || value.length === 2) {
      val = [date];
    } else {
      val = moment(value[0]).isBefore(date, 'day') ? [ value[0], date ] : [ date , value[0]];
    }
    this.setState({
      value: val,
      currentMonth: date
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
      option: { ...this.state.option, ...option },
      currentMonth
    });
  }

  componentDidMount() {
    this.setCommonState();
  }

  componentWillReceiveProps(nextProps) {
    this.setCommonState(nextProps);
  }

  render() {
    const { currentMonth, value, option: { isTodayLast = true} } = this.state;
    return (
      <div className="DayPicker">
        <MonthSwitch
          type="year"
          isTodayLast={isTodayLast}
          value={currentMonth}
          onChange={this.handleMonthChange}
        />
        <CustomCalendar
          type="range"
          isTodayLast={isTodayLast}
          value={value}
          month={currentMonth}
          onSelected={this.onSelected}
        />
      </div>
    );
  }
}

export default RangePicker;