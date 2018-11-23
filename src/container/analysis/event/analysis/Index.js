import React, { Component } from 'react'
import SelectGroup from '@/components/analysis/SelectGroup';
import SelectGroup2 from '@/components/analysis/SelectGroup2';
import { Divider, Radio, Dropdown, Table, Menu } from 'antd';
import TimeRangePicker from '@/components/analysis/TimeRangePicker';
import Paging from '@/components/Paging';
import { Chart, Tooltip, Axis, Legend, Line, Point } from 'viser-react';
import { withRouter } from 'react-router-dom';
import '@/styles/analysis/eventDetails.less';
import store from '@/store/analysis/event/DetailsStore';
import { Provider, observer } from 'mobx-react';

const DataSet = require('@antv/data-set');
const sourceData = [
    { month: 'Jan', 交易金额: 7.0, 交易种类: 3.9, 卡号: 2.9 },
    { month: 'Feb', 交易金额: 6.9, 交易种类: 4.2, 卡号: 3.9 },
    { month: 'Mar', 交易金额: 9.5, 交易种类: 5.7, 卡号: 4.9 },
    { month: 'Apr', 交易金额: 14.5, 交易种类: 8.5, 卡号: 6.9 },
    { month: 'May', 交易金额: 18.4, 交易种类: 11.9, 卡号: 5.9 },
    { month: 'Jun', 交易金额: 21.5, 交易种类: 15.2, 卡号: 4.9 },
    { month: 'Jul', 交易金额: 25.2, 交易种类: 17.0, 卡号: 10.9 },
    { month: 'Aug', 交易金额: 26.5, 交易种类: 16.6, 卡号: 13.9 },
    { month: 'Sep', 交易金额: 23.3, 交易种类: 14.2, 卡号: 8.9 },
    { month: 'Oct', 交易金额: 18.3, 交易种类: 10.3, 卡号: 9.9 },
    { month: 'Nov', 交易金额: 13.9, 交易种类: 6.6, 卡号: 10.9 },
    { month: 'Dec', 交易金额: 9.6, 交易种类: 4.8, 卡号: 3.9 },
];

const dv = new DataSet.View().source(sourceData);
dv.transform({
    type: 'fold',
    fields: ['交易金额', '交易种类', , '卡号'],
    key: 'city',
    value: 'temperature',
});
const data = dv.rows;

const scale = [{
    dataKey: 'month',
    min: 0,
    max: 1,
}];


const dataSource = [{
    key: '1',
    name: '当月购买数',
    age: "交易金额",
    address: 50
}, {
    key: '2',
    name: '本周第一笔达标流水号',
    age: "交易种类",
    address: 12
}];



@withRouter
@observer
class Analysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectGroupValueList: [''],
            selectData: [{ code: '', value: '所有' }, { code: 1, value: "默认类别" }]
        }

    }

    componentDidMount() {
        store.getEventSourceListAndStrategyList();
        store.getEventDetails();
    }

    render() {

        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">操作一</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">操作二</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">操作三</a>
                </Menu.Item>
            </Menu>
        );

        const columns = [{
            title: '事件源',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '策略',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '交易数',
            dataIndex: 'address',
            key: 'address',
            render: text => <a href="javascript:;" onClick={() => this.props.history.push("/analysis/event/details")}>{text}</a>,
        }];

        return (
            <Provider store={store}>
                <div className='panel'>

                    <div className="pageContent">
                        <SelectGroup firstTitle="选择事件：" />
                        <SelectGroup2 firstTitle="选择规则：" style={{ display: 'flow-root', margin: '0 0 24px 0px', float: 'left' }} />
                        <Divider />
                        <div style={{ height: '32px' }}>
                            <TimeRangePicker />
                            <Radio.Group value={1} onChange={this.handleSizeChange} style={{ float: 'right' }}>
                                <Radio.Button value={1}>卡号</Radio.Button>
                                <Radio.Button value={2}>客户号</Radio.Button>
                                <Dropdown overlay={menu} placement="bottomCenter">
                                    <Radio.Button value="more">...</Radio.Button>
                                </Dropdown>
                            </Radio.Group>
                        </div>

                        <Chart forceFit height={400} data={data} scale={scale}>
                            <Tooltip />
                            <Axis />
                            <Legend />
                            <Line position="month*temperature" color="city" />
                            <Point position="month*temperature" color="city" size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape="circle" />
                        </Chart>
                        <Table dataSource={dataSource} columns={columns} onChange={() => { }} pagination={false} />
                        <Paging pageNum={1} total={100} changePage={() => { }}></Paging>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Analysis