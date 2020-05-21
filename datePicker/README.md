### 安装

- `npm install date-picker4mobile --save`

### 使用方法

```React
import DatePicker from 'date-picker4mobile';

// 年份选择
// option 不传的话默认时间范围是2000-2030年
// value 年份的时候传一个一维数组，里面是年份，可以不穿默认为当前年份
// onConfirm 作为确定按钮的回调，将选择的年份传出，数据格式也是[2020]这样的，保证传入传出数据格式一致，所有的类型选择器都是一样
<DatePicker 
  type="year" 
  onConfirm={this.onConfirm} 
  option={{ min: 1900, max: 2050 }} 
  value={[2020]}  
/>


// 月份选择
<DatePicker 
  type="month" 
  onConfirm={this.onConfirm} 
  option={{ min: 1900, max: 2050 }} 
  value={[2025, 10]} 
/>

// 日期选择
// 传入传出的value是[date]
<DatePicker 
  type="day" 
  onConfirm={this.onConfirm} 
  option={{ min: 1900, max: 2050 }} 
  value={['2020-05-20']} 
/>


// 范围选择器
// option: { isTodayLast: true }, // 默认以当前天数为最后一天，false就可以继续往后选，所有的类型都有
<DatePicker 
  type="range" 
  onConfirm={this.onConfirm}
  title={<div>自定义</div>} // 可以不传，当需要自定义展示的内容时，可以手动传入
/> 传入传出的value是['2020-02-01', '2020-02-02']

onConfirm = (value) => {
  console.log(value);
  // 年份 [2020]
  // 月份 [2020, 5]
  // 日期 [ '2020-05-20' ]
  // 范围 ['2020-05-01', '2020-05-20']
}

```

### 效果展示图

- 年份选择效果图
- ![年份选择](https://cdn.img.wenhairu.com/images/2020/05/21/YI6Id.png)

- 月份选择效果图
- ![月份选择](https://cdn.img.wenhairu.com/images/2020/05/21/YI8lH.png)

- 日期选择效果图
- ![日期选择](https://cdn.img.wenhairu.com/images/2020/05/21/YImUq.png)

- 范围选择效果图
- ![范围选择](https://cdn.img.wenhairu.com/images/2020/05/21/YIqgX.png)

