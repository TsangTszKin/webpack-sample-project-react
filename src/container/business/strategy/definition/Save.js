import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/strategy/Save';
import PageHeader from '@/components/PageHeader';
import FormHeader from '@/components/FormHeader';
import '@/styles/business/variable/real-time-query-edit.less';
import ProcessTreePanel from '@/components/process-tree/ProcessTreePanel';
import $ from 'jquery';
import Info from '@/components/business/strategy/definition/edit/Info';
import Rule from '@/components/business/node/Rule';
import Control from '@/components/business/node/Control';
import Query from '@/components/business/node/Query';
import Assign from '@/components/business/node/Assign';
import RulesetForProcess from '@/components/business/node/RulesetForProcess';
import RulesetForGreedy from '@/components/business/node/RulesetForGreedy';
import { withRouter } from 'react-router-dom';
import variableService from '@/api/business/variableService';
import { message, Row, Col, Spin, Drawer } from 'antd';
import PropTypes from 'prop-types';
import common from '@/utils/common';
import strategyService from '@/api/business/strategyService';
import publicUtils from '@/utils/publicUtils';
import Code from '@/components/Code';


let timer = 0;

@withRouter
@observer
class Save extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editType: 'info',
            currentName: '',
            nodeId: '',
            processTreeData: {},
            activeNodeKey: 0,
            script: '',
            isAlreadyAdjustHeight: false,
            ruleSetList: [],
            category: '',
            type: '',
            isLoading: false,
            sqlMode: false
        }
        this.changeEditType = this.changeEditType.bind(this);
        this.getStrategyById = this.getStrategyById.bind(this);
        this.reRender = this.reRender.bind(this);
        this.addNode = this.addNode.bind(this);
        this.updateCurrentActiveNode = this.updateCurrentActiveNode.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
        this.autoAdjustHeight = this.autoAdjustHeight.bind(this);
        this.getInitData = this.getInitData.bind(this);
    }
    changeEditType = (type, secondType, nodeId, isGreedy) => {
        console.log("changeEditType  =", type, secondType, nodeId);
        let editType = '';
        if (isGreedy) {
            editType = 'greedy-ruleSet';
        } else {
            if (type === -1) {
                editType = 'info';
            } else if (type === 0) {
                editType = 'control';
            } else if (type === 1) {
                if (secondType === 2) {
                    editType = 'query';
                } else if (secondType === 4) {
                    editType = 'assign';
                } else if (secondType === 0) {
                    editType = 'rule';
                } else if (secondType === 1) {
                    editType = 'ruleSet';
                }
            }
        }

        if (!common.isEmpty(nodeId)) {
            this.setState({
                editType: editType,
                nodeId: nodeId
            })
        } else {
            this.setState({
                editType: editType
            })
        }


    }

    getInitData(category, type) {
        strategyService.getRuleSetListByDimensionForRuleNode(sessionStorage.eventSourceId, sessionStorage.dimensionId, category, type).then(res => {
            if (!publicUtils.isOk(res)) return
            if (res.data.result) {
                let tempArray = [];
                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.id,
                        value: element.name
                    });
                })
                this.setState({
                    ruleSetList: tempArray
                })


            }
        })
    }

    componentWillMount() {
        if (sessionStorage.processTreeMaxLength) {
            sessionStorage.removeItem("processTreeMaxLength");
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            sessionStorage.removeItem('isFinishNode');
            this.getStrategyById(this.props.match.params.id);
        }
        store.setIsCanCommit(false);
    }

    componentWillUnmount() {
        window.clearInterval(timer);
        if (sessionStorage.processTreeMaxLength) {
            sessionStorage.removeItem("processTreeMaxLength");
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    deleteNode(id) {
        if (this.props.match.params.type === 'greedy') {
            common.loading.show();
            variableService.deleteRuleSetNOdeForGreedy(id, this.props.match.params.id).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                message.success("删除成功");
                this.setState({
                    activeNodeKey: 0
                })
                this.getStrategyById(this.props.match.params.id);
            }).catch(res => {
                common.loading.hide();
            });
        } else {
            common.loading.show();
            variableService.deleteNode(id).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                message.success("删除成功");
                this.setState({
                    activeNodeKey: 0
                })
                this.getStrategyById(this.props.match.params.id);
            }).catch(res => {
                common.loading.hide();
            });
        }
    }

    updateCurrentActiveNode = (value, editType, name) => {
        console.log('更新activeNode  = ' + value);
        this.setState({
            activeNodeKey: value,
            editType: editType,
            currentName: name,
        })
    }

    autoAdjustHeight() {
        let leftPageContentHeight = $("#panel-left .pageContent").height();
        let rightPageContentHeight = $("#panel-right .pageContent").height();
        if (leftPageContentHeight != rightPageContentHeight) {
            if (leftPageContentHeight > rightPageContentHeight) {
                $("#panel-right .pageContent").height(leftPageContentHeight)
            } else {
                $("#panel-left .pageContent").height(rightPageContentHeight)
            }
        }
    }


    getStrategyById(id, activeKey, editType, name) {
        this.setState({
            isLoading: true
        })
        strategyService.getStrategyById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let rootNode = {
                type: -1,
                active: true,
                name: res.data.result.name,
                nodes: res.data.result.treeNode,
                id: res.data.result.id
            }
            sessionStorage.rootProcessTreeName = res.data.result.name;
            sessionStorage.rootProcessTreeCode = res.data.result.code;
            sessionStorage.dimensionId = res.data.result.dimensionId;
            sessionStorage.eventSourceId = res.data.result.eventSourceId;
            console.log("rootNode  = ", rootNode);
            if (typeof res.data.result !== 'string') {
                this.setState({
                    currentName: res.data.result.name,
                    processTreeData: rootNode,
                    script: res.data.result.script
                })
            }

            this.autoAdjustHeight();
            if (activeKey) this.updateCurrentActiveNode(activeKey, editType, name);

            if (!this.state.isAlreadyAdjustHeight) {
                this.setState({
                    isAlreadyAdjustHeight: !this.state.isAlreadyAdjustHeight
                })
            }

            if (res.data.result.script) {
                this.setState({
                    sqlMode: true
                })
            } else {
                let self = this;
                timer = setInterval(function () {
                    self.autoAdjustHeight();
                }, 100)
            }

            this.getInitData(res.data.result.category, res.data.result.type);
            this.setState({
                category: res.data.result.category,
                type: res.data.result.type,
                isLoading: false
            })
        })
    }

    addNode(type, parentId, strategyId, name, firstType, secondType, activeKey) {

        console.log("addNode params = ", type, parentId, strategyId, name, firstType, secondType, activeKey);
        if (isNaN(activeKey) && activeKey.split('·-·').length == 2 && activeKey.split('·-·')[0] == '0') {
            parentId = null;
        }
        if (type === 'control') {
            common.loading.show();
            variableService.saveControlNode({ parentId: parentId, name: name, strategyId: strategyId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                }
                this.getStrategyById(this.props.match.params.id, activeKey, type, name);
                this.setState({ nodeId: res.data.result.id });
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }
        if (type === 'query') {
            common.loading.show();
            variableService.saveQueryNode({ parentId: parentId, name: name, strategyId: strategyId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                }
                this.getStrategyById(this.props.match.params.id, activeKey, type, name);
                this.setState({ nodeId: res.data.result.id });
                sessionStorage.newNodeId = res.data.result.id;
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }
        if (type === 'rule') {
            common.loading.show();
            variableService.saveRuleNode({ parentId: parentId, name: name, strategyId: strategyId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                }
                this.getStrategyById(this.props.match.params.id, activeKey, type, name);
                this.setState({ nodeId: res.data.result.id });
                sessionStorage.newNodeId = res.data.result.id;
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }
        if (type === 'ruleSet') {
            common.loading.show();
            variableService.saveRuleSetNode({ parentId: parentId, name: name, strategyId: strategyId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                }
                this.getStrategyById(this.props.match.params.id, activeKey, type, name);
                this.setState({ nodeId: res.data.result.id });
                sessionStorage.newNodeId = res.data.result.id;
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }
        if (type === 'greedy-ruleSet') {
            common.loading.show();
            variableService.saveRuleSetNodeForGreedy(secondType, strategyId).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                }
                this.getStrategyById(this.props.match.params.id, activeKey, type, name);
                this.setState({ nodeId: sessionStorage.ruleSetIdForGreedy });
                sessionStorage.newNodeId = sessionStorage.ruleSetIdForGreedy;
                // sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }
        if (type === 'assign') {
            common.loading.show();
            strategyService.saveOutPutNode({ parentId: parentId, name: name, strategyId: strategyId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                }
                this.getStrategyById(this.props.match.params.id, activeKey, type, name);
                this.setState({ nodeId: res.data.result.id });
                sessionStorage.newNodeId = res.data.result.id;
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }


    }

    reRender() {
        this.getStrategyById(this.props.match.params.id)
    }

    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta} isShowBtns={common.isEmpty(this.state.script) && this.props.match.params.type === 'process'}></PageHeader>
                    <div style={{ height: '100%' }} id="edit-panel">
                        <Spin spinning={this.state.isLoading} size="large">

                            <Row>
                                <Col span={this.state.sqlMode ? 0 : this.props.match.params.id ? 6 : 0} id="panel-left">
                                    <div className="pageContent" style={{ height: '100%' }}>
                                        <FormHeader title="策略定义" style={{ marginBottom: '10px' }}></FormHeader>
                                        <ProcessTreePanel category={this.state.category} type={this.state.type} saveType={this.props.meta.saveType} deleteNode={this.deleteNode} activeNodeKey={this.state.activeNodeKey} addNode={this.addNode} processTreeData={this.state.processTreeData} changeEditType={this.changeEditType} currentName={this.state.currentName} ></ProcessTreePanel>
                                    </div>
                                </Col>
                                <Col span={this.state.sqlMode ? 24 : this.props.match.params.id ? 18 : 24} id="panel-right">
                                    {
                                        (() => {
                                            switch (this.state.editType) {
                                                case 'info':
                                                    return <Info script={this.state.script} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                                case 'control':
                                                    return <Control type="strategy" id={this.props.match.params.id} nodeId={this.state.nodeId} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                                case 'query':
                                                    return <Query type="strategy" id={this.props.match.params.id} nodeId={this.state.nodeId} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                                case 'assign':
                                                    return <Assign type="strategy" id={this.props.match.params.id} nodeId={this.state.nodeId} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                                case 'rule':
                                                    return <Rule id={this.props.match.params.id} nodeId={this.state.nodeId} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                                case 'ruleSet':
                                                    return <RulesetForProcess id={this.props.match.params.id} nodeId={this.state.nodeId} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                                case 'greedy-ruleSet':
                                                    return <RulesetForGreedy id={this.props.match.params.id} nodeId={this.state.nodeId} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                                default:
                                                    return <Info script={this.state.script} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                            }
                                        })()
                                    }
                                </Col>
                            </Row>
                        </Spin>
                    </div>

                    <Drawer
                        title="总览"
                        placement="right"
                        closable={false}
                        onClose={() => { store.setIsShowDrawerForSql(false) }}
                        visible={store.getIsShowDrawerForSql}
                        width="720"
                    >
                        <Code sqlCode={store.getSqlPreview} type={1} />
                    </Drawer>
                </div>
            </Provider >
        )
    }
}
Save.propTypes = {
    changeCollapsed: PropTypes.func,
    collapsed: PropTypes.bool
}
Save.defaultProps = {
    changeCollapsed: () => { },
    collapsed: false
}
export default Save