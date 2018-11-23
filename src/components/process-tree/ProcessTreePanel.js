import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProcessTree from '@/components/process-tree/Tree';
import '@/styles/processTree.less';
import { Provider } from 'mobx-react';
import ProcessTreeStore from '@/store/ProcessTreeStore';
import { Modal, Form, message } from 'antd';
import AddNodeFormForRtq from '@/components/process-tree/AddNodeFormForRtq';
import AddNodeFormForRule from '@/components/process-tree/AddNodeFormForRule';
import AddNodeFormForDefinition from '@/components/process-tree/AddNodeFormForDefinition';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';

// const treeJson = {
//     name: '消费满188的笔数',
//     type: 'root',
//     active: true,
//     nodes: [{
//         name: '实时触发进度提醒短信',
//         type: 'control',
//         active: false,
//         nodes: [{
//             name: '必须为活动卡且交易金额的..',
//             type: 'query',
//             active: false
//         }, {
//             name: '距发卡日日期小于30天',
//             type: 'control',
//             active: false,
//             nodes: [{ name: '触发进度短信B1', type: 'assign', active: false },
//             { name: '触发进度短信B2', type: 'assign', active: false },
//             { name: '触发进度短信B3', type: 'assign', active: false }]
//         }, {
//             name: '距发卡日日期在30到50间',
//             type: 'control',
//             active: false,
//             nodes: [{ name: '触发进度短信C1', type: 'assign', active: false },
//             { name: '触发进度短信C2', type: 'assign', active: false },
//             { name: '触发进度短信C3', type: 'assign', active: false }]
//         }],
//     }, {
//         name: '实时触发进度提醒短信',
//         type: 'control',
//         active: false,
//         nodes: [{ name: '必须为活动卡且交易金额必须为活动卡且交易金额必须为活动卡且交易金额必须为活动卡且交易金额...', type: 'assign', active: false }],
//     }, {
//         name: '批量自动发送催激活短信',
//         type: 'control',
//         active: false,
//         nodes: [{ name: '黑名单过滤', type: 'assign', active: false }, { name: '触发待激活短信', type: 'assign', active: false }],
//     }]
// }
const FormItem = Form.Item;

@Form.create()
@withRouter
class ProcessTreePanel extends Component {
    constructor(props) {
        super(props);
        this.processTreeStore = new ProcessTreeStore();
        // let treeJsonTemp = {
        //     name: '',
        //     type: 'root',
        //     active: true,
        //     nodes: [
        //     ]
        // };
        // treeJsonTemp.name = this.props.currentName;
        this.processTreeStore.updateProcessTreeJson(this.props.processTreeData);

        this.state = {
            updateIndex: 0,
            visibleForAdd: false,
            visibleForSub: false,
            nodeKey: 0,
            updateIndex: 0,
            parentId: '',
            deleteId: ''
        }
        this.renderCallBack = this.renderCallBack.bind(this);
        this.modalHandlerForAdd = this.modalHandlerForAdd.bind(this);
        this.modalHandleOkForAdd = this.modalHandleOkForAdd.bind(this);
    }

    componentDidMount() {
        this.props.form.validateFields();
        console.log("processTreeData  = ", this.props.processTreeData);
    }

    componentWillReceiveProps(nextProps) {
        console.log("nextProps.processTreeData   =   ", nextProps.processTreeData);
        if (nextProps.processTreeData !== this.props.processTreeData) {
            this.processTreeStore.updateProcessTreeJson(nextProps.processTreeData);
            this.processTreeStore.changeActiveNode(nextProps.activeNodeKey);
        }
        if (nextProps.activeNodeKey !== this.props.activeNodeKey) {
            let self = this;
            self.processTreeStore.changeActiveNode(nextProps.activeNodeKey);
            setTimeout(() => {
                // self.processTreeStore.changeActiveNode(nextProps.activeNodeKey);
            }, 500)
        }
    }

    modalHandleOkForAdd = (e) => {
        this.refs.getFormValue.validateFields((err, values) => {
            console.log("modalHandleOkForAdd nodeKey = ", this.state.nodeKey);
            if (!err) {
                console.log("这里可以拿到数据", values);//这里可以拿到数据
                if (!common.isEmpty(values.form1)) {
                    if (values.form1.length > 30) {
                        message.warning("请输入30个字符以内节点名称");
                        return
                    }
                }
                values.form1 = common.stripscript(values.form1);
                this.modalHandlerForAdd();
                let type = Number(values.form2);
                let secondType = Number(values.form3);
                if (!secondType) {
                    secondType = 0;
                }
                // this.processTreeStore.addNode(values.form1, type, secondType, this.state.nodeKey);
                let activeKey;
                if (this.state.nodeKey == '0') {
                    let length = this.processTreeStore.processTreeJson.nodes.length;
                    // alert('0-' + length);
                    activeKey = '0-' + length;
                } else {
                    let keyArray = this.state.nodeKey.split('·-·');
                    console.log("before add new node keyArray  = ", keyArray);
                    let length;
                    switch (keyArray.length) {
                        case 2:
                            if (this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes) {
                                length = this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes.length;
                            } else {
                                length = 0;
                            }
                            break;
                        case 3:
                            if (this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes) {
                                length = this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes.length;
                            } else {
                                length = 0;
                            }
                            break;
                        case 4:
                            if (this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes) {
                                length = this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes.length;
                            } else {
                                length = 0;
                            }
                            break;
                        case 5:
                            if (this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes) {
                                length = this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes.length;
                            } else {
                                length = 0;
                            }

                            break;
                        case 6:
                            if (this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes) {
                                length = this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes.length;
                            } else {
                                length = 0;
                            }
                            break;
                        case 7:
                            if (this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes) {
                                length = this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes.length;
                            } else {
                                length = 0;
                            }

                            break;
                        case 8:
                            if (this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes) {
                                length = this.processTreeStore.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes.length;
                            } else {
                                length = 0;
                            }

                            break;
                        default:
                            break;
                    }
                    activeKey = this.state.nodeKey + '·-·' + length;
                    console.log("after add new node keyArray  = ", activeKey);
                }
                // this.processTreeStore.changeActiveNode(activeKey);

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
                    } else if (secondType === 0) {
                        editType = 'rule';
                    } else if (secondType === 1) {
                        editType = 'ruleSet';
                    }
                }

                if (values.form1 === 'greedy') {
                    editType = 'greedy-ruleSet';
                    secondType = values.form3;
                    sessionStorage.ruleSetIdForGreedy = values.form3;
                    this.props.changeEditType(null, null, null, true);
                } else {
                    this.props.changeEditType(type, secondType);
                }
                this.props.addNode(editType, this.state.nodeKey == 0 ? null : this.state.parentId, this.props.match.params.id, values.form1, type, secondType, activeKey)
                this.renderCallBack();
            } else {
                console.log(err);
                return err;
            }
        });

    }

    modalHandlerForAdd = (nodeKey, id) => {
        // console.log("modalHandlerForAdd nodeKey =  但是if (nodeKey)不进去", nodeKey);
        this.setState({
            visibleForAdd: !this.state.visibleForAdd,
            parentId: id
        });
        if (nodeKey || nodeKey == 0) {
            console.log("modalHandlerForAdd nodeKey =", nodeKey);
            this.setState({ nodeKey: nodeKey });
        }
    }

    modalHandleOkForSub = (e) => {
        this.processTreeStore.changeActiveNode('0');
        // this.processTreeStore.subNode(this.state.nodeKey);
        this.modalHandlerForSub();
        // this.renderCallBack();
        this.props.changeEditType(-1, '');
        this.props.deleteNode(this.state.deleteId);

        // console.log(this.processTreeStore.processTreeJson);
    }

    modalHandlerForSub = (id) => {
        this.setState({
            visibleForSub: !this.state.visibleForSub,
            deleteId: id
        });
        // if (nodeKey) {
        //     console.log(nodeKey);
        //     this.setState({ nodeKey: nodeKey });
        // }
    }

    renderCallBack = () => {
        this.setState({
            updateIndex: this.state.updateIndex++
        });
        // console.log(this.processTreeStore.processTreeJson.active);
        this.treeJson = this.processTreeStore.processTreeJson;
        // console.log(this.treeJson);
    }

    render() {
        return (
            <Provider processTreeStore={this.processTreeStore}>
                <div style={{ marginLeft: '-23px', overflowX: 'auto', paddingBottom: '100px' }}>
                    <ul className="node-panel">
                        <ProcessTree isEdit={this.props.isEdit} deleteNode={this.props.deleteNode} changeEditType={this.props.changeEditType} add={this.modalHandlerForAdd} sub={this.modalHandlerForSub} renderCallBack={this.renderCallBack} node={this.processTreeStore.processTreeJson} nodeKey={0} typeKey={this.processTreeStore.processTreeJson.type}></ProcessTree>
                    </ul>
                    <Modal
                        name="新建节点"
                        visible={this.state.visibleForAdd}
                        onOk={this.modalHandleOkForAdd}
                        onCancel={() => this.modalHandlerForAdd()}
                        width={this.props.saveType === 'definition' ? '500px' : '400px'}
                        keyboard
                        destroyOnClose={true}
                    >
                        {
                            (() => {
                                switch (this.props.saveType) {
                                    case 'real-time-query':
                                        return <AddNodeFormForRtq ref="getFormValue"></AddNodeFormForRtq>
                                    case 'rule':
                                        return <AddNodeFormForRule ref="getFormValue"></AddNodeFormForRule>
                                    case 'definition':
                                        return <AddNodeFormForDefinition category={this.props.category} type={this.props.type} ref="getFormValue"></AddNodeFormForDefinition>
                                    default: return ''
                                }
                            })()
                        }


                    </Modal>

                    <Modal
                        name="删除"
                        visible={this.state.visibleForSub}
                        onOk={this.modalHandleOkForSub}
                        onCancel={() => this.modalHandlerForSub()}
                        width="400px"
                        keyboard
                        destroyOnClose={true}
                    >
                        <p>是否删除节点及子节点全部内容？</p>

                    </Modal>

                </div>

            </Provider>
        )
    }
}
const style = {
    formItem: {
        height: '32px'
    },
    formName: {
        width: 'fit-content',
        float: 'left',
        height: '32px',
        lineHeight: '32px',
    },
    formEntity: {
        float: 'left',
        width: '300px'
    }
}
// const ProcessTreePanel2 = Form.create()(ProcessTreePanel);
ProcessTreePanel.propTypes = {
    isEdit: PropTypes.bool
}
ProcessTreePanel.defaultProps = {
    isEdit: true
}
export default ProcessTreePanel;