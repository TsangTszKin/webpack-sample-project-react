import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, TreeSelect } from 'antd'
import AddAndSub from '@/components/AddAndSub';
import { inject, observer } from 'mobx-react';
import common from '@/utils/common';

const style = {
    container: {
        height: '32px',
        width: 'fit-content',
        float: 'left'
    },
    selectText: {
        width: 'fit-content',
        float: 'left',
        margin: '0px 10px 0 10px',
        height: '32px',
        lineHeight: '32px'
    },
    select: {
        width: '150px',
        float: 'left',
        margin: '0 10px'
    }
}
@inject('store')
@observer
class FieldSelector extends Component {
    constructor(props) {
        super(props);
        this.sub = this.sub.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    sub = () => {
        let selectValueList1 = this.props.store.getSelectValueList1;
        selectValueList1.splice(this.props.index, 1);
        this.props.store.setSelectValueList1(selectValueList1);

        let tempArray = [];
        selectValueList1.forEach(element => {
            tempArray.push(element.strategyId)
        })
        if (!common.isEmpty(tempArray))
            this.props.store.getRuleListByStrategyList(tempArray);

        this.props.store.getEventDetails();
    }

    onChange(value, label, extra) {
        console.log(value, label, extra);
        let eventSourceCode = extra.triggerNode.props.eventSourceCode;
        let strategyId = extra.triggerNode.props.strategyId;
        let eventSourceId = extra.triggerNode.props.eventSourceId;
        let index = this.props.index;
        let selectDataList = this.props.store.getSelectValueList1;
        selectDataList[index] = {
            eventSourceCode: eventSourceCode,
            strategyId: strategyId, 
            eventSourceId: eventSourceId
        }
        this.props.store.setSelectValueList1(selectDataList);
        this.props.store.setSelectValueList2([]);

        let tempArray = [];
        selectDataList.forEach(element => {
            tempArray.push(element.strategyId);
        })
        if (!common.isEmpty(tempArray))
            this.props.store.getRuleListByStrategyList(tempArray);
        
        this.props.store.getEventCols();
        this.props.store.getEventDetails();
        console.log(eventSourceCode, strategyId);
    }

    render() {
        return (
            <div style={style.container}>
                <TreeSelect
                    style={style.select}
                    value={common.isEmpty(this.props.store.getSelectValueList1[this.props.index].strategyId) ? this.props.store.getSelectValueList1[this.props.index].eventSourceCode : this.props.store.getSelectValueList1[this.props.index].strategyId}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={this.props.store.getStrategyList}
                    placeholder="请选择事件"
                    treeDefaultExpandAll
                    onChange={this.onChange}
                />
                {
                    this.props.store.getSelectValueList1.length > 0 ? <AddAndSub type="sub" sub={this.sub} /> : ''
                }

            </div>
        )
    }
}
FieldSelector.propTypes = {
    index: PropTypes.number
}
FieldSelector.defaultProps = {
}
export default FieldSelector;