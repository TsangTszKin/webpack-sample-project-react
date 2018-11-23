import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/rule/Save';
import PageHeader from '@/components/PageHeader';
import FormHeader from '@/components/FormHeader';
import '@/styles/business/variable/real-time-query-edit.less';
import ProcessTreePanel from '@/components/process-tree/ProcessTreePanel';
import $ from 'jquery';
import Info from '@/components/business/strategy/rule/edit/Info';
import Control from '@/components/business/node/Control';
import Query from '@/components/business/node/Query';
import Assign from '@/components/business/node/Assign';
import OutPut from '@/components/business/node/OutPut';
import { withRouter } from 'react-router-dom';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import { message, Row, Col, Spin, Drawer } from 'antd';
import PropTypes from 'prop-types';
import common from '@/utils/common';
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
            isLoading: false,
            sqlMode: false
        }
        this.changeEditType = this.changeEditType.bind(this);
        this.getRuleById = this.getRuleById.bind(this);
        this.reRender = this.reRender.bind(this);
        this.addNode = this.addNode.bind(this);
        this.updateCurrentActiveNode = this.updateCurrentActiveNode.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
        this.autoAdjustHeight = this.autoAdjustHeight.bind(this);
    }
    changeEditType = (type, secondType, nodeId) => {
        let editType = '';
        if (type === -1) {
            editType = 'info';
        } else if (type === 0) {
            editType = 'control';
        } else if (type === 1) {

            if (secondType === 2) {
                editType = 'query';
            } else if (secondType === 4) {
                editType = 'assign';
            } else if (secondType === 3) {
                editType = 'output';
            }
        }
        this.setState({
            editType: editType,
            nodeId: nodeId
        })
    }

    componentWillMount() {
        if (sessionStorage.processTreeMaxLength) {
            sessionStorage.removeItem("processTreeMaxLength");
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getRuleById(this.props.match.params.id);
            sessionStorage.removeItem('isFinishNode');
        }
        store.setIsCanCommit(false);
        // store.setEditType('info');
        // store.setSqlMode(false);
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
        common.loading.show();
        variableService.deleteNode(id).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("删除成功");
            this.setState({
                activeNodeKey: 0
            })
            this.getRuleById(this.props.match.params.id);
        }).catch(res => {
            common.loading.hide();
        });
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


    getRuleById(id, activeKey, editType, name) {
        this.setState({
            isLoading: true
        })
        strategyService.getRuleById(id).then(res => {
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
            console.log(rootNode);
            this.setState({
                currentName: res.data.result.name,
                processTreeData: rootNode,
                script: res.data.result.script,
                isLoading: false
            })
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
        })
    }

    addNode(type, parentId, ruleId, name, firstType, secondType, activeKey) {
        function adjustLeftWidth() {
            var panelWidth = $('#edit-panel').width();
            var panelLeftWidth = $("#panel-left").width();
            var panelRightWidth = panelWidth - panelLeftWidth;
            $("#panel-right").width(panelRightWidth - 20 + 'px');
            // $("#panel-left").width(panelLeftWidth + 37 + 'px');
        }
        console.log("addNode params = ", type, parentId, ruleId, name, firstType, secondType, activeKey);
        // return
        if (isNaN(activeKey) && activeKey.split('·-·').length == 2 && activeKey.split('·-·')[0] == '0') {
            parentId = null;
        }
        if (type === 'control') {
            common.loading.show();
            variableService.saveControlNode({ parentId: parentId, name: name, ruleId: ruleId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                    adjustLeftWidth();
                }
                this.getRuleById(this.props.match.params.id, activeKey, type, name);
                this.setState({ nodeId: res.data.result.id });
                sessionStorage.isFinishNode = '0';


            }).catch(res => {
                common.loading.hide();
            });
        }
        if (type === 'query') {
            common.loading.show();
            variableService.saveQueryNode({ parentId: parentId, name: name, ruleId: ruleId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                    adjustLeftWidth();
                }
                this.getRuleById(this.props.match.params.id, activeKey, type, name);
                this.setState({ nodeId: res.data.result.id });
                sessionStorage.newNodeId = res.data.result.id;
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }
        if (type === 'output') {
            common.loading.show();
            strategyService.saveOutPutNode({ parentId: parentId, name: name, ruleId: ruleId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                    adjustLeftWidth();
                }
                this.getRuleById(this.props.match.params.id, activeKey, type, name);
                this.setState({ nodeId: res.data.result.id });
                sessionStorage.newNodeId = res.data.result.id;
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }
        if (type === 'assign') {
            common.loading.show();
            strategyService.saveOutPutNode({ parentId: parentId, name: name, ruleId: ruleId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                    adjustLeftWidth();
                }
                this.getRuleById(this.props.match.params.id, activeKey, type, name);
                this.setState({ nodeId: res.data.result.id });
                sessionStorage.newNodeId = res.data.result.id;
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }

    }

    reRender() {
        this.getRuleById(this.getRuleById(this.props.match.params.id));
    }


    render() {

        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta} isShowBtns={common.isEmpty(this.state.script)}></PageHeader>
                    <div style={{ height: '100%' }} id="edit-panel">
                        <Spin spinning={this.state.isLoading} size="large">
                            <Row>
                                <Col span={this.state.sqlMode ? 0 : this.props.match.params.id ? 6 : 0} id="panel-left">
                                    <div className="pageContent" style={{ height: '100%' }}>
                                        <FormHeader title="规则定义" style={{ marginBottom: '10px' }}></FormHeader>
                                        <ProcessTreePanel saveType={this.props.meta.saveType} deleteNode={this.deleteNode} activeNodeKey={this.state.activeNodeKey} addNode={this.addNode} processTreeData={this.state.processTreeData} changeEditType={this.changeEditType} currentName={this.state.currentName} ></ProcessTreePanel>
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
                                                    return <Control type="rule" id={this.props.match.params.id} nodeId={this.state.nodeId} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                                case 'query':
                                                    return <Query type="rule" id={this.props.match.params.id} nodeId={this.state.nodeId} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                                case 'assign':
                                                    return <Assign type="rule" id={this.props.match.params.id} nodeId={this.state.nodeId} reRender={this.reRender} currentName={this.state.currentName} />
                                                    break;
                                                case 'output':
                                                    return <OutPut id={this.props.match.params.id} nodeId={this.state.nodeId} reRender={this.reRender} currentName={this.state.currentName} />
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
export default Save;