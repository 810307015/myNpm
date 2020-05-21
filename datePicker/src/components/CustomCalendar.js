/**
 * 日历展示，接受一个日期，展示该月的日历
 */
import React, { Component } from 'react';
import moment from 'moment';
import {
  monthDay
} from '../util/datePicker';

import './CustomCalendar.less';

const current = moment(new Date()).format('YYYY-MM-DD');

class CustomCalendar extends Component {

  static defaultProps = {
    type: 'day', // 类型，day，只选择某天的日期，range，选择一个时间范围
    value: [current, current],
    month: current, // 记录当前展示是哪个月份的日历
    isTodayLast: true, // 可选最大时间是否为当前时间
  }

  state = {
    type: 'day',
    value: [current, current], // 当前选中的范围或者当前选中日期
    calendarData: [], // 当前月份的日历数据
    month: current, // 记录当前展示是哪个月份的日历
    isTodayLast: true, // 可选最大时间是否为当前时间
  }

  onSelected = (day) => {
    const { onSelected } = this.props;
    const { date } = day;
    const current = moment(date).format('YYYY-MM-DD');
    this.setState({
      value: [current]
    }, () => {
      onSelected && typeof onSelected === 'function' && onSelected(current);
    });
  }

  setCommonState = (props) => {
    const { type, month, value, isTodayLast } = props || this.props;
    const calendarData = monthDay(month);
    this.setState({
      type,
      calendarData,
      month,
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
    const { calendarData, month, value, type, isTodayLast } = this.state;
    return (
      <div className="CustomCalendar">
        <div className="date-picker-calendar">
          <div className="date-picker-calendar-row">
            <div className="date-picker-calendar-item title">一</div>
            <div className="date-picker-calendar-item title">二</div>
            <div className="date-picker-calendar-item title">三</div>
            <div className="date-picker-calendar-item title">四</div>
            <div className="date-picker-calendar-item title">五</div>
            <div className="date-picker-calendar-item freedom title">六</div>
            <div className="date-picker-calendar-item freedom title">日</div>
          </div>
          
          {/* 开始循环遍历日历数据 */}
          {
            type === 'day' && calendarData.map((week, i) => {
              return (
                <div className="date-picker-calendar-row" key={`week-${i}`}>
                  {
                    week.map((day, index) => {
                      return (
                        <div
                          key={`${day.day}-${index}`} 
                          className={`date-picker-calendar-item 
                                      ${!moment(month).isSame(day.date, 'month') ? 'gray' : ''}
                                      ${moment(value[0]).isSame(day.date, 'day') ? 'active' : ''}
                                      ${isTodayLast && moment(day.date).isAfter(moment(new Date())) ? 'disabled' : ''}`
                                    }
                          onClick={() => this.onSelected(day)}         
                        >
                          {
                            day.day
                          }
                        </div>
                      );
                    })
                  }
                </div>
              );
            })
          }
          {
            type === 'range' && calendarData.map((week, i) => {
              return (
                <div className="date-picker-calendar-row" key={`week-${i}`}>
                  {
                    week.map((day, index) => {
                      return (
                        <div
                          key={`${day.day}-${index}`} 
                          className={`date-picker-calendar-item 
                                      ${!moment(month).isSame(day.date, 'month') ? 'gray' : ''}
                                      ${value[1] && moment(day.date).isAfter(value[0], 'day') && moment(day.date).isBefore(value[1], 'day') ? 'includes' : ''}
                                      ${moment(value[0]).isSame(day.date, 'day') ? (!value[1] ? 'start noBg' : 'start') : ''}
                                      ${value[1] && moment(value[1]).isSame(day.date, 'day') ? 'end' : ''}
                                      ${index === 0 ? 'first-col' : ''}
                                      ${index === 6 ? 'last-col' : ''}
                                      ${isTodayLast && moment(day.date).isAfter(moment(new Date())) ? 'disabled' : ''}`
                                    }
                          onClick={() => this.onSelected(day)}         
                        >
                          {
                            (moment(value[0]).isSame(day.date, 'day') || (value[1] && moment(value[1]).isSame(day.date, 'day')))
                            ? <div className="effect-box">{day.day}</div>
                              : day.day
                          }
                        </div>
                      );
                    })
                  }
                </div>
              );
            })
          }
          
        </div>
      </div>
    );
  }
}

export default CustomCalendar;