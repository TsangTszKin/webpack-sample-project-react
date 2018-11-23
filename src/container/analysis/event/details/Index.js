import React, { Component } from 'react'
import SelectGroup from '@/components/analysis/SelectGroup';
import SelectGroup2 from '@/components/analysis/SelectGroup2';
import { Divider, TreeSelect, Table, Drawer, Spin } from 'antd';
import Paging from '@/components/Paging';
import FlowNumberDetails from '@/components/analysis/FlowNumberDetails';
import eventService from '@/api/analysis/eventService';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
import '@/styles/analysis/eventDetails.less';
import store from '@/store/analysis/event/DetailsStore';
import { Provider, observer } from 'mobx-react';
import TimeRangePicker from '@/components/analysis/TimeRangePicker';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

@observer
class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.onChangeForTree = this.onChangeForTree.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    componentDidMount() {
        store.getEventSourceListAndStrategyList();
        store.getEventDetails();
    }

    onChangeForTree = (treeDataValue) => {
        console.log('onChangeForTree ', treeDataValue);
        store.setColsValue(treeDataValue);
        store.getEventDetails();
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.setPageNum(pageNum);
        store.setpageSize(pageSize);
        store.getEventDetails();
    }

    render() {
        let tProps = {
            treeData: store.getCols,
            value: store.getColsValue,
            onChange: this.onChangeForTree,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '选择报文字段',
            style: {
                width: 170,
                float: 'right',
                marginBottom: '15px'
            },
        };
        return (
            <Provider store={store}>
                <div className='panel'>
                    <div className="pageContent" id="analysis-event-details">
                        <SelectGroup firstTitle="选择事件：" />
                        <SelectGroup2 firstTitle="选择规则：" style={{ display: 'flow-root', margin: '0 0 24px 0px', float: 'left' }} />
                        <Divider />
                        <div style={{ height: '32px', marginBottom: '24px'}}>
                            <TimeRangePicker />
                            <TreeSelect {...tProps} disabled={store.getSelectValueList1.length == 0 ? true : false} />
                        </div>
                        <Spin size="large" spinning={store.getIsLoading}>
                            <Table id="analysis-details" dataSource={store.getDataSource} columns={store.getColumns} onChangeForTree={() => { }} pagination={false} />
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize} changePage={this.changePage}></Paging>

                        <Drawer
                            title="流水号查看明细"
                            placement="right"
                            closable={false}
                            onClose={() => { store.setShowDrawer(false) }}
                            visible={store.getShowDrawer}
                            width={720}
                        >
                            <FlowNumberDetails />
                        </Drawer>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Details