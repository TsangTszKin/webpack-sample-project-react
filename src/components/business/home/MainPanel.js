import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Popover } from 'antd';
import variableImg from '@/assets/home/variable.png';
import CellBlock from '@/components/business/home/CellBlock';
import Cell from '@/components/business/home/Cell';
import { Link } from 'react-router-dom';
import "@/styles/business/home.less";
import { observer, inject } from 'mobx-react';


@inject('store')
@observer
class MainPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let varData = this.props.store.varData;
        console.log("varData", varData);
        let strategyData = this.props.store.strategyData;
        let strategyList = this.props.store.strategyList;

        const variableInfo = {
            name: '变量信息',
            type: 'variable',
            list: [
                { name: '事件变量', num: varData.getEventVarOnline, total: varData.getEventVarSum },
                { name: '实时变量', num: varData.getRtqVarOnline, total: varData.getRtqVarSum },
                { name: '衍生变量', num: varData.getExtVarOnline, total: varData.getExtVarSum }
            ]
        }

        const strategyInfo = {
            name: '策略信息',
            type: 'strategy',
            list: [
                { name: '总数', num: strategyData.getStrategyOnline, total: strategyData.getStrategySum },
                { name: '流程策略', num: strategyData.getFlowStrategyOnline, total: strategyData.getFlowStrategySum },
                { name: '贪婪策略', num: strategyData.getGreedyStrategyOnline, total: strategyData.getGreedyStrategySum },
                { name: '规则', num: strategyData.getRuleOnline, total: strategyData.getRuleSum },
                { name: '规则集', num: strategyData.getRuleSetOnline, total: strategyData.getRuleSetSum }
            ]
        }

        let tempArray = [];
        strategyList.forEach(element => {
            tempArray.push({
                name: element.name,
                type: element.type == 0 ? 'strategyProcess' : element.type == 1 ? 'strategyGreedy' : 'strategySql',
                list: [
                    { name: '规则', num: element.ruleSum, total: '' },
                    { name: '规则集', num: element.ruleSum, total: '' }
                ]
            })
        })
        strategyList = tempArray;

        return (
            <div>
                <Row>
                    <Col md={24} lg={9} xl={12} style={{ marginBottom: '10px' }}>
                        <div style={{ height: '176px', backgroundColor: '#fff', marginRight: '15px' }}>
                            <CellBlock data={variableInfo} />
                            <div style={{ backgroundColor: 'rgba(247, 249, 250, 1)', height: '48px', border: 'solid 1px rgba(233, 233, 233, 1)' }}>
                                <Link to="/business/variable/event" style={{ color: 'rgba(0,0,0,.65)' }}>
                                    <p style={{ height: '20px', textAlign: 'center', width: '33%', float: 'left', margin: '13px 0', cursor: 'pointer' }} title="新增">
                                        <Icon type="plus" style={{ marginRight: '5px' }} />事件变量
                                </p>
                                </Link>
                                <Link to="/business/variable/real-time-query/save" style={{ color: 'rgba(0,0,0,.65)' }}>
                                    <p style={{ height: '20px', textAlign: 'center', width: '33%', float: 'left', margin: '13px 0', borderLeft: 'solid 1px rgba(233, 233, 233, 1)', borderRight: 'solid 1px rgba(233, 233, 233, 1)', cursor: 'pointer' }} title="新增">
                                        <Icon type="plus" style={{ marginRight: '5px' }} />实时变量
                                </p>
                                </Link>
                                <Popover placement="bottom" title="选择分类" content={
                                    <div class="popover">
                                        <Link to="/business/variable/derivation/save-total" style={{ color: 'rgba(0,0,0,.65)' }}>
                                            <p>计算变量</p>
                                        </Link>
                                        <Link to="/business/variable/derivation/save-regular" style={{ color: 'rgba(0,0,0,.65)' }}>
                                            <p>正则变量</p>
                                        </Link>
                                        <Link to="/business/variable/derivation/save-func" style={{ color: 'rgba(0,0,0,.65)' }}>
                                            <p>函数变量</p>
                                        </Link>
                                    </div>
                                } trigger="click">

                                    <p style={{ height: '20px', textAlign: 'center', width: '33%', float: 'left', margin: '13px 0', cursor: 'pointer' }} title="新增">
                                        <Icon type="plus" style={{ marginRight: '5px' }} />衍生变量
                                </p>
                                </Popover>
                            </div>
                        </div>
                    </Col>
                    <Col md={24} lg={15} xl={12}>
                        <div style={{ height: '176px', backgroundColor: '#fff', marginRight: '15px' }}>
                            <CellBlock data={strategyInfo} />
                            <div style={{ backgroundColor: 'rgba(247, 249, 250, 1)', height: '48px', border: 'solid 1px rgba(233, 233, 233, 1)' }}>
                                <Link to="/business/strategy/definition/save/process" style={{ color: 'rgba(0,0,0,.65)' }}>
                                    <p style={{ height: '20px', textAlign: 'center', width: '25%', float: 'left', margin: '13px 0' }}>
                                        <Icon type="plus" style={{ marginRight: '5px' }} />流程策略
                                </p>
                                </Link>
                                <Link to="/business/strategy/definition/save/greedy" style={{ color: 'rgba(0,0,0,.65)' }}>
                                    <p style={{ height: '20px', textAlign: 'center', width: '25%', float: 'left', margin: '13px 0', borderLeft: 'solid 1px rgba(233, 233, 233, 1)', borderRight: 'solid 1px rgba(233, 233, 233, 1)' }}>
                                        <Icon type="plus" style={{ marginRight: '5px' }} />贪婪策略
                                </p>
                                </Link>
                                <Link to="/business/strategy/rule/save" style={{ color: 'rgba(0,0,0,.65)' }}>
                                    <p style={{ height: '20px', textAlign: 'center', width: '25%', float: 'left', margin: '13px 0', borderLeft: 'solid 1px rgba(233, 233, 233, 1)', borderRight: 'solid 1px rgba(233, 233, 233, 1)' }}>
                                        <Icon type="plus" style={{ marginRight: '5px' }} />规则
                                </p>
                                </Link>
                                <Popover placement="bottom" title="选择分类" content={
                                    <div class="popover">
                                        <Link to="/business/strategy/rule-set/save/1" style={{ color: 'rgba(0,0,0,.65)' }}>
                                            <p>全规则模式</p>
                                        </Link>
                                        <Link to="/business/strategy/rule-set/save/0" style={{ color: 'rgba(0,0,0,.65)' }}>
                                            <p>优先级模式</p>
                                        </Link>
                                    </div>
                                } trigger="click">
                                    <p style={{ height: '20px', textAlign: 'center', width: '25%', float: 'left', margin: '13px 0', cursor: 'pointer' }}>
                                        <Icon type="plus" style={{ marginRight: '5px' }} />规则集
                                </p>
                                </Popover>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <div style={{ backgroundColor: '#fff', marginRight: '15px', marginTop: '24px' }}>
                            <p style={{ height: '56px', lineHeight: '56px', fontSize: '16px', fontWeight: 'bold', paddingLeft: '24px', margin: '0' }}>策略列表</p>
                            {
                                strategyList.map((item, i) =>
                                    <Col md={8} lg={8} xl={6} style={{}} >
                                        <div style={{ height: '140px', border: 'solid 1px rgba(233, 233, 233, 1)', backgroundColor: '#fff' }}>
                                            <CellBlock data={item} />
                                        </div>
                                    </Col>
                                )
                            }
                        </div>

                    </Col>
                </Row>
            </div >
        )
    }
}

MainPanel.propTypes = {}
MainPanel.defaultProps = {}
export default MainPanel;