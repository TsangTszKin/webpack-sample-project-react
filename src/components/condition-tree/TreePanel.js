import React, { Component } from 'react';
import { inject, Provider } from 'mobx-react'
import { toJS } from 'mobx';
import { message } from 'antd';
import "@/styles/treePanel.less"
import Test from '@/components/Test';
import Tree from '@/components/condition-tree/Tree';
import ConditionTreeStore from '@/store/ConditionTreeStore';
import PropTypes from 'prop-types';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import publicUtils from '@/utils/publicUtils';

@withRouter
class TreePanel extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.add = this.add.bind(this);
        this.sub = this.sub.bind(this);
        this.updateTreeJsonCallBack = this.updateTreeJsonCallBack.bind(this);
        this.getExpressionVarTypeList = this.getExpressionVarTypeList.bind(this);
        this.getExpressionValueTypeList = this.getExpressionValueTypeList.bind(this);
        this.getAllVarList = this.getAllVarList.bind(this);
        this.verifyConditionTreeFinish = this.verifyConditionTreeFinish.bind(this);
        this.getOptTypeList = this.getOptTypeList.bind(this);
        this.conditionTreeStore = new ConditionTreeStore();
        this.state = {
            treeJson: this.props.treeData.conditions,
            cascadeData: [],
            varTypeList: [],
            valueTypeList: [],
            varTypeOfField: '',
            optTypeList: []
        }
        this.conditionTreeStore.updateConditionTreeJson(this.props.treeData.conditions);
        this.setState({
            treeJson: this.props.treeData.conditions
        })
    }



    componentWillReceiveProps(nextProps) {
        // if (nextProps.treeData != this.props.treeData) {
        //     this.conditionTreeStore.updateConditionTreeJson(nextProps.treeData.conditions);
        //     this.setState({
        //         treeJson: nextProps.treeData.conditions
        //     })
        // }
        // console.log("TreePanel  nextProps.treeData  ", nextProps.treeData);
        this.conditionTreeStore.updateConditionTreeJson(nextProps.treeData.conditions);
        this.setState({
            treeJson: nextProps.treeData.conditions
        })
        if (nextProps.fieldList !== this.props.fieldList) {
            this.getExpressionVarTypeList();
        }
        if (nextProps.allVarListTypeForm === 'ext' && nextProps.extRealdy) {
            this.getAllVarList("", nextProps.allVarListTypeForm);
        }

    }

    componentWillMount() {
        if (this.props.allVarListTypeForm !== 'ext')
            this.getAllVarList(this.props.match.params.id);
        this.getExpressionVarTypeList();
        this.getExpressionValueTypeList();
        this.getOptTypeList();
    }


    updateTreeJsonCallBack = () => {
        console.log('~~~~~~~ updateTreeJsonCallBack ~~~~~~~~~~', this.conditionTreeStore.conditionTreeJson);
        // console.log(this.props);
        // console.log(this.state.treeJson);
        this.props.treeDataCallBack(this.conditionTreeStore.conditionTreeJson);
        this.setState({
            treeJson: this.conditionTreeStore.conditionTreeJson
        })
    }

    getExpressionVarTypeList() {
        variableService.getEnumList("expressionVarType").then(res => {
            if (!publicUtils.isOk(res)) return
            res.data.result.forEach(element => {
                if (element.mode === 'columnField') {
                    this.setState({
                        varTypeOfField: element.val
                    })
                    return
                }
            })
        });
    }

    getExpressionValueTypeList() {
        variableService.getExpressionValueTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [{
                code: 'var',
                value: '变量'
            }];
            res.data.result.forEach(element => {
                if (element.mode === 'value') {
                    tempArray.push({
                        code: element.val,
                        value: element.label
                    });
                }
                if (element.mode === 'fun') {
                    tempArray.push({
                        code: element.val,
                        value: element.label
                    });
                }
            })
            this.setState({
                valueTypeList: tempArray
            })
        });
    }

    getAllVarList(id) {
        variableService.getAllVarList(id, this.props.allVarListTypeForm).then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            let tempArray2 = [];
            res.data.result.forEach(element => {
                let temp = {
                    value: String(element.type),
                    label: element.name,
                    children: []
                }
                element.list.forEach(element2 => {
                    temp.children.push({
                        value: element2.code + '·-·' + element2.type,
                        label: element2.name
                    });
                })
                tempArray.push(temp);
                if (element.type === 5) {

                    element.list.forEach(element2 => {
                        tempArray2.push({
                            code: element2.code + '·-·' + element2.name,
                            value: element2.name
                        })
                    })
                }
            })
            this.setState({
                cascadeData: tempArray
            })
            this.props.initTempVarListCallBack(tempArray2);
            console.log('级联选择数据')
            console.log(this.state.cascadeData);
        })
    }

    /**
      * 删除操作回调
      */
    sub = (nodeKey) => {
        console.log("sub nodeKey", nodeKey);
        this.conditionTreeStore.subNode(nodeKey);
        this.updateTreeJsonCallBack();
    }

    /**
     * 增加操作回调
     */
    add = (nodeKey, type, expressionVO, isBranch) => {
        console.log(`${nodeKey}  ${type}  ${expressionVO}`);
        this.conditionTreeStore.addNode(nodeKey, type, expressionVO, isBranch);
        this.updateTreeJsonCallBack();
    }


    getOptTypeList() {
        variableService.getOptTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                tempArray.push({
                    code: element.val,
                    value: element.label
                });
            });
            this.setState({
                optTypeList: tempArray
            })
        })
    }

    verifyConditionTreeFinish() {
        console.log(this.conditionTreeStore.conditionTreeJson);
        let treeJson = this.conditionTreeStore.conditionTreeJson;
        for (let i = 0; i < treeJson.length; i++) {
            var element = treeJson[i];
            if (element.nodeType == 1) {
                if ((!element.expressionVO.varCode && element.expressionVO.varCode !== 0) || (!element.expressionVO.varCode && element.expressionVO.varCode !== 0)) {
                    console.log("请选择完全您的条件变量" + i);
                    return false
                }
                if (!element.expressionVO.optType && element.expressionVO.optType !== 0) {
                    console.log("请选择完全您的变量关系类型" + i);
                    return false
                }
                if (element.expressionVO.varDataType != 12 && element.expressionVO.optType != 8 && element.expressionVO.optType != 9) {
                    if ((!element.expressionVO.value && element.expressionVO.value !== 0) || (!element.expressionVO.valueCode && element.expressionVO.valueCode !== 0) || (!element.expressionVO.valueType && element.expressionVO.valueType !== 0)) {
                        console.log("请补充完整变量比较值" + i);
                        return false
                    }
                    element.expressionVO.valueType = Number(element.expressionVO.valueType);
                } else if (element.expressionVO.valueType == 'var') {
                    console.log("请补充完整变量比较值" + i);
                    return false
                }
                element.expressionVO.varType = Number(element.expressionVO.varType);

            } else {
                for (let j = 0; j < element.conditions.length; j++) {
                    let element2 = element.conditions[j];
                    if (element2.nodeType === 1) {
                        if ((!element2.expressionVO.varCode && element2.expressionVO.varCode !== 0) || (!element2.expressionVO.varCode && element2.expressionVO.varCode !== 0)) {
                            console.log("请选择完全您的条件变量" + i + '-' + j);
                            return false
                        }
                        if (!element2.expressionVO.optType && element2.expressionVO.optType !== 0) {
                            console.log("请选择完全您的变量关系类型" + i + '-' + j);
                            return false
                        }
                        if (element2.expressionVO.varDataType != 12 && element2.expressionVO.optType != 8 && element2.expressionVO.optType != 9) {
                            if ((!element2.expressionVO.value && element2.expressionVO.value !== 0) || (!element2.expressionVO.valueCode && element2.expressionVO.valueCode !== 0) || (!element2.expressionVO.valueType && element2.expressionVO.valueType !== 0)) {
                                console.log("请补充完整变量比较值" + i + '-' + j);
                                return false
                            }
                            element2.expressionVO.valueType = Number(element2.expressionVO.valueType);
                        } else if (element2.expressionVO.valueType == 'var') {
                            console.log("请补充完整变量比较值" + i);
                            return false
                        }

                        element2.expressionVO.varType = Number(element2.expressionVO.varType);

                    } else {
                        for (let k = 0; k < element2.conditions.length; k++) {
                            let element3 = element2.conditions[k];
                            if (element3.nodeType === 1) {
                                if ((!element3.expressionVO.varCode && element3.expressionVO.varCode !== 0) || (!element3.expressionVO.varCode && element3.expressionVO.varCode !== 0)) {
                                    console.log("请选择完全您的条件变量" + i + '-' + j + '-' + k);
                                    return false
                                }
                                if (!element3.expressionVO.optType && element3.expressionVO.optType !== 0) {
                                    console.log("请选择完全您的变量关系类型" + i + '-' + j + '-' + k);
                                    return false
                                }
                                if (element3.expressionVO.varDataType != 12 && element3.expressionVO.optType != 8 && element3.expressionVO.optType != 9) {
                                    if ((!element3.expressionVO.value && element3.expressionVO.value !== 0) || (!element3.expressionVO.valueCode && element3.expressionVO.valueCode !== 0) || (!element3.expressionVO.valueType && element3.expressionVO.valueType !== 0)) {
                                        console.log("请补充完整变量比较值" + i + '-' + j + '-' + k);
                                        return false
                                    }
                                    element3.expressionVO.valueType = Number(element3.expressionVO.valueType);
                                } else if (element3.expressionVO.valueType == 'var') {
                                    console.log("请补充完整变量比较值" + i);
                                    return false
                                }

                                element3.expressionVO.varType = Number(element3.expressionVO.varType);

                            }
                        }
                    }
                }
            }
        }
        console.log('----  条件数数据完整如下  ----');
        console.log(toJS(treeJson));
        this.props.translateToSql(treeJson);
        return true
    }


    render() {
        console.log("render ", this.state.treeJson);
        return (
            <Provider conditionTreeStore={this.conditionTreeStore}>
                <div className="tree-panel-container" style={{ paddingLeft: '45px', clear: 'both', minWidth: '940px', overfloat: 'scroll' }} >
                    {
                        this.state.treeJson.map((item, i) =>
                            <Tree optTypeList={this.state.optTypeList} verifyConditionTreeFinish={this.verifyConditionTreeFinish} valueTypeList={this.state.valueTypeList} varTypeOfField={this.state.varTypeOfField} fieldList={this.props.fieldList} type={this.props.type} updateConditionTree={this.props.updateConditionTree} cascadeData={this.state.cascadeData} add={this.add} sub={this.sub} node={item} nodeKey={i}></Tree>
                        )
                    }

                </div>
            </Provider>
        )
    }
}
TreePanel.propTypes = {
    treeData: PropTypes.object,
    treeDataCallBack: PropTypes.fun,
    fieldList: PropTypes.array,
    translateToSql: PropTypes.func,
    id: PropTypes.string,
    allVarListTypeForm: PropTypes.oneOf(['rtq', 'rule', 'strategy', 'ext']),
    initTempVarListCallBack: PropTypes.func,
    extRealdy: PropTypes.bool
}
TreePanel.defaultProps = {
    treeDataCallBack: () => { },
    fieldList: [],
    translateToSql: () => { },
    id: '',
    initTempVarListCallBack: () => { },
    extRealdy: false
}
export default TreePanel;