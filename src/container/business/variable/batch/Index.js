import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/variable/Batch';
import PageHeader from '@/components/PageHeader';
import { Table, Switch, Spin, message } from 'antd';
import Paging from '@/components/Paging';
import PageToolBar from '@/components/PageToolBar';
import Status from '@/components/Status';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';

@observer
class Batch extends Component {
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
            title: '维度',
            dataIndex: 'dimensionName',
            key: 'dimensionName'
        }, {
            title: '数据类型',
            dataIndex: 'typeLabel',
            key: 'typeLabel'
        }, {
            title: '默认值',
            dataIndex: 'defaultValue',
            key: 'defaultValue'
        },
        //  {
        //     title: '类别',
        //     dataIndex: 'categoryName',
        //     key: 'categoryName',
        //     sorter: (a, b) => a.categoryName.length - b.categoryName.length
        // },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        }];
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        {/* <PageToolBar selectName="选择类别" categoryType="var" changeToolBar={this.changeToolBar} searchPlaceholder="输入变量名或标识查询"></PageToolBar> */}
                        <PageToolBar changeToolBar={this.changeToolBar} searchPlaceholder="输入变量名或标识查询"></PageToolBar>
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

export default Batch