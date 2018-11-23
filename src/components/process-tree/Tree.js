import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';
import TreeCopy from '@/components/process-tree/Tree';
import AddSub from '@/components/process-tree/AddSub';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';

@inject('processTreeStore')
@withRouter
class ProcessTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentNodeId: ''
        }

        this.props.node.active ? this.style = { color: 'red' } : this.style = {};
        if (!common.isEmpty(this.props.match.params.type)) {
            if (this.props.match.params.type === 'greedy') {
                if (this.props.node.status != 4 && this.props.node.mold === 'ruleSet') {
                    this.style = { color: '#000', opacity: '0.45' }
                }
            }
        }
        this.activeFunc = this.activeFunc.bind(this);
        this.add = this.add.bind(this);
        this.sub = this.sub.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        console.log("nextProps",nextProps);
        nextProps.node.active ? this.style = { color: 'red' } : this.style = {};
        if (!common.isEmpty(this.props.match.params.type)) {
            if (this.props.match.params.type === 'greedy') {
                if (this.props.node.status != 4 && this.props.node.mold === 'ruleSet') {
                    this.style = { color: '#000', opacity: '0.45' }
                }
            }
        }
    }
    activeFunc = (newNodeKey, type, secondType, id, isGreedy) => {
        if (sessionStorage.isFinishNode && sessionStorage.isFinishNode === '0') {
            Modal.warning({
                title: '未完成提示',
                content: '当前节点还没完善数据，请完善数据并且保存后再切换节点！',
            });

            return
        }
        this.props.processTreeStore.changeActiveNode(newNodeKey);
        this.props.renderCallBack();
        this.props.changeEditType(type, secondType, id, isGreedy);
    }
    add = (newNodeKey, id) => {
        console.log(`${newNodeKey} ${id}`);
        if (sessionStorage.isFinishNode && sessionStorage.isFinishNode === '0') {
            Modal.warning({
                title: '未完成提示',
                content: '当前节点还没完善数据，请完善数据并且保存后再新增节点！',
            });

            return
        }
        this.setState({
            currentNodeId: id
        })
        this.props.add(newNodeKey, id);
    }
    sub = (subNodeKey, id) => {
        // alert(this.props.processTreeStore.processTreeActiveNodeKey)
        // alert(subNodeKey)
        if (sessionStorage.isFinishNode && sessionStorage.isFinishNode === '0') {
            if (subNodeKey != this.props.processTreeStore.processTreeActiveNodeKey) {
                Modal.warning({
                    title: '未完成提示',
                    content: '当前节点还没完善数据，请完善数据并且保存后再操操作节点！',
                });

                return
            } else {
                sessionStorage.removeItem("isFinishNode");
            }

        }
        console.log(id);
        this.props.sub(id);
    }
    render() {
        return (
            <li className="node">
                {
                    this.props.nodeKey === 0 ? '' : this.props.nodeKey == '0-0' ? <div style={{ height: '21px', float: 'left', borderLeft: '1px dashed gray', marginTop: '-10px' }}></div> : <div style={{ height: '22px', float: 'left', borderLeft: '1px dashed gray', marginTop: '-11px' }}></div>
                }
                {
                    this.props.nodeKey !== 0 ? <p style={{ width: 'fit-content', float: 'left', marginBottom: 0 }}>--</p> : ''
                }
                <div className="node-bus" style={{ marginLeft: this.props.nodeKey === 0 ? '11px' : 0 }}>

                    <div className="node-body" style={this.style} onClick={() => this.activeFunc(this.props.nodeKey, this.props.node.type, this.props.node.secondType, this.props.node.id, this.props.node.mold && this.props.node.mold == 'ruleSet' ? true : false)} >
                        {(() => {
                            if (this.props.node.mold && this.props.node.mold === 'ruleSet') {
                                return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                            } else {
                                switch (this.props.node.type) {
                                    case -1:
                                        return <Icon type="folder-open" style={{ marginRight: '5px' }} />;
                                        break;
                                    case 0:
                                        return <Icon type="dashboard" style={{ marginRight: '5px' }} />;
                                        break;
                                    case 1:
                                        if (this.props.node.secondType === 2) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 4) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 3) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 0) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        } else if (this.props.node.secondType === 1) {
                                            return <Icon type="caret-right" style={{ marginRight: '5px' }} />;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        })()
                        }
                        <span title={this.props.node.name} className="node-name">{this.props.node.name}</span>
                    </div>
                    {(() => {
                        let nodeKey = String(this.props.nodeKey);
                        let keyArray;
                        let maxLength;
                        nodeKey === '0' ? (() => {
                            keyArray = '0';
                            maxLength = 0;
                            if (sessionStorage.processTreeMaxLength) {
                                if (Number(sessionStorage.processTreeMaxLength) < maxLength) {
                                    sessionStorage.processTreeMaxLength = maxLength;
                                }
                            } else {
                                sessionStorage.processTreeMaxLength = maxLength;
                            }
                        })()
                            :
                            (() => {
                                keyArray = nodeKey.split('·-·');
                                maxLength = keyArray.length;
                                if (sessionStorage.processTreeMaxLength) {
                                    if (Number(sessionStorage.processTreeMaxLength) < maxLength) {
                                        sessionStorage.processTreeMaxLength = maxLength;
                                    }
                                } else {
                                    sessionStorage.processTreeMaxLength = maxLength;
                                }
                            })()
                        if (this.props.node.mold && this.props.node.mold === 'ruleSet') {
                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                        } else {
                            if (this.props.isEdit) {
                                switch (this.props.node.type) {
                                    case -1:
                                        return <AddSub type="add" add={() => this.add(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        break;
                                    case 0:
                                        if (keyArray.length < 8)
                                            return <AddSub type="add-sub" add={() => this.add(this.props.nodeKey, this.props.node.id)} sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        else {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        break;
                                    case 1:
                                        if (this.props.node.secondType === 2) {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        if (this.props.node.secondType === 3) {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        if (this.props.node.secondType === 0) {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        if (this.props.node.secondType === 1) {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        if (this.props.node.secondType === 4) {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        if (this.props.node.mold === 'ruleSet') {
                                            return <AddSub type="sub" sub={() => this.sub(this.props.nodeKey, this.props.node.id)}></AddSub>
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }

                    })()}

                </div>

                {
                    this.props.node.nodes ?
                        <ul className="node-panel">
                            {this.props.node.nodes.map((item, i) =>
                                <TreeCopy isEdit={this.props.isEdit} changeEditType={this.props.changeEditType} add={this.props.add} sub={this.props.sub} renderCallBack={this.props.renderCallBack} node={item} nodeKey={this.props.nodeKey + '·-·' + i} typeKey={this.props.typeKey + '·-·' + item.type}></TreeCopy>
                            )}
                        </ul> : ''
                }
            </li>
        )
    }
}

export default ProcessTree;