import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlowNumberIcon from '@/assets/flow-number.png';
import { Tabs, Table } from 'antd';
import StrategyPath from '@/components/analysis/StrategyPath';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class FlowNumberDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let eventVarsData = [];
        let batchVarsData = [];
        let rtqVarsData = [];
        let ruleResultOutData = [];
        let extVarsData = [];
        this.props.store.drawerDataList.forEach(element => {
            for (const key in element.eventVars) {
                if (element.eventVars.hasOwnProperty(key)) {
                    const element2 = element.eventVars[key];
                    eventVarsData.push({
                        key: common.getGuid(),
                        name: '',
                        code: key,
                        value: element2
                    })
                }
            }
            for (const key in element.batchVars) {
                if (element.batchVars.hasOwnProperty(key)) {
                    const element2 = element.batchVars[key];
                    batchVarsData.push({
                        key: common.getGuid(),
                        name: '',
                        code: key,
                        value: element2
                    })
                }
            }
            for (const key in element.rtqVars) {
                if (element.rtqVars.hasOwnProperty(key)) {
                    const element2 = element.rtqVars[key];
                    rtqVarsData.push({
                        key: common.getGuid(),
                        name: '',
                        code: key,
                        value: element2
                    })
                }
            }
            element.ruleResultOut.forEach(element2 => {
                element2.value.forEach(element3 => {
                    ruleResultOutData.push({
                        key: common.getGuid(),
                        name: '',
                        code: element2.code,
                        nodeName: element3.name
                    })
                })
            })

        })

        const varColumns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '标识',
            dataIndex: 'code',
            key: 'code',
        }, {
            title: '值',
            dataIndex: 'value',
            key: 'value',
        }];

        const outPutColumns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '原因码',
            dataIndex: 'code',
            key: 'code',
        }, {
            title: '叶子节点名称',
            dataIndex: 'nodeName',
            key: 'nodeName',
        }];

        return (
            <div>
                <div style={{ height: '32px' }}>
                    <img src={FlowNumberIcon} style={{ height: '25px', float: 'left', marginTop: '3px' }} />
                    <p style={{ height: '32px', float: 'left', fontSize: '20px', fontWeight: 'bold', margin: '0px', marginLeft: '15px' }}>事件流水号：ff808081665d0ed501665d1521620007</p>
                </div>
                <div style={{ color: '#333333', height: '90px' }}>
                    <div style={{ width: '35%', float: 'left' }}>
                        <p style={{ margin: '10px 0 5px 0' }}>事件源名称：<span style={{ color: '#000000' }}>境外信用卡交易</span></p>
                        <p style={{ margin: '10px 0 10px 0' }}>事件发生时间：<span style={{ color: '#000000' }}>2018-10-12 10:30:12</span></p>
                    </div>
                    <div style={{ width: '35%', float: 'left' }}>
                        <p style={{ margin: '10px 0 5px 0' }}>事件源标识：<span style={{ color: '#000000' }}>a123</span></p>
                        <p style={{ margin: '10px 0 10px 0' }}>决策总耗时：<span style={{ color: '#000000' }}>30ms</span></p>
                    </div>
                    <div style={{ width: '20%', float: 'left' }}>
                        <p style={{ color: '#000000', margin: '10px 0 5px 0' }}>命中策略</p>
                        <p style={{ fontSize: '20px', margin: '5px 0 10px 0' }}>风控策略</p>
                    </div>
                    <div style={{ width: '10%', float: 'left' }}>
                        <p style={{ color: '#000000', margin: '10px 0 5px 0' }}>状态</p>
                        <p style={{ fontSize: '20px', margin: '5px 0 10px 0' }}>正常</p>
                    </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Tabs defaultActiveKey="1" >
                        <Tabs.TabPane tab="决策路径" key="1">
                            <StrategyPath />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="输出结果" key="2">
                            <Table dataSource={ruleResultOutData} columns={outPutColumns} pagination={false} />
                            <p style={{ margin: '15px' }}>共{ruleResultOutData.length}条数据</p>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="事件变量" key="3">
                            <Table dataSource={eventVarsData} columns={varColumns} pagination={false} />
                            <p style={{ margin: '15px' }}>共{eventVarsData.length}条数据</p>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="批次变量" key="4">
                            <Table dataSource={batchVarsData} columns={varColumns} pagination={false} />
                            <p style={{ margin: '15px' }}>共{batchVarsData.length}条数据</p>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="实时查询变量" key="5">
                            <Table dataSource={rtqVarsData} columns={varColumns} pagination={false} />
                            <p style={{ margin: '15px' }}>共{rtqVarsData.length}条数据</p>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="衍生变量" key="6">
                            <Table dataSource={extVarsData} columns={varColumns} pagination={false} />
                            <p style={{ margin: '15px' }}>共{extVarsData.length}条数据</p>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
FlowNumberDetails.propTypes = {

}

FlowNumberDetails.defaultProps = {

}

export default FlowNumberDetails