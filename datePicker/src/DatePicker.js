/**
 * 时间选择器，根据传入的type类型展示不同类型的选择器
 * 
 * 用法：
 *   引入： import DatePicker from '@/components/datePicker/DatePicker';
 *   使用:  
 *     年份选择：<DatePicker type="year" onConfirm={this.onConfirm} option={{ min: 1900, max: 2050 }} value={[2020]} /> 
 *                option 不传的话默认时间范围是2000-2030年
 *                value 年份的时候传一个一维数组，里面是年份，可以不穿默认为当前年份
 *                onConfirm 作为确定按钮的回调，将选择的年份传出，数据格式也是[2020]这样的，保证传入传出数据格式一致，所有的类型选择器都是一样
 * 
 *     月份选择  <DatePicker type="month" onConfirm={this.onConfirm} option={{ min: 1900, max: 2050 }} value={[2025, 10]} />
 *                type为month，value多了一个月份，格式依然是数组的形式，[2020, 10]，传出的也是[2020, 10]这样的格式，可以不传，不传默认取当前时间
 * 
 *    周选择器  <DatePicker type="week" onConfirm={this.onConfirm} /> 传入传出的value是['2020-02-01', '2020-02-02']，只要是正确的时间格式就行了
 * 
 *   日期选择器 <DatePicker type="day" onConfirm={this.onConfirm} /> 传入传出的value是[date]
 * 
 *   范围选择器 <DatePicker type="range" onConfirm={this.onConfirm} /> 传入传出的value是['2020-02-01', '2020-02-02']
 * 
 *    新增了一个title属性，就是覆盖默认的时间显示，在tab栏中有自定义时间选择的时候，可以使用title来覆盖默认的，保证使用的时候不会破坏页面的布局
 *   <DatePicker type="range" onConfirm={this.onConfirm} title={<div>自定义</div>} />
 * 
 *   新增了一个option的自定义配置属性，isTodayLast，最大可选时间是否为当前时间，默认为true，用法
 *    <DatePicker type="range" option={{ isTodayLast: true }} onConfirm={this.onConfirm} title={<div>自定义</div>} />
 */
import React, { Component } from 'react';
import { Modal } from 'antd-mobile';
import moment from 'moment';

import YearPicker from './components/YearPicker';
import MonthPicker from './components/MonthPicker';
import WeekPicker from './components/WeekPicker';
import DayPicker from './components/DayPicker';
import RangePicker from './components/RangePicker';
import PickerHeader from './components/PickerHeader';
import ButtonGroup from './components/ButtonGroup';

import {
  getCurrentYear,
  getCurrentYearMonth,
  getMonthAndWeek
} from './util/datePicker';

import './DatePicker.less';

class DatePicker extends Component {

  static defaultProps = {
    type: 'year', // year,month,week,day,custom,年选择器，月选择器，周选择器，日选择器，自定义范围选择器
    option: {}, // 自定义的配置，用来覆盖默认配置
    title: '', // 自定义显示的内容，方便某些时候使用，比如tab栏里面有自定义时间段的选择
    value: []
  };

  state = {
    show: false, // 是否开启选择
    value: [], // 当前值
    defaultValue: [], // 默认值，用来重置的时候还原
    title: '',
  }

  showPicker = () => {
    this.setState({
      show: true
    });
  }

  // 重置
  reset = () => {
    const { defaultValue } = this.state;
    this.setState({
      value: defaultValue
    });
  }

  // 取消
  cancel = () => {
    this.setState({
      show: false
    });
  };

  // 确认
  confirm = () => {
    const { onConfirm } = this.props;
    const { type } = this.state;
    let value = this.picker.state.value;
    if (type === 'week') {
      const pickerMap = this.picker.state.pickerMap;
      value = pickerMap[value[0]].split(',');
    }
    this.setState({
      value,
      show: false
    }, () => {
      onConfirm && typeof onConfirm === 'function' && onConfirm(value);
    });
  }

  renderPicker = () => {
    const { type, option, value } = this.state;
    let component = null;
    switch (type) {
      case 'year':
        component = <YearPicker ref={picker => this.picker = picker} option={option} onChange={this.onChange} value={value} />
        break;
      case 'month':
        component = <MonthPicker ref={picker => this.picker = picker} option={option} onChange={this.onChange} value={value} />
        break;
      case 'week':
        component = <WeekPicker ref={picker => this.picker = picker} option={option} onChange={this.onChange} value={value} />
        break;
      case 'day':
        component = <DayPicker ref={picker => this.picker = picker} option={option} onChange={this.onChange} value={value} />
        break;
      case 'range':
        component = <RangePicker ref={picker => this.picker = picker} option={option} onChange={this.onChange} value={value} />
        break;
    }
    return component;
  }

  renderTitle = () => {
    const { type, value } = this.state;
    let title = null;
    switch (type) {
      case 'year':
        title = <div className="value">{value[0] || '--'}年</div>;
        break;
      case 'month':
        title = <div className="value">{value[0] || '--'}-{value[1] && value[1].toString().padStart(2, '0') || '--'}</div>;
        break;
      case 'week':
        const monthWeek = getMonthAndWeek(value[0]);
        const { yearMonth, week, range } = monthWeek;
        title = <div className="value">{yearMonth} 第{week}周 ({moment(range[0]).format('MM月DD日')}-{moment(range[1]).format('MM月DD日')})</div>;
        break;
      case 'day':
        title = <div className="value">{moment(value[0]).format('YYYY-MM-DD')}</div>;
        break;
      case 'range':
        title = <div className="value">{moment(value[0]).format('YYYY-MM-DD')} 至 {moment(value[1]).format('YYYY-MM-DD')}</div>;
        break;
    }
    return title;
  };

  // 获取每种类型选择器的默认值
  getDefaultValue = (props) => {
    const { type } = props || this.props;
    let defaultValue = [];
    switch (type) {
      case 'year':
        defaultValue = getCurrentYear();
        break;
      case 'month':
        defaultValue = getCurrentYearMonth();
        break;
      case 'week':
        defaultValue = getMonthAndWeek().range;
        break;
      case 'day':
        defaultValue = [moment(new Date()).format('YYYY-MM-DD')];
        break;
      case 'range':
        defaultValue = [moment(new Date()).subtract(1, 'weeks').format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')];
        break;
    }
    return defaultValue;
  };

  setCommonState = (props) => {
    const defaultValue = this.getDefaultValue(props);
    const { type, option, value, title } = props || this.props;
    this.setState({
      type,
      option,
      title,
      value: value.length > 0 ? value : defaultValue,
      defaultValue: value.length > 0 ? value : defaultValue, // 记录初始值，方便重置使用
    });
  }

  componentDidMount() {
    this.setCommonState();
  }

  componentWillReceiveProps(nextProps) {
    this.setCommonState(nextProps);
  }

  render() {
    const { show, title } = this.state;
    return (
      <div className="DatePicker">
        {
          !title ? <div className="date-picker-trigger" onClick={this.showPicker}>
            {this.renderTitle()}
            <div className="triangle"></div>
          </div> : <div onClick={this.showPicker}>
            { title }
          </div>
        }
        <Modal
          popup
          className="custom-date-picker-modal"
          visible={show}
          onClose={() => { this.setState({ show: false }) }}
          animationType="slide-up"
        >
          <PickerHeader reset={this.reset} />
          {
            this.renderPicker()
          }
          <ButtonGroup
            cancel={this.cancel}
            confirm={this.confirm}
          />
        </Modal>
      </div>
    );
  }
}

export default DatePicker;