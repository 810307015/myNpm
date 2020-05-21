/**
 * 时间选择器的子选择器，月份选择器
 */
import React, { Component } from 'react';
import { PickerView } from 'antd-mobile';

import {
  getCurrentYear,
  getMonthList,
  getYearRange
} from '../util/datePicker';

class MonthPicker extends Component {

  static defaultProps = {
    option: {
      min: 2000, // 可选的最小年份
      max: 2030, // 可选的最大年份
      isTodayLast: true, // 最大可选时间是否为当前时间
    },
    value: [], // 当前选中的月份
  }

  state = {
    pickerData: [], // 选择器的数据
    value: [], // 当前选中的年份
    show: false, // 是否显示picker
  }

  onChange = (value) => {
    this.setState({
      value
    });
  }

  setCommonState = (props) => {
    const { option, value = [currentYear] } = props || this.props;
    const { min = 2000, max = 2030, isTodayLast = true } = option;
    let range = [];
    if(isTodayLast) {
      range = getYearRange(min, getCurrentYear()[0]);
    } else {
      range = getYearRange(min, max);
    }
    this.setState({
      pickerData: range.map(val => ({ label: `${val}年`, value: val, children: getMonthList(val, isTodayLast) })),
      value
    });
  }

  componentDidMount() {
    this.setCommonState();
  }

  componentWillReceiveProps(nextProps) {
    this.setCommonState(nextProps);
  }

  render() {
    const { pickerData, value } = this.state;
    return (
      <div className="MonthPicker">
        <div className="date-picker-container">
          <PickerView
            cols={2}
            data={pickerData}
            value={value}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default MonthPicker;