import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { Select, Input, InputNumber, DatePicker, Button, Cascader } from 'antd';
import '@/styles/condition-tree/tree.less';
import AddAndSub from '@/components/condition-tree/AddAndSub';
import TreeCopy from '@/components/condition-tree/Tree';
import common from '@/utils/common';
import FixedValue from '@/components/condition-tree/FixedValue';

const IndentCell = 75;

const valueTypeConstList = [{ code: 'var', value: '变量' }, { code: 0, value: '固定值' }];//等于的时候就有函数，否则没有函数选择
const optTypeConstList = [{
    "code": 0,
    "value": "等于"
},
{
    "code": 1,
    "value": "大于"
},
{
    "code": 2,
    "value": "小于"
},
{
    "code": 3,
    "value": "不等于"
},
{
    "code": 4,
    "value": "大于等于"
},
{
    "code": 5,
    "value": "小于等于"
},
{
    "code": 8,
    "value": "is null"
},
{
    "code": 9,
    "value": "is not null"
}];




@inject('conditionTreeStore')
class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indentTimes: 0,
            isFirstNode: false,
            isFirstNodes: false,
            relWidth: 0,
            valueType: 0,
            functionType: 'now',
            index: 0,
            valueTypeList: []
        }
        this.saveData = {
            "varCode": "",
            "varName": "",
            "varType": "",
            "optType": "",
            "value": "",
            "valueType": 0,
            "valueCode": "",
            "valueName": "",
            "varDataType": "",
            "valueDataType": ""
        }
        this.changeData = this.changeData.bind(this);
        this.changeOptTypeListCallBack = this.changeOptTypeListCallBack.bind(this);
        if (!this.props.node.treeData && this.props.node.nodeType == 1) {
            let node = common.deepClone(this.props.node);
            this.saveData = {
                "varCode": node.expressionVO.varCode,
                "varName": node.expressionVO.varName,
                "varType": String(node.expressionVO.varType),
                "optType": node.expressionVO.optType,
                "value": node.expressionVO.value,
                "valueType": String(node.expressionVO.valueType),
                "valueCode": node.expressionVO.valueCode,
                "valueName": node.expressionVO.valueName,
                "varDataType": node.expressionVO.varDataType,
                "valueDataType": node.expressionVO.valueDataType
            }

            if (node.expressionVO.valueType === 6) {
                let functionType = '';
                if (node.expressionVO.value === 'now') {
                    functionType = 'now';
                } else {
                    functionType = node.expressionVO.value.split('·-·')[0];
                }
                this.setState({
                    functionType: functionType,
                    valueType: node.expressionVO.valueType
                })
            } else {
                this.setState({ valueType: node.expressionVO.valueType })
            }
            if (node.id) {
                this.saveData.id = node.expressionVO.id;
            }
        }

        // console.log('nodeKey =' + this.props.nodeKey);
    }

    componentWillReceiveProps(nextProps) {

        console.log("tree  componentWillReceiveProps", nextProps);
        if (!nextProps.node.treeData && nextProps.node.nodeType === 1) {
            // alert(1)
            this.saveData.varCode = nextProps.node.expressionVO.varCode;
            this.saveData.varName = nextProps.node.expressionVO.varName;
            this.saveData.varType = String(nextProps.node.expressionVO.varType);
            this.saveData.optType = nextProps.node.expressionVO.optType;
            this.saveData.varDataType = nextProps.node.expressionVO.varDataType;
            this.saveData.valueDataType = nextProps.node.expressionVO.valueDataType;
            // this.changeOptTypeListCallBack(nextProps.node.expressionVO.optType);
            this.saveData.value = nextProps.node.expressionVO.value;
            if (nextProps.node.expressionVO.valueType !== 0 && nextProps.node.expressionVO.valueType !== 6) {//变量
                this.saveData.valueType = String(nextProps.node.expressionVO.valueType);
                console.log(typeof this.saveData.valueType);
                this.setState({
                    valueType: nextProps.node.expressionVO.valueType
                })
            } else {
                this.saveData.valueType = nextProps.node.expressionVO.valueType;

                if (nextProps.node.expressionVO.valueType === 6) {
                    // alert("1111")
                    let functionType = '';
                    if (nextProps.node.expressionVO.value === 'now') {
                        functionType = 'now';
                    } else {
                        functionType = nextProps.node.expressionVO.value.split('·-·')[0];
                    }
                    this.setState({
                        functionType: functionType,
                        valueType: nextProps.node.expressionVO.valueType
                    })
                } else {
                    this.setState({
                        valueType: nextProps.node.expressionVO.valueType
                    })
                }
            }


            this.saveData.valueCode = nextProps.node.expressionVO.valueCode;
            this.saveData.valueName = nextProps.node.expressionVO.valueName;
            if (nextProps.node.id) {
                this.saveData.id = nextProps.node.expressionVO.id;
            }
            this.setState({ valueType: nextProps.node.expressionVO.valueType, valueTypeList: this.props.valueTypeList })
        }
    }

    componentWillMount() {
        // if (this.props.node.nodeType === 2) return
        let indentTimes;
        let nodeKey = this.props.nodeKey;
        let keyArray;
        let isFirstNode = false;
        let isFirstNodes = false;

        const NormalRelWidth = '70px';
        const FirstNodeRelWidth = '145px';
        const FirstNodesRelWidth = '218px';
        let relWidth = NormalRelWidth;

        if (!isNaN(nodeKey)) {//第一级
            if (nodeKey === 0) {
                indentTimes = 0;
                isFirstNode = true;
            }
            else {
                indentTimes = 1;
            }
        } else {//第二级
            keyArray = nodeKey.split('·-·');
            switch (keyArray.length) {
                case 2:
                    if (nodeKey === '0·-·0') {
                        indentTimes = 0;
                        relWidth = FirstNodesRelWidth;
                        isFirstNodes = true;
                    } else {
                        if (keyArray[1] == 0) {
                            indentTimes = 1;
                            relWidth = FirstNodeRelWidth;
                            isFirstNode = true;
                        }
                        else {
                            indentTimes = 2;
                        }
                    }

                    break;
                case 3:
                    if (nodeKey === '0·-·0·-·0') {
                        indentTimes = 0;
                        relWidth = FirstNodesRelWidth;
                        isFirstNodes = true;
                    } else {
                        if (keyArray[2] == 0) {

                            indentTimes = 2;
                            if (keyArray[1] == 0) {
                                indentTimes--;
                                if (keyArray[2] == 0) {
                                    relWidth = FirstNodesRelWidth;
                                    isFirstNodes = true;
                                }
                            } else {
                                if (keyArray[2] == 0) {
                                    isFirstNode = true;
                                    relWidth = FirstNodeRelWidth;
                                }
                            }
                        }
                        else {
                            indentTimes = 3;
                        }
                    }

                    break;
                case 4:
                    if (keyArray[3] == 0) {
                        indentTimes = 3;
                        if (keyArray[2] == 0) {
                            indentTimes--;
                            if (keyArray[3] == 0) {
                                relWidth = FirstNodesRelWidth;
                                isFirstNodes = true;
                            }
                        } else {
                            if (keyArray[3] == 0) {
                                isFirstNode = true;
                                relWidth = FirstNodeRelWidth;
                            }
                        }
                    }
                    else {
                        indentTimes = 4;
                    }
                    break;
                default:
                    break;
            }
        }
        this.setState({
            indentTimes: indentTimes,
            isFirstNode: isFirstNode,
            isFirstNodes: isFirstNodes,
            relWidth: relWidth
        })
    }

    componentWillUnmount() {
        this.saveData = {
            "varCode": "",
            "varName": "",
            "varType": "",
            "optType": "",
            "value": "",
            "valueType": 0,
            "valueCode": "",
            "valueName": "",
            "varDataType": "",
            "valueDataType": ""
        }
    }


    changeData(name, value) {
        console.log("changeData", name, value);
        if (name === 'value' && value !== 'now') {
            value == '';
        }
        if (name === 'varDataType') {
            this.props.conditionTreeStore.updateNodeData(this.props.nodeKey, 'value', '');
            this.saveData.value = '';
        }
        if (name === 'valueType') {
            if (value === 6) {
                this.saveData.valueCode = 'now';
                this.props.conditionTreeStore.updateNodeData(this.props.nodeKey, 'valueType', 'now');
                this.props.conditionTreeStore.updateNodeData(this.props.nodeKey, 'valueCode', 'now');
                this.setState({
                    functionType: 'now'
                })
            } else {
                this.props.conditionTreeStore.updateNodeData(this.props.nodeKey, 'value', '');
                this.saveData.value = '';
            }

        }
        if (name === 'optType') {
            // this.changeOptTypeListCallBack(value);
        }
        this.props.conditionTreeStore.updateNodeData(this.props.nodeKey, name, value);
        this.saveData[name] = value;
        if (name === 'value') {
            if (!common.isEmpty(value) && value.length > 30) {
                this.saveData.value = String(this.saveData.value).substr(0, 30);
            }
        }
        this.props.updateConditionTree(this.props.conditionTreeStore.conditionTreeJson);
        this.props.verifyConditionTreeFinish();
        this.setState({ index: this.state.index })
    }
    /**
         * 当过滤选择‘等于’操作符时，才出现‘函数’选项。目前函数不支持其他操作符，因为这些都是自定义函数
         * @memberof TreePanel
         */
    changeOptTypeListCallBack(code) {

        let tempArray = this.state.valueTypeList;
        if (code == 0) {//0为等于，，此时optList出现函数选项
            let codeArray = []
            this.props.valueTypeList.forEach(element => {
                codeArray.push(element.code);
            })
            // alert(codeArray.indexOf(6) == -1);
            if (codeArray.indexOf(6) == -1) {
                tempArray = this.props.valueTypeList;
                tempArray.push({
                    code: 6,
                    value: '函数'
                });
                this.setState({
                    valueTypeList: tempArray
                })

            }
            console.log('等于的时候');
            console.log(tempArray);
            console.log(codeArray.indexOf(6) == -1);
            console.log(codeArray);
        } else {
            this.props.valueTypeList.forEach(element => {
                if (element.code != 6) tempArray.push(element)
            })
            this.setState({
                valueTypeList: tempArray
            })
            console.log('不是等于的时候');
            console.log(tempArray);
        }
    }
    render() {
        // alert(this.state.valueType+ '   '+  typeof this.state.valueType)
        function filter(inputValue, path) {
            return (path.some(option => (option.value).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }
        return (
            <div style={{ clear: 'both' }}>

                {
                    this.props.node.nodeType === 1 ?
                        <div className="cell-container" style={{ left: IndentCell * this.state.indentTimes + 'px' }}>
                            {this.props.nodeKey === 0 ?
                                <div className="guide" style={{ marginLeft: '-30px' }}>
                                    <div style={{ paddingTop: '10px' }}>
                                        <Button type="primary" style={{ float: 'left' }}>start</Button>
                                        <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} />
                                        <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>─────────</p>
                                    </div>
                                </div>
                                :
                                this.props.nodeKey === '0·-·0' ?
                                    <div className="guide" style={{ marginLeft: '-30px' }}>

                                        <div style={{ paddingTop: '10px' }}>
                                            <Button type="primary" style={{ float: 'left' }}>start</Button>
                                            {
                                                this.state.isFirstNodes ? this.props.node.relType === 0 ? <AddAndSub type="add" addAnd={() => this.props.add(0, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(0, 'or', this.props.node.expressionVO, false)} /> : <AddAndSub type="add" addAnd={() => this.props.add(0, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(0, 'or', this.props.node.expressionVO, false)} /> :

                                                    this.state.isFirstNode ? this.props.node.relType === 0 ? <AddAndSub type="add" addAnd={() => this.props.add(0, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(0, 'or', this.props.node.expressionVO, false)} /> : <AddAndSub type="add" addAnd={() => this.props.add(0, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(0, 'or', this.props.node.expressionVO, false)} /> : ''

                                            }
                                            <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                {
                                                    this.state.isFirstNodes ? this.props.node.relType === 0 ? '────────' : '────────' :

                                                        this.state.isFirstNode ? this.props.node.relType === 0 ? '────' : '────' : ''
                                                }
                                            </p>
                                            <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} />
                                            <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                {
                                                    this.state.isFirstNodes ? this.props.node.relType === 0 ? '───────' : '───────' :

                                                        this.state.isFirstNode ? this.props.node.relType === 0 ? '────' : '────' : ''
                                                }
                                            </p>
                                        </div>

                                    </div>
                                    :
                                    this.props.nodeKey === '0·-·0·-·0' ?
                                        <div className="guide" style={{ marginLeft: '-30px' }}>

                                            <div style={{ paddingTop: '10px' }}>
                                                <Button type="primary" style={{ float: 'left' }}>start</Button>
                                                {
                                                    this.state.isFirstNodes ? this.props.node.relType === 0 ? <AddAndSub type="add" addAnd={() => this.props.add(0, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(0, 'or', this.props.node.expressionVO, false)} /> : <AddAndSub type="add" addAnd={() => this.props.add(0, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(0, 'or', this.props.node.expressionVO, false)} /> :

                                                        this.state.isFirstNode ? this.props.node.relType === 0 ? <AddAndSub type="add" addAnd={() => this.props.add(0, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(0, 'or', this.props.node.expressionVO, false)} /> : <AddAndSub type="add" addAnd={() => this.props.add(0, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(0, 'or', this.props.node.expressionVO, false)} /> : ''

                                                }
                                                <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                    {
                                                        this.state.isFirstNodes ? this.props.node.relType === 0 ? '────────' : '────────' :

                                                            this.state.isFirstNode ? this.props.node.relType === 0 ? '────' : '────' : ''
                                                    }
                                                </p>
                                                <AddAndSub type="add" addAnd={() => this.props.add('0·-·0', 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add('0·-·0', 'or', this.props.node.expressionVO, false)} />
                                                <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                    {
                                                        this.state.isFirstNodes ? this.props.node.relType === 0 ? '──────' : '──────' :

                                                            this.state.isFirstNode ? this.props.node.relType === 0 ? '────' : '────' : ''
                                                    }
                                                </p>
                                                <AddAndSub type="add" addAnd={() => this.props.add('0·-·0·-·0', 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add('0·-·0·-·0', 'or', this.props.node.expressionVO, false)} />
                                                <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                    {
                                                        this.state.isFirstNodes ? this.props.node.relType === 0 ? '──────' : '──────' :

                                                            this.state.isFirstNode ? this.props.node.relType === 0 ? '──────' : '──────' : ''
                                                    }
                                                </p>
                                            </div>

                                        </div>
                                        :
                                        <div className="guide">
                                            {
                                                isNaN(this.props.nodeKey) ?
                                                    (() => {
                                                        let treejson = this.props.conditionTreeStore.conditionTreeJson;
                                                        let keyArray = this.props.nodeKey.split('·-·');
                                                        switch (keyArray.length) {
                                                            case 2:
                                                                if (keyArray[1] != 0) {
                                                                    if (keyArray[0] == treejson.length - 1 && treejson[keyArray[0]].conditions[keyArray[1]].nodeType == 1) {

                                                                    } else {
                                                                        if (keyArray[1] > keyArray[0]) {
                                                                            return <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>
                                                                        } else {
                                                                            if (keyArray[1] > treejson.length && treejson[keyArray[0]].nodeType == 2) {
                                                                                return <div className="guide-l" style={{ marginLeft: '-' + IndentCell * 2 + 'px' }}></div>
                                                                            } else {
                                                                                return <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>
                                                                            }

                                                                        }
                                                                    }


                                                                }
                                                                break;
                                                            case 3:
                                                                let rs;

                                                                if (keyArray[2] == 0 && keyArray[1] == 0) {
                                                                    rs = ''
                                                                } else {
                                                                    if (keyArray[0] == treejson.length - 1) {//第一级的最后节点
                                                                        if (treejson[keyArray[0]].conditions[keyArray[1]].nodeType == 2) {
                                                                            if (keyArray[2] == 0) {

                                                                            } else {
                                                                                if (keyArray[1] == 1) {
                                                                                    if (keyArray[1] < treejson[keyArray[0]].conditions.length - 1) {
                                                                                        rs = <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>
                                                                                    }
                                                                                } else {
                                                                                    if (keyArray[1] < treejson[keyArray[0]].conditions.length - 1) {
                                                                                        rs = <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>
                                                                                    } else {

                                                                                    }
                                                                                }
                                                                            }


                                                                        }

                                                                    } else {
                                                                        if (keyArray[2] != 0) {
                                                                            if (treejson.length - 1 == keyArray[0]) {
                                                                                rs = <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>
                                                                            } else {
                                                                                console.log('hahahahahah ');
                                                                                console.log(treejson);
                                                                                if (treejson.length >= treejson[keyArray[0]].conditions.length && keyArray[1] == treejson[keyArray[0]].conditions.length - 1) {
                                                                                    rs = <div className="guide-l" style={{ marginLeft: '-' + IndentCell * 2 + 'px' }}></div>
                                                                                } else {
                                                                                    rs = <div><div className="guide-l" style={{ marginLeft: '-' + IndentCell * 2 + 'px' }}></div><div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div></div>
                                                                                }
                                                                            }


                                                                        } else {
                                                                            rs = <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>

                                                                        }
                                                                    }

                                                                }
                                                                return rs;
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    })() : ''
                                            }
                                            <div className="guide-l"></div>
                                            {
                                                isNaN(this.props.nodeKey) && this.props.nodeKey.split('·-·')[1] == 0 && this.props.nodeKey.split('·-·')[2] == 0 ?
                                                    <div style={{ width: this.state.relWidth, height: 'inherit', paddingTop: '10px' }}>
                                                        <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? this.props.node.relType === 0 ? '─ and ' : '── or ' :

                                                                    this.state.isFirstNode ? this.props.node.relType === 0 ? '─ and ' : '── or ' : this.props.node.relType === 0 ? '─ and ──' : '── or ──'
                                                            }
                                                        </p>
                                                        <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? this.props.node.relType === 0 ? '──' : '──' :

                                                                    this.state.isFirstNode ? this.props.node.relType === 0 ? '─' : '─' : ''
                                                            }
                                                        </p>
                                                        {
                                                            this.state.isFirstNodes ? this.props.node.relType === 0 ? <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey.split('·-·')[0] + '-0', 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey.split('·-·')[0] + '-0', 'or', this.props.node.expressionVO, false)} /> : <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} /> :

                                                                this.state.isFirstNode ? this.props.node.relType === 0 ? <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey.split('·-·')[0] + '-0', 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey.split('·-·')[0] + '-0', 'or', this.props.node.expressionVO, false)} /> : <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} /> : ''

                                                        }
                                                        <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? this.props.node.relType === 0 ? '─────' : '─────' :

                                                                    this.state.isFirstNode ? this.props.node.relType === 0 ? '─' : '─' : ''
                                                            }
                                                        </p>
                                                        {
                                                            this.state.isFirstNodes ? this.props.node.relType === 0 ? <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} /> : <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} /> :

                                                                this.state.isFirstNode ? this.props.node.relType === 0 ? <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} /> : <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} /> : ''

                                                        }
                                                        <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? this.props.node.relType === 0 ? '──────' : '──────' :

                                                                    this.state.isFirstNode ? this.props.node.relType === 0 ? '───────' : '───────' : ''
                                                            }
                                                        </p>
                                                    </div>
                                                    :
                                                    <div style={{ width: this.state.relWidth, height: 'inherit', paddingTop: '10px' }}>
                                                        <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? this.props.node.relType === 0 ? '─ and ' : '── or ' :

                                                                    this.state.isFirstNode ? this.props.node.relType === 0 ? '─ and ' : '── or ' : this.props.node.relType === 0 ? '─ and ──' : '── or ──'
                                                            }
                                                        </p>
                                                        <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? this.props.node.relType === 0 ? '─────────' : '─────────' :

                                                                    this.state.isFirstNode ? this.props.node.relType === 0 ? '─' : '─' : ''
                                                            }
                                                        </p>
                                                        {
                                                            this.state.isFirstNodes ? this.props.node.relType === 0 ? <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} /> : <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} /> :

                                                                this.state.isFirstNode ? this.props.node.relType === 0 ? <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} /> : <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, false)} /> : ''

                                                        }
                                                        <p style={{ width: 'fit-content', height: '32px', lineHeight: '32px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? this.props.node.relType === 0 ? '───────' : '───────' :

                                                                    this.state.isFirstNode ? this.props.node.relType === 0 ? '───────' : '───────' : ''
                                                            }
                                                        </p>
                                                    </div>
                                            }

                                        </div>
                            }
                            {
                                this.props.type === 'query' ?
                                    <Select placeholder="选择表字段" onChange={(value, option) => { this.changeData('varType', this.props.varTypeOfField); this.changeData('varCode', value); this.changeData('varName', option.props.children); this.changeData('varDataType', Number(option.props.varDataType)); }} className="fieldList" value={this.saveData.varName}>
                                        {this.props.fieldList.map((item, i) =>
                                            <Select.Option value={item.code} varDataType={item.varDataType}>{item.value}</Select.Option>
                                        )}
                                    </Select>
                                    :
                                    <Cascader displayRender={label => label[1]} placeholder="选择变量" value={[this.saveData.varType, this.saveData.varCode + '·-·' + this.saveData.varDataType]} title={this.saveData.varCode} onChange={(value) => { this.changeData('varType', value[0]); this.changeData('varCode', value[1].split('·-·')[0]); this.changeData('varDataType', value[1].split('·-·')[1]); }} className="varList" options={this.props.cascadeData} placeholder="请选择" showSearch={{ filter }} />
                            }

                            <Select placeholder="选择操作关系" onChange={(value) => { this.changeData('optType', value) }} className="relationList" value={this.saveData.optType}>
                                {
                                    this.saveData.varDataType == 12 ?
                                        this.props.optTypeList.map((item, i) =>
                                            <Select.Option value={item.code}>{item.value}</Select.Option>
                                        )
                                        :
                                        optTypeConstList.map((item, i) =>
                                            <Select.Option value={item.code}>{item.value}</Select.Option>
                                        )
                                }
                            </Select>
                            {
                                this.saveData.optType == 8 || this.saveData.optType == 9 ? ''
                                    :
                                    <Select placeholder="选择表达式值的类型" value={this.saveData.valueType == 0 ? 0 : this.saveData.valueType == 6 ? 6 : 'var'} onChange={(value) => { this.changeData('valueType', isNaN(value) ? 'var' : value); value === 6 ? (() => { this.setState({ functionType: 'now', valueType: value }); this.changeData('value', 'now'); })() : this.setState({ valueType: value }); }} className="typeList">
                                        {/* <Select.Option value={7}>变量</Select.Option>
                                <Select.Option value={0}>固定值</Select.Option>
                                <Select.Option value={1}>函数</Select.Option> */}
                                        {
                                            (this.saveData.optType == 0 || this.props.node.valueType == 0) ?
                                                this.props.valueTypeList.map((item, i) =>
                                                    <Select.Option value={item.code}>{item.value}</Select.Option>
                                                )
                                                :
                                                valueTypeConstList.map((item, i) =>
                                                    <Select.Option value={item.code}>{item.value}</Select.Option>
                                                )
                                        }
                                    </Select>
                            }
                            {/* {this.state.valueType}{this.saveData.valueType} {typeof this.saveData.valueType} */}
                            {
                                (() => {
                                    if (this.saveData.optType != 8 && this.saveData.optType != 9) {

                                        // console.log(this.saveData.valueType + '  ' + typeof this.saveData.valueType);
                                        switch (this.saveData.valueType) {
                                            case 0:
                                                return <FixedValue type="tree" value={this.saveData.value} changeData={this.changeData} dataType={this.saveData.varDataType} />;
                                                break;
                                            case 6:
                                                return <Select placeholder="选择函数" value={this.saveData.value === 'now' ? 'now' : this.saveData.value.split('·-·')[0]} onChange={(value) => { value === 'now' ? (() => { this.changeData('value', value); this.changeData('valueCode', value) })() : (() => { this.changeData('value', value + '·-·' + '1'); this.setState({ functionType: value }); })() }} className="functionList"><Select.Option value="now">当天</Select.Option><Select.Option value="day">近N天</Select.Option><Select.Option value="month">近N月</Select.Option></Select>; break;
                                            case '0':
                                                return <FixedValue type="tree" value={this.saveData.value} changeData={this.changeData} dataType={this.saveData.varDataType} />
                                            case '6':
                                                return <Select placeholder="选择函数" value={this.saveData.value === 'now' ? 'now' : this.saveData.value.split('·-·')[0]} onChange={(value) => { value === 'now' ? (() => { this.changeData('value', value); this.changeData('valueCode', value) })() : (() => { this.changeData('value', value + '·-·' + '1'); this.setState({ functionType: value }); })() }} className="functionList"><Select.Option value="now">当天</Select.Option><Select.Option value="day">近N天</Select.Option><Select.Option value="month">近N月</Select.Option></Select>; break;
                                            default:
                                                return <Cascader displayRender={label => label[1]} placeholder="选择变量" value={[this.saveData.valueType, this.saveData.valueCode + '·-·' + this.saveData.valueDataType]} onChange={(value) => { this.changeData('valueType', value[0]); this.changeData('valueCode', value[1].split('·-·')[0]); this.changeData('value', value[1].split('·-·')[0]); this.changeData('valueDataType', value[1].split('·-·')[1]); }} className="varList" options={this.props.cascadeData} placeholder="请选择" showSearch={{ filter }} />; break;
                                        }
                                    }

                                }
                                )()

                            }
                            {/* {this.saveData.value}
                            {typeof this.saveData.value}
                            {this.saveData.valueType} */}
                            {
                                this.saveData.optType == 8 || this.saveData.optType == 9 ? '' :
                                    this.saveData.value !== 'now' && this.saveData.valueType == 6 ? <InputNumber value={this.saveData.value ? Number(this.saveData.value.split('·-·')[1]) : 0} onChange={(value) => { this.changeData('value', this.state.functionType + '·-·' + value); this.changeData('valueCode', this.state.functionType + '·-·' + value); }} className="valueType" style={{ width: '95px' }} min={1} /> : ''
                            }

                            <p style={{ marginTop: '10px', float: 'left' }}>
                                {
                                    isNaN(this.props.nodeKey) ?
                                        this.props.nodeKey.split('·-·').length >= 3 ? <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />
                                            : <AddAndSub type="add-sub" sub={() => this.props.sub(this.props.nodeKey)} addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, true)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, true)} />
                                        : this.props.nodeKey === 0 ?
                                            this.props.conditionTreeStore.conditionTreeJson.length === 1 ? ''
                                                : <AddAndSub type="add" addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, true)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, true)} />
                                            : <AddAndSub type="add-sub" sub={() => this.props.sub(this.props.nodeKey)} addAnd={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, true)} addOr={() => this.props.add(this.props.nodeKey, 'or', this.props.node.expressionVO, true)} />
                                }
                            </p>


                        </div>
                        :
                        this.props.node.conditions.map((item, i) =>
                            <TreeCopy verifyConditionTreeFinish={this.props.verifyConditionTreeFinish} optTypeList={this.props.optTypeList} valueTypeList={this.props.valueTypeList} varTypeOfField={this.props.varTypeOfField} fieldList={this.props.fieldList} type={this.props.type} updateConditionTree={this.props.updateConditionTree} cascadeData={this.props.cascadeData} add={this.props.add} sub={this.props.sub} node={item} nodeKey={this.props.nodeKey + '·-·' + i} ></TreeCopy>
                        )

                }
            </div>

        )
    }
}
Tree.propTypes = {
    typeList: PropTypes.array.isRequired,
    dimensionList: PropTypes.array.isRequired,
    valueType: PropTypes.oneOf([1, 2, 3]).isRequired,
    index: PropTypes.number,
    origin: PropTypes.oneOf(['and', 'or']),
    parentIndex: PropTypes.number,
    cascadeData: PropTypes.array,//级联选择数据
    varTypeOfField: PropTypes.string,
    type: PropTypes.string,
    verifyConditionTreeFinish: PropTypes.func,
    optTypeList: PropTypes.array,
}
Tree.defaultProps = {
    valueType: 1,
    cascadeData: [],
    varTypeOfField: '',
    type: '',
    verifyConditionTreeFinish: () => { },
    optTypeList: [],
}
export default Tree;