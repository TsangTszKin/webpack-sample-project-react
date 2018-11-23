import React, { Component } from 'react';
import FieldSelector from '@/components/analysis/FieldSelector';
import AddAndSub from '@/components/AddAndSub';
import PropTypes from 'prop-types';
import variableService from '@/api/business/variableService';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class SelectGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            selectData: [{ code: '', value: '所有' }]
        }
        this.getEventSourceSelectList = this.getEventSourceSelectList.bind(this);
        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.getEventSourceSelectList();
    }

    componentWillReceiveProps(nextProps) {
    }

    getEventSourceSelectList() {
        variableService.getEventSourceSelectList(false).then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [{ code: '', value: '所有' }];
            if (!common.isEmpty(res.data.result)) {

                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.eventSourceId,
                        value: element.eventSourceType
                    })
                })
            }
            this.setState({
                selectData: tempArray
            })
        })
    }

    add() {
        let selectValueList1 = this.props.store.getSelectValueList1;
        selectValueList1.push({eventSourceCode: '', strategyId: '', eventSourceId: ''});
        this.props.store.setSelectValueList1(selectValueList1);
    }

    render() {
        return (
            <div style={{ display: 'flow-root', marginBottom: '24px' }}>
                <p style={{ float: 'left', width: 'fint-content', height: '32px', lineHeight: '32px' }}>{this.props.firstTitle}</p>
                {this.props.store.getSelectValueList1.map((item, i) =>
                    <FieldSelector sub={this.props.sub} valueListCount={this.props.valueList.length} value={item} index={i} selectData={this.state.selectData} selectGroupChange={this.props.selectGroupChange} resultName={this.props.resultName}></FieldSelector>
                )}
                <div style={{ float: 'left', display: this.props.store.getSelectValueList1.length >= 3 ? 'none' : 'block' }}>
                    <AddAndSub type="add" add={this.add} />
                </div>
            </div>
        )
    }
}
SelectGroup.propTypes = {
    valueList: PropTypes.array,
    selectData: PropTypes.array,
    firstTitle: PropTypes.string,
    resultName: PropTypes.string,
    add: PropTypes.func,
    sub: PropTypes.func
}
SelectGroup.defaultProps = {
    valueList: [],
    selectData: []
}

export default SelectGroup;