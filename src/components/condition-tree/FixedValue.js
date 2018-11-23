import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input, DatePicker, InputNumber, Switch } from 'antd';
import moment from 'moment';
import common from '@/utils/common';

const dateFormat = 'YYYY-MM-DD';
class FixedValue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
        this.getVarDataType = this.getVarDataType.bind(this);
        this.changeData = this.changeData.bind(this);
        this.changeDataForList = this.changeDataForList.bind(this);
    }

    componentDidMount() {
        if (this.getVarDataType() === 'time' && common.isEmpty(this.props.value)) {
            if (this.props.type === 'tree') {
                this.changeData('value', this.getCurrentTimeString());
                this.changeData('valueCode', this.getCurrentTimeString());
            } else if (this.props.type === 'defaultValue') {
                this.changeData('defaultValue', this.getCurrentTimeString());
            } else if (this.props.type === 'defaultValueForList') {
                this.changeDataForList(this.props.index, 'defaultValue', this.getCurrentTimeString());
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dataType == 93 && common.isEmpty(nextProps.value)) {
            if (nextProps.type === 'tree') {
                this.changeData('value', this.getCurrentTimeString());
                this.changeData('valueCode', this.getCurrentTimeString());
            } else if (this.props.type === 'defaultValue') {
                this.changeData('defaultValue', this.getCurrentTimeString());
            } else if (this.props.type === 'defaultValueForList') {
                this.changeDataForList(this.props.index, 'defaultValue', this.getCurrentTimeString());
            }
        }
    }

    changeData = (name, value) => {
        if (this.getVarDataType() === 'int') {
            let eventPercentage = String(value);
            if (eventPercentage.indexOf('.') >= 0) {

                value = Number(eventPercentage.split('.')[0]);
            }
        }
        this.props.changeData(name, value)
    }

    changeDataForList = (i, name, value) => {
        if (this.getVarDataType() === 'int') {
            let eventPercentage = String(value);
            if (eventPercentage.indexOf('.') >= 0) {

                value = Number(eventPercentage.split('.')[0]);
            }
        }
        this.props.changeData(i, name, value)
    }



    getVarDataType = () => {
        let rs = null;
        let dataType = this.props.dataType;
        if (typeof dataType === 'string')
            dataType = Number(dataType)

        switch (dataType) {
            case 12:
                rs = 'string';
                break;
            case -3:
                rs = 'string';
                break;
            case -5:
                rs = 'int';
                break;
            case 4:
                rs = 'int';
                break;
            case -6:
                rs = 'int';
                break;
            case 5:
                rs = 'int';
                break;
            case 3:
                rs = 'float';
                break;
            case 2:
                rs = 'float';
                break;
            case 6:
                rs = 'float';
                break;
            case 16:
                rs = 'boolean';
                break;
            case 93:
                rs = 'time';
                break;
            case 1111:
                rs = 'string';
                break;
            default:
                break;
        }
        return rs
    }

    getCurrentTimeString() {
        var date = new Date();
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + '';
        return Y + M + D;
    }

    render() {

        switch (this.getVarDataType()) {
            case "string":
                if (this.props.type === 'tree')
                    return <Input value={this.props.value} style={this.props.style ? this.props.style : {}} placeholder="输入字符串" onChange={(e) => { this.changeData('value', e.target.value); this.changeData('valueCode', e.target.value); }} className="valueType" />
                else if (this.props.type === 'defaultValue') {
                    return <Input value={this.props.value} style={this.props.style ? this.props.style : {}} placeholder="输入字符串" onChange={(e) => { this.changeData('defaultValue', e.target.value); }} className="valueType" />
                } else if (this.props.type === 'defaultValueForList') {
                    return <Input defaultValue={this.props.value} style={this.props.style ? this.props.style : { width: '150px' }} placeholder="输入字符串" onChange={(e) => { this.changeDataForList(this.props.index, 'defaultValue', e.target.value); }} className="valueType" />
                }
            case "int":
                if (this.props.type === 'tree')
                    return <InputNumber value={this.props.value} style={this.props.style ? this.props.style : {}} placeholder="输入整数值" min={-100000000} max={100000000} onChange={(value) => { this.changeData('value', value); this.changeData('valueCode', value); }} className="valueType" />
                else if (this.props.type === 'defaultValue') {
                    return <InputNumber value={this.props.value} style={this.props.style ? this.props.style : {}} placeholder="输入整数值" min={-100000000} max={100000000} onChange={(value) => { this.changeData('defaultValue', value); }} className="valueType" />
                } else if (this.props.type === 'defaultValueForList') {
                    return <InputNumber defaultValue={this.props.value} style={this.props.style ? this.props.style : { width: '150px' }} placeholder="输入整数值" min={-100000000} max={100000000} onChange={(value) => { this.changeDataForList(this.props.index, 'defaultValue', value); }} className="valueType" />
                }

            case "float":
                if (this.props.type === 'tree')
                    return <InputNumber value={this.props.value} style={this.props.style ? this.props.style : {}} placeholder="输入浮点型" min={-100000000} max={100000000} onChange={(value) => { this.changeData('value', value); this.changeData('valueCode', value); }} className="valueType" />
                else if (this.props.type === 'defaultValue') {
                    return <InputNumber value={this.props.value} style={this.props.style ? this.props.style : {}} placeholder="输入浮点型" min={-100000000} max={100000000} onChange={(value) => { this.changeData('defaultValue', value); }} className="valueType" />
                } else if (this.props.type === 'defaultValueForList') {
                    return <InputNumber defaultValue={this.props.value} style={this.props.style ? this.props.style : { width: '150px' }} placeholder="输入浮点型" min={-100000000} max={100000000} onChange={(value) => { this.changeDataForList(this.props.index, 'defaultValue', value); }} className="valueType" />
                }

            // case "boolean":
            //     return <Switch style={{margin: '16px 5px 0 5px', float: 'left' }} checkedChildren="是" unCheckedChildren="否" />
            case "time":
                if (this.props.type === 'tree')
                    return <DatePicker value={common.isEmpty(this.props.value) ? moment(this.getCurrentTimeString(), dateFormat) : moment(this.props.value, dateFormat)} style={this.props.style ? this.props.style : { width: '110px', margin: '10px 5px', float: 'left' }} onChange={(date, dateString) => { this.changeData('value', dateString); this.changeData('valueCode', dateString); }} />
                else if (this.props.type === 'defaultValue') {
                    return <DatePicker value={common.isEmpty(this.props.value) ? moment(this.getCurrentTimeString(), dateFormat) : moment(this.props.value, dateFormat)} style={this.props.style ? this.props.style : { width: '110px', margin: '10px 5px', float: 'left' }} onChange={(date, dateString) => { this.changeData('defaultValue', dateString); }} />
                } else if (this.props.type === 'defaultValueForList') {
                    return <DatePicker defaultValue={common.isEmpty(this.props.value) ? moment(this.getCurrentTimeString(), dateFormat) : moment(this.props.value, dateFormat)} style={this.props.style ? this.props.style : { width: '150px' }} onChange={(date, dateString) => { this.changeDataForList(this.props.index, 'defaultValue', dateString); }} />
                }

            default:
                if (this.props.type === 'tree')
                    return <Input placeholder="" style={this.props.style ? this.props.style : { width: '95px', margin: '10px 5px', float: 'left' }} disabled={true} />
                else if (this.props.type === 'defaultValue') {
                    return <Input placeholder="" style={this.props.style ? this.props.style : { width: '95px', margin: '10px 5px', float: 'left' }} disabled={true} />
                } else if (this.props.type === 'defaultValueForList') {
                    return <Input placeholder="" style={{ width: '150px' }} disabled={true} />

                }

        }
        // return <Input placeholder="请选择变量" disabled={true} />
    }
}

FixedValue.propTypes = {
    dataType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool
    ]),
    changeData: PropTypes.func,
    type: PropTypes.oneOf(['tree', 'defaultValue', 'defaultValueForList'])
}
FixedValue.defaultProps = {
    dataType: ""//string
}

export default FixedValue