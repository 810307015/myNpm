/**
 * 时间选择器子选择器，周选择器
 */
import React, { Component } from 'react';
import { PickerView } from 'antd-mobile';
// import PickerView from 'antd-mobile/lib/picker-view';  // 加载 JS
// import 'antd-mobile/lib/picker-view/style/css';        // 加载 CSS

import moment from 'moment';

import MonthSwitch from './MonthSwitch';

import {
  monthDay
} from '../util/datePicker';

class WeekPicker extends Component {

  static defaultProps = {
    option: {
      isTodayLast: true, // 最大可选时间是否为当前时间
    },
    value: [], // 起始时间，结束时间
  }

  state = {
    option: { // 自定义配置
      isTodayLast: true, // 最大可选时间是否为当前时间
    },
    pickerData: [], // 选择器的数据
    pickerMap: {}, // 由于pickerview中的value只能为int型，所以需要进行转换
    value: [], // 当前选中的周
    show: false, // 是否显示picker
    currentMonth: moment(new Date()).format('YYYY-MM'),// 当前月份
  }

  onChange = (value) => {
    this.setState({
      value
    });
  }

  handleMonthChange = (date) => {
    const { option: { isTodayLast = true } } = this.state;
    const calendar = monthDay(date);
    if(isTodayLast) {
      let len = calendar.length;
      while(len > 0 && calendar[len - 1][0].date.isAfter(new Date())) {
        calendar.pop();
        len = calendar.length;
      }
    }
    const pickerMap = calendar.map((week, index) => `${week[0].date.format('YYYY-MM-DD')},${week[6].date.format('YYYY-MM-DD')}`);
    const pickerData = calendar.map((week, index) => ({ label: `第${index + 1}周 (${week[0].date.format('MM月DD日')}-${week[6].date.format('MM月DD日')})`, value: index }));
    this.setState({
      pickerMap,
      pickerData,
      currentMonth: date,
    })
  }

  setCommonState = (props) => {
    const { value, option = { } } = props || this.props;
    const { isTodayLast = true } = option;
    const calendar = monthDay(value[0]);
    if(isTodayLast) {
      let len = calendar.length;
      while(len > 0 && calendar[len - 1][0].date.isAfter(new Date())) {
        calendar.pop();
        len = calendar.length;
      }
    }
    const pickerMap = calendar.map((week, index) => `${week[0].date.format('YYYY-MM-DD')},${week[6].date.format('YYYY-MM-DD')}`);
    const pickerData = calendar.map((week, index) => ({ label: `第${index + 1}周 (${week[0].date.format('MM月DD日')}-${week[6].date.format('MM月DD日')})`, value: index }));
    this.setState({
      pickerMap,
      pickerData,
      option: { ...this.state.option, ...option },
      value: [pickerMap.indexOf(value.map(date => moment(date).format('YYYY-MM-DD')).join(',')) || 0],
      currentMonth: moment(value[0]).format('YYYY-MM')
    });
  }

  componentDidMount() {
    this.setCommonState();
  }

  componentWillReceiveProps(nextProps) {
    this.setCommonState(nextProps);
  }

  render() {
    const { pickerData, value, currentMonth, option: { isTodayLast = true } } = this.state;
    return (
      <div className="WeekPicker">
        <div className="date-picker-container">
          <MonthSwitch
            type="month"
            isTodayLast={isTodayLast}
            value={currentMonth}
            onChange={this.handleMonthChange}
          />
          <PickerView
            cols={1}
            data={pickerData}
            value={value}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}



export default WeekPicker;