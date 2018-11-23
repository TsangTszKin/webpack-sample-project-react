import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/strategy/Index';
import PageHeader from '@/components/PageHeader';
import { Table, Select, Spin, message, Modal } from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import TableAction from '@/components/business/strategy/definition/TableAction';
import strategyService from '@/api/business/strategyService';
import Status from '@/components/Status';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';

@withRouter
@observer
class Definition extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.multiDelete = this.multiDelete.bind(this);
        this.multiOffline = this.multiOffline.bind(this);
        this.multiOnline = this.multiOnline.bind(this);
        this.showConfirm = this.showConfirm.bind(this);

    }
    componentDidMount() {
        store.getDataSourceForApi();
    }


    multiDelete() {
        var ids = [];
        for (let i = 0; i < store.getDataSource.length.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];
                if (element === i && store.getDataSource[i].statusNumber !== 4) {
                    ids.push(store.getDataSource[i].id);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        common.loading.show();
        strategyService.changeStrategyStatus(ids, "delete").then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            store.getDataSourceForApi();
            store.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        });

    }

    multiOnline() {
        var ids = [];
        let selectedDataSource = [];
        for (let i = 0; i < store.getDataSource.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];

                if (element === i && store.getDataSource[i].statusNumber === 1) {
                    ids.push(store.getDataSource[i].id);
                    selectedDataSource.push(store.getDataSource[i]);
                }
            }
        }
        let eventSourceId;
        for (let i = 0; i < selectedDataSource.length; i++) {
            const element = selectedDataSource[i];
            if (i === 0) {
                eventSourceId = element.eventSourceId;
            } else {
                if (element.eventSourceId !== eventSourceId) {
                    message.warning("请选择在同一个事件源下的策略上线");
                    return;
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        common.loading.show();
        strategyService.changeStrategyStatus(ids, "online", eventSourceId).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            store.getDataSourceForApi();
            store.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        });

    }

    multiOffline() {
        var ids = [];
        for (let i = 0; i < store.getDataSource.length; i++) {
            for (let j = 0; j < store.getSelectedRowKeys.length; j++) {
                const element = store.getSelectedRowKeys[j];
                if (element === i && store.getDataSource[i].statusNumber === 4) {
                    ids.push(store.getDataSource[i].id);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        common.loading.show();
        strategyService.changeStrategyStatus(ids, "offline").then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            store.getDataSourceForApi();
            store.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        });

    }

    /**
     * 表格排序变化回调
     */
    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.setPageNum(pageNum);
        store.setPageSize(pageSize);
        store.getDataSourceForApi();
    }

    /**
     * 工具栏参数发生变化回调
     */
    changeToolBar = (selectValue, keyword) => {
        console.log(`选择：${selectValue} 关键词：${keyword}`);
        var query = {
            name: keyword,
            code: keyword,
            category: selectValue
        }
        store.setPageNum(1);
        store.setQuery(query);
        store.getDataSourceForApi();
    }

    modalAddOkCallBack = () => {
        this.props.history.push('/business/variable/real-time-query/save')
    }

    modalCancelCallBack = () => {

    }

    showConfirm(type) {
        let title;
        let self = this;
        switch (type) {
            case '1':
                title = "上线";
                break;
            case '2':
                title = "下线";
                break;
            case '3':
                title = "删除";
                break;

            default:
                break;
        }
        Modal.confirm({
            title: '确定批量' + title + '?',
            content: '',
            onOk() {
                console.log('OK');
                switch (type) {
                    case '1':
                        self.multiOnline();
                        break;
                    case '2':
                        self.multiOffline();
                        break;
                    case '3':
                        self.multiDelete();
                        break;
                    default:
                        break;
                }
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    render() {
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => {
                return a.name.localeCompare(b.name)
            }
        }, {
            title: '标识',
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => {
                return a.code.localeCompare(b.code)
            }
        }, {
            title: '更新时间',
            dataIndex: 'modifiedTime',
            key: 'modifiedTime'
        }, {
            title: '事件源',
            dataIndex: 'eventSourceName',
            key: 'eventSourceName'
        }, {
            title: '维度',
            dataIndex: 'dimensionName',
            key: 'dimensionName'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action'
        }];
        const rowSelection = {
            selectedRowKeys: store.getSelectedRowKeys,
            onChange: (selectedRowKeys) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                store.setSelectedRowKeys(selectedRowKeys);
            }
        };
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar selectName="选择策略类别" categoryType="strategy" changeToolBar={this.changeToolBar} searchPlaceholder="输入变量名或标识查询">
                            <Select
                                style={{ width: '106px' }}
                                placeholder="新建策略"
                                style={{ width: '109px', float: 'right', margin: '4px 20px 0 0' }}
                                className="add-select"
                                value="新建策略"
                            >
                                <Select.Option value="1" onClick={() => this.props.history.push('/business/strategy/definition/save/greedy')}>贪婪模式</Select.Option>
                                <Select.Option value="2" onClick={() => this.props.history.push('/business/strategy/definition/save/process')}>流程模式</Select.Option>
                                <Select.Option value="3" onClick={() => this.props.history.push('/business/strategy/definition/save/sql')}>SQL模式</Select.Option>
                            </Select>
                            <Select
                                style={{ width: '106px' }}
                                placeholder="批量操作"
                                style={{ width: '109px', float: 'right', margin: '4px 20px 0 0' }}
                                value="批量操作"
                                onChange={(value) => {
                                    this.showConfirm(value);
                                }}
                            >
                                <Select.Option value="1">上线</Select.Option>
                                <Select.Option value="2">下线</Select.Option>
                                <Select.Option value="3">删除</Select.Option>
                            </Select>
                        </PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table rowSelection={rowSelection} columns={columns} dataSource={store.getDataSource} pagination={false} />
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize} changePage={this.changePage}></Paging>
                    </div>
                </div>
            </Provider >
        )
    }
}

export default Definition