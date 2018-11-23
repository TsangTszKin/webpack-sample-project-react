import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, InputNumber } from 'antd'
import AddAndSub from '@/components/AddAndSub';
import FixedValue from '@/components/condition-tree/FixedValue';
import { inject, observer } from 'mobx-react';

const style = {
    container: {
        height: '32px',
        width: 'fit-content',
        marginBottom: '24px'
    },
    selectText: {
        width: 'fit-content',
        float: 'left',
        margin: '0px 10px 0 10px',
        height: '32px',
        lineHeight: '32px'
    },
    select1: {
        width: '250px',
        float: 'left',
        margin: '0 10px',
    },
    select2: {
        width: '100px',
        float: 'left',
        margin: '0 10px',
        marginLeft: '30px'
    },
    input: {
        float: 'left',
        margin: '0 10px',
        width: '100px',
    }
}
const optTypeConstList = [{
    "code": 0,
    "value": "等于"
},
{
    "code": 1,
    "value": "大于"
},
{
    "code": 2,
    "value": "小于"
},
{
    "code": 3,
    "value": "不等于"
},
{
    "code": 4,
    "value": "大于等于"
},
{
    "code": 5,
    "value": "小于等于"
},
{
    "code": 8,
    "value": "空"
},
{
    "code": 9,
    "value": "不为空"
}];

@inject('store')
@observer
class FieldSelector2 extends Component {
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
        this.sub = this.sub.bind(this);
    }

    change = (key, value) => {
        let selectValueList2 = this.props.store.getSelectValueList2;
        selectValueList2[this.props.index][key] = value;
        this.props.store.setSelectValueList2(selectValueList2);
        this.props.store.getEventDetails();
        console.log(this.props.store.getSelectValueList2)
    }

    sub = () => {
        let selectValueList2 = this.props.store.getSelectValueList2;
        selectValueList2.splice(this.props.index, 1);
        this.props.store.setSelectValueList2(selectValueList2);
        this.props.store.getEventDetails();
    }

    render() {
        return (
            <div style={style.container}>
                <Select style={{ width: '150px', float: 'left', margin: '0px 30px 0 10px' }} value={this.props.value.ruleCode} onChange={(value) => { this.change('ruleCode', value); }}>
                    {this.props.store.getRuleList.map((item, i) =>
                        <Select.Option value={item.code}>{item.value}</Select.Option>
                    )}
                </Select>
                {
                    this.props.index === 0 ? <p style={{ width: '70px', float: 'left', height: '32px', lineHeight: '32px', margin: '0' }}>筛选条件：</p> : <p style={{ width: '70px', float: 'left', height: '32px', lineHeight: '32px', margin: '0' }}></p>
                }
                <Select style={{ width: '150px', float: 'left', margin: '0px 10px' }} value={this.props.value.col} onChange={(value) => { this.change('col', value); }}>
                    {this.props.store.getCols.map((item, i) =>
                        <Select.Option value={item.value}>{item.title}</Select.Option>
                    )}
                </Select>
                <Select style={{ width: '100px', float: 'left', margin: '0px 10px' }} value={this.props.value.optType} onChange={(value) => { this.change('optType', value); }}>
                    {optTypeConstList.map((item, i) =>
                        <Select.Option value={item.code}>{item.value}</Select.Option>
                    )}
                </Select>
                <InputNumber style={{ width: '100px', float: 'left', margin: '0px 10px' }} value={this.props.value.value} onChange={(value) => { this.change('value', value); }} />
                {
                    this.props.store.getSelectValueList2.length > 0 ? <AddAndSub type="sub" sub={this.sub} /> : ''
                }
            </div>
        )
    }
}
FieldSelector2.propTypes = {
    index: PropTypes.number
}
FieldSelector2.defaultProps = {
}
export default FieldSelector2;