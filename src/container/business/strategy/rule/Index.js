import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/rule/Index';
import PageHeader from '@/components/PageHeader';
import { Table, Spin, message } from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import TableAction from '@/components/business/strategy/rule/TableAction';
import strategyService from '@/api/business/strategyService';
import Status from '@/components/Status';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';

@withRouter
@observer
class Rule extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.changeToolBar = this.changeToolBar.bind(this);
    }
    componentDidMount() {
        store.getDataSourceForApi();
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
        }, {
            title: '类别',
            dataIndex: 'categoryName',
            key: 'categoryName'
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
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        <PageToolBar selectName="选择规则类别" categoryType="rule" changeToolBar={this.changeToolBar} searchPlaceholder="输入变量名或标识查询" btnStr="新增规则" btnCallBack={() => this.props.history.push({ pathname: '/business/strategy/rule/save' })}></PageToolBar>
                        <Spin spinning={store.getIsLoading} size="large">
                            <Table columns={columns} dataSource={store.getDataSource} pagination={false} />
                        </Spin>
                        <Paging pageNum={store.getPageNum} total={store.getTotal} showPageSize={store.getPageSize} changePage={this.changePage}></Paging>
                    </div>
                </div>
            </Provider >
        )
    }
}

export default Rule