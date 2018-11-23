import React, { Component } from 'react';
import FieldSelector2 from '@/components/analysis/FieldSelector2';
import AddAndSub from '@/components/AddAndSub';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
import strategyService from '@/api/business/strategyService';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class SelectGroup2 extends Component {
    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
        this.add = this.add.bind(this);
    }


    change = (value, option) => {

    }

    add = () => {
        let tempArray = this.props.store.getSelectValueList2;
        tempArray.push({ ruleCode: '', optType: '', value: '', col: '' });
        this.props.store.setSelectValueList2(tempArray);
    }


    render() {
        return (
            <div style={{ display: this.props.store.getSelectValueList1.length == 0 ? 'none' : 'flow-root', margin: '0 0 24px 0' }}>
                <p style={{ float: 'left', width: 'fint-content', height: '32px', lineHeight: '32px' }}>{this.props.firstTitle}</p>
                <div style={{ float: 'left' }}>
                    {this.props.store.getSelectValueList2.map((item, i) =>
                        <FieldSelector2 value={item} index={i}></FieldSelector2>
                    )}

                </div>

                <div style={{ float: 'left', display: this.props.store.getSelectValueList2.length >= 3 ? 'none' : 'block' }}>
                    <AddAndSub type="add" add={this.add} />
                </div>
            </div>
        )
    }
}
SelectGroup2.propTypes = {
    firstTitle: PropTypes.string,
    style: PropTypes.object,
    eventSourceIds: PropTypes.array,
    haveCompare: PropTypes.bool
}
SelectGroup2.defaultProps = {
    eventSourceIds: [],
    haveCompare: true
}

export default SelectGroup2;