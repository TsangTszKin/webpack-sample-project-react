import React, { Component } from 'react'
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/variable/Event'
import PageHeader from '@/components/PageHeader';
import { Table, message, Spin, Alert } from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import Status from '@/components/Status';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';

@observer
class Event extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
        this.getEventSourceSelectList = this.getEventSourceSelectList.bind(this);
        this.state = {
            selectData: []
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.getEventSourceSelectList();
        store.getDataSourceForApi();
    }

    getEventSourceSelectList() {
        var self = this;
        variableService.getEventSourceSelectList(false).then(res => {
            if (!publicUtils.isOk(res)) return
            let dataList = [{ code: '', value: '所有' }];
            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                let data = {};
                data.value = element.eventSourceType;
                data.code = element.eventSourceId;
                dataList.push(data);
            }
            self.setState({
                selectData: dataList
            });
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
            eventSourceId: selectValue
        }
        store.setPageNum(1);
        store.setQuery(query);
        store.getDataSourceForApi();
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
            },
            // sorter: (a, b) => a.code - b.code,
        }, {
            title: '事件源',
            dataIndex: 'eventSourceName',
            key: 'eventSourceName'
        }, {
            title: '数据类型',
            dataIndex: 'typeLabel',
            key: 'typeLabel'
        }, {
            title: '默认值',
            dataIndex: 'defaultValue',
            key: 'defaultValue'
        }, {
            title: '状态',
            dataIndex: 'statusLabel',
            key: 'statusLabel'
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        }];
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar selectName="选择事件源" categoryType="eventSource" changeToolBar={this.changeToolBar} selectData={this.state.selectData} searchPlaceholder="输入变量名或标识查询"></PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table columns={columns} dataSource={store.getDataSource} pagination={false} />
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize} changePage={this.changePage}></Paging>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Event