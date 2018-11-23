import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, DatePicker, TimePicker } from 'antd';
import moment from 'moment';

const timeTypeList = [
    { code: 'HOUR', value: '按小时' },
    { code: 'DAY', value: '按天' },
    { code: 'WEEK', value: '按周' },
    { code: 'MONTH', value: '按月' }
]

class TimeRangePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeType: ''
        }
    }

    render() {
        return (
            <div style={{float: 'left'}}>
                <Select style={{ width: '150px', marginRight: '10px' }} onChange={(value) => { this.setState({ timeType: value }) }} placeholder="选择时间">
                    {
                        timeTypeList.map((item, i) =>
                            <Select.Option value={item.code}>{item.value}</Select.Option>
                        )
                    }
                </Select>
                {(() => {
                    switch (this.state.timeType) {
                        case 'HOUR':
                            return <TimePicker />
                        case 'DAY':
                            return <DatePicker.RangePicker />
                        case 'WEEK':
                            return <DatePicker.WeekPicker placeholder="选择周" />
                        case 'MONTH':
                            return <DatePicker.MonthPicker placeholder="选择月" />
                        default:
                            break;
                    }
                })()}

            </div>
        )
    }
}
TimeRangePicker.propTypes = {

}
TimeRangePicker.defaultProps = {

}
export default TimeRangePicker;