import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, Icon, Select, Table, Button, message, Switch, InputNumber } from 'antd';
import PropTypes from 'prop-types';
import AddAndSub from '@/components/AddAndSub';
import FieldSelector from '@/components/business/variable/real-time-query/FieldSelector';
import TreePanel from '@/components/condition-tree/TreePanel';
import FormTitle from '@/components/FormTitle';
import FormButtonGroup from '@/components/FormButtonGroup';
import Code from '@/components/Code';
import SelectGroup from '@/components/SelectGroup';
import AddSub from '@/components/process-tree/AddSub';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject, observer } from 'mobx-react';

const conditionVODemo = {
    "relType": 1,
    "nodeType": 2,
    "conditions": [{
        "relType": 1,
        "expressionVO": {
            "varCode": "",
            "varName": "",
            "varType": "",
            "optType": "",
            "value": "",
            "valueType": 0,
            "valueCode": "",
            "valueName": ""
        },
        "nodeType": 1
    }
    ]
}

const optTypeConstList = [
    {
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

const functionListForString = [
    { "val": '', "label": '无' },
    {
        "val": 0,
        "label": "COUNT"
    }];
const functionListForBoolean = [
    { "val": '', "label": '无' }];
const functionListForDate = [
    { "val": '', "label": '无' },
    {
        "val": 0,
        "label": "COUNT"
    }, {
        "val": 2,
        "label": "MIN"
    },
    {
        "val": 3,
        "label": "MAX"
    },]
const functionListForNumber = [
    { "val": '', "label": '无' },
    {
        "val": 0,
        "label": "COUNT"
    },
    {
        "val": 1,
        "label": "SUM"
    },
    {
        "val": 2,
        "label": "MIN"
    },
    {
        "val": 3,
        "label": "MAX"
    },
    {
        "val": 4,
        "label": "AVG"
    }]
const functionListForNull = [
    { "val": '', "label": '无' }];
const functionListForAll = [
    { "val": '', "label": '无' },
    {
        "val": 0,
        "label": "COUNT"
    },
    {
        "val": 1,
        "label": "SUM"
    },
    {
        "val": 2,
        "label": "MIN"
    },
    {
        "val": 3,
        "label": "MAX"
    },
    {
        "val": 4,
        "label": "AVG"
    }]

@withRouter
@observer
@inject('store')
class Query extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mappings: [],
            tableList: [],
            fieldList: [],
            simpleFieldList: [],
            allField: {},
            tempVarList: [],
            parentNodeList: [],
            orderFieldsValue: [],
            groupFieldsValue: [],
            index: 0,
            functionList: [],
            havingFuncList: []
        }
        this.saveData = {
            "varType": 0,
            "name": "",
            "parentId": "",
            'sqlCode': "",
            "mappingType": 1,//0实时查询变量映射，1临时变量映射
            "tables": [{
                "aliasName": "",
                "name": ""
            }],
            "orderFields": [
                // {
                //     "field": "",
                //     "order": "asc",
                //     "table": {
                //         "aliasName": "",
                //         "name": ""
                //     }
                // }
            ],
            "queryFields": [
                //     {
                //     "field": "money",
                //     "fieldName": "交易金额",
                //     "table": {
                //         "aliasName": "c",
                //         "name": "customer"
                //     },
                //     "varCode": "v_code",
                //     "varName": "映射变量中文名",
                //     "functionType": 1,
                //     "functionCode": "SUM",
                //     "secondFunctionType": 1,
                //     "secondFunctionCode": "1"
                // }
            ],
            "secondType": 2,
            "type": 1,
            "groupFields": [],
            "conditionVO": common.deepClone(conditionVODemo),
            "havingConditionVO": [1, 2, 3, 4]
        }
        this.queryFieldsDataType = [];
        this.addMappings = this.addMappings.bind(this);
        this.subMappings = this.subMappings.bind(this);
        this.save = this.save.bind(this);
        this.verify = this.verify.bind(this);
        this.getTableList = this.getTableList.bind(this);
        this.initTempVarListCallBack = this.initTempVarListCallBack.bind(this);
        // this.selectGroupChange = this.selectGroupChange.bind(this);
        // this.selectGroupAddAndSubCallBack = this.selectGroupAddAndSubCallBack.bind(this);
        this.getNodeDetailById = this.getNodeDetailById.bind(this);
        this.updateConditionTree = this.updateConditionTree.bind(this);
        this.treeDataCallBack = this.treeDataCallBack.bind(this);
        this.functionTypeList = this.functionTypeList.bind(this);
        this.tableDataChange = this.tableDataChange.bind(this);
        this.controlNodeTranslateToSql = this.controlNodeTranslateToSql.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.isQueryFieldsFinish = this.isQueryFieldsFinish.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.checkQueryFieldsFinish = this.checkQueryFieldsFinish.bind(this);
        // this.fillGroupFields = this.fillGroupFields.bind(this);
        this.resetOrderBySelectData = this.resetOrderBySelectData.bind(this);
    }
    componentDidMount() {
        switch (this.props.type) {
            case 'rtq':
                this.saveData.rtqId = this.props.match.params.id;
                break;
            case 'rule':
                this.saveData.ruleId = this.props.match.params.id;
                break;
            case 'strategy':
                this.saveData.strategyId = this.props.match.params.id;
                break;

            default:
                break;
        }
        this.functionTypeList();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.currentName !== this.props.currentName) {
            this.saveData.name = nextProps.currentName;
        }
        if (this.props.nodeId !== nextProps.nodeId && nextProps.nodeId) {
            this.getNodeDetailById(nextProps.nodeId);
        }

    }
    functionTypeList() {
        variableService.functionTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [{ code: '', value: '无' }];
            let tempArray2 = [];
            res.data.result.forEach(element => {

                if (element.label !== 'FIRST' && element.label !== 'LAST' && element.label !== 'DISTINCT') {
                    tempArray2.push(element);
                    tempArray.push({
                        code: element.val + '·-·' + element.label,
                        value: element.label
                    });
                }
            })
            this.setState({
                functionList: tempArray,
                havingFuncList: tempArray2
            })



            this.getTableList();
        });
    }
    updateConditionTree = (conditions) => {
        this.saveData.conditionVO.conditions = conditions;
    }
    treeDataCallBack(allConditions) {
        // console.log(allConditions);
        this.saveData.conditionVO.conditions = allConditions;
    }
    getTableList = () => {
        variableService.getTableList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempTableArray = [];
            let tempFieldArray = [];
            let tempAllField = {};
            res.data.result.forEach(element => {
                let tempObj = {
                    code: element.code,
                    value: element.name
                }
                tempTableArray.push(tempObj);

                tempAllField[element.code] = element.columns;
            })
            if (res.data.result && res.data.result.length > 0) {
                // this.saveData.tables[0].name = res.data.result[0].code;
                res.data.result[0].columns.forEach(element => {
                    let tempObj = {
                        code: element.code + '·-·' + element.name,
                        value: element.name,

                    }
                    tempFieldArray.push(tempObj);
                })
            }
            // console.log(tempFieldArray);
            this.setState({
                tableList: tempTableArray,
                fieldList: [],
                allField: tempAllField
            })
            this.getNodeDetailById(this.props.nodeId);
        })
    }
    addMappings = () => {
        let tempArray = this.state.mappings;
        this.saveData.queryFields.push({
            "field": "",
            "fieldName": "",
            "table": {
                "aliasName": "",
                "name": ""
            },
            "varCode": "",
            "varName": "",
            "functionType": "",
            "functionCode": "",
            "fieldDistinct": 0,
            "mappingType": 1
        })
        let mappings = this.renderTable(this.saveData.queryFields);
        this.setState({
            mappings
        })
    }

    save() {
        if (common.isEmpty(this.saveData.parentId))
            this.saveData.parentId = null;
        common.loading.show();
        variableService.saveQueryNode(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            this.props.store.setIsCanCommit(true);
            message.success('保存成功');
            sessionStorage.removeItem('isFinishNode');
            this.getNodeDetailById(this.props.nodeId);
        })
    }

    verify = () => {
        if (common.isEmpty(this.saveData.name)) {
            message.warning('节点定义 - 名称 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.tables[0].name)) {
            message.warning('选择表 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.queryFields)) {
            message.warning('映射变量 不能为空');
            return
        }
        for (let i = 0; i < this.saveData.queryFields.length; i++) {
            const element = this.saveData.queryFields[i];
            // console.log(element);
            if (!element.varCode || !element.varName) {
                message.warning('映射变量 - 选择变量名 不能为空');
                return
            }
            if (!element.field || !element.fieldName) {
                message.warning('映射变量 - 来源表字段 不能为空');
                return
            }
            for (let j = 0; j < this.saveData.queryFields.length; j++) {
                const element2 = this.saveData.queryFields[j];
                if (i === j) continue;
                if (element.varCode == element2.varCode) {
                    message.warning('映射变量 - 选择变量名 不能重复');
                    return
                }
            }
            if (element.functionType) {
                Number(element.functionType);
            }


        }
        if (this.saveData.groupFields.length > 0) {
            for (let i = 0; i < this.saveData.groupFields.length; i++) {
                const element = this.saveData.groupFields[i];
                if (!element) {
                    message.warning('分组字段 - 不能有空');
                    return
                }
                for (let j = 0; j < this.saveData.groupFields.length; j++) {
                    const element2 = this.saveData.groupFields[j];
                    if (i === j) continue;
                    if (element === element2) {
                        message.warning("分组字段 - 不能重复");
                        return
                    }
                }
            }
        }
        if (this.saveData.orderFields.length > 0) {
            for (let i = 0; i < this.saveData.orderFields.length; i++) {
                const element = this.saveData.orderFields[i];
                if (!element.field) {
                    message.warning('排序字段 - 不能有空');
                    return
                }
                for (let j = 0; j < this.saveData.orderFields.length; j++) {
                    const element2 = this.saveData.orderFields[j];
                    if (i === j) continue;
                    if (element.field === element2.field) {
                        message.warning("排序字段 - 不能重复");
                        return
                    }
                }
            }

        }
        // console.log(this.saveData);
        if (publicUtils.verifyConditionTree(this.saveData.conditionVO)) {
            this.save();
        }
    }

    subMappings = (key) => {
        let arrayIndex;
        let field;
        for (let i = 0; i < this.state.mappings.length; i++) {
            const element = this.state.mappings[i];
            if (element.key === key) {
                arrayIndex = i;
                field = this.saveData.queryFields[i].field;
                continue
            }
        }
        this.saveData.queryFields.splice(arrayIndex, 1);
        let mappings = this.renderTable(this.saveData.queryFields);
        // this.fillGroupFields();

        let tempArray1 = [];
        let tempArray2 = [];
        this.state.orderFieldsValue.forEach(element => {
            if (element.field !== field) tempArray1.push(element)
        })
        this.saveData.orderFields.forEach(element => {
            if (element.field !== field) tempArray2.push(element)
        })
        this.saveData.orderFields = tempArray2;
        this.setState({
            mappings,
            orderFieldsValue: tempArray1
        })
        if (this.isQueryFieldsFinish()) {
            this.controlNodeTranslateToSql();
        }
    }

    updateSaveData = (key, value) => {
        if (key === 'name') {
            value = common.stripscript(value);
        }
        console.log("updateSaveData = ", key, value);
        this.saveData[key] = value;
        if (key === 'mappingType') {
            this.saveData.groupFields = [];
            this.saveData.orderFields = [];
            this.saveData.queryFields = [];
            this.setState({
                orderFieldsValue: []
            })
            // this.fillGroupFields();

            if (value === 0) {
                this.saveData.queryFields =
                    [{
                        "field": "",
                        "fieldName": "",
                        "table": this.saveData.tables[0],
                        "varCode": sessionStorage.rootProcessTreeCode,
                        "varName": sessionStorage.rootProcessTreeName,
                        "functionType": "",
                        "functionCode": "",
                        "fieldDistinct": 0,
                    }]

            }
            this.resetOrderBySelectData();
            // console.log("this.saveData.queryFields =", this.saveData.queryFields);
        }
        switch (key) {
            case 'name':
                this.saveData.name = this.saveData.name.substr(0, 30);
                break;
            default:
                break;
        }
        this.setState({ index: this.state.index++ })
        if (this.isQueryFieldsFinish()) {
            this.controlNodeTranslateToSql();
        }

    }

    isQueryFieldsFinish() {
        let rs = true;
        for (let i = 0; i < this.saveData.queryFields.length; i++) {
            const element = this.saveData.queryFields[i];
            if (common.isEmpty(element.field)) {
                rs = false;
            }
            if (common.isEmpty(element.fieldName)) {
                rs = false;
            }
            if (common.isEmpty(element.varCode)) {
                rs = false;
            }
            if (common.isEmpty(element.varName)) {
                rs = false;
            }
        }
        return rs
    }

    tableDataChange = (i, name, value) => {
        console.log(` i, name, value = ${i} ${name} ${value}`);
        // console.log(this.saveData.queryFields);
        this.saveData.queryFields[i][name] = value;
        if (name === 'field' || name === 'fieldName' || name === 'varDataType') {
            if (this.saveData.tables && this.saveData.tables.length > 0) {
                this.saveData.queryFields[i].table = this.saveData.tables[0];
            } else {
                message.warning("请先选择表");
                return
            }
            if (name === 'varDataType') {
                this.saveData.queryFields[i].functionType = '';
                this.saveData.queryFields[i].functionCode = '';
                let mappings = this.renderTable(this.saveData.queryFields);
                this.setState({
                    mappings
                })
            }

        }
        if (name === 'functionType') {
            this.saveData.orderFields = [];
            this.setState({
                orderFieldsValue: []
            })
            this.resetOrderBySelectData();
        }
        if (name === 'functionCode') {
            this.saveData.queryFields[i].fieldDistinct = 0;
            let mappings = this.renderTable(this.saveData.queryFields);
            this.setState({
                mappings
            })
        }
        if (this.checkQueryFieldsFinish()) {
            // this.fillGroupFields();
            this.resetOrderBySelectData();
        }
        this.setState({ index: this.state.index++ })
        if (this.isQueryFieldsFinish()) {
            this.controlNodeTranslateToSql();
        }

    }

    controlNodeTranslateToSql(treeDataList) {
        // console.log(treeDataList);
        let data = {
            "relType": 1,
            "nodeType": 2,
            "conditions": treeDataList
        }
        if (this.saveData.conditionVO.id) {
            data.id = this.saveData.conditionVO.id;
        }
        variableService.sqlQueryNode(this.saveData).then(res => {
            if (res.data) {
                this.saveData.sqlCode = res.data.result;
                this.setState({ index: this.state.index++ })
            }
        })
    }


    initTempVarListCallBack = (tempVarList) => {
        this.setState({
            tempVarList: tempVarList
        })
    }

    getNodeDetailById(id) {
        this.saveData.mappingType = 1;
        this.setState({
            mappings: [],
            groupFieldsValue: [],
            orderFieldsValue: []
        })
        variableService.getNodeDetailById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let data = res.data.result;
            this.saveData.id = data.id;
            if (!common.isEmpty(data.mold)) {
                this.saveData.mold = data.mold;
            }
            this.saveData.parentId = data.parentId;
            if (!common.isEmpty(data.sort)) {
                this.saveData.sort = data.sort;
            }

            if (!common.isEmpty(data.parentNodeMap)) {
                let tempParentNodeList = [];
                for (const key in data.parentNodeMap) {
                    if (data.parentNodeMap.hasOwnProperty(key)) {
                        const element = data.parentNodeMap[key];
                        tempParentNodeList.push({
                            code: key,
                            value: element
                        })
                    }
                }
                this.setState({
                    parentNodeList: tempParentNodeList
                })
            } else {
                this.setState({
                    parentNodeList: []
                })
            }

            if (!common.isEmpty(data.conditionVO)) {
                this.saveData.conditionVO = data.conditionVO;
            } else {
                this.saveData.conditionVO = common.deepClone(conditionVODemo);
            }
            this.saveData.rtqId = data.rtqId;
            this.saveData.secondType = data.secondType;
            this.saveData.type = data.type;
            this.saveData.selectId = data.selectId;
            this.saveData.name = data.name;
            if (!common.isEmpty(data.mappingType)) {
                this.saveData.mappingType = data.mappingType;
            }

            if (!common.isEmpty(data.tables)) {
                let tempArray = [];
                this.saveData.tables = data.tables;
                this.state.allField[data.tables[0].name].forEach(element => {
                    tempArray.push({
                        code: element.code,
                        value: element.name,
                        varDataType: element.type
                    });
                });

                this.setState({
                    fieldList: tempArray
                })
            }
            if (!common.isEmpty(data.queryFields)) {
                this.saveData.queryFields = data.queryFields;
            }
            if (!common.isEmpty(data.havingConditionVO)) {
                this.saveData.havingConditionVO = data.havingConditionVO;
            }
            if (!common.isEmpty(data.groupFields)) {
                this.saveData.groupFields = data.groupFields;
            } else {
                this.saveData.groupFields = [];
            }
            if (!common.isEmpty(data.orderFields)) {
                this.saveData.orderFields = data.orderFields;
            } else {
                this.saveData.orderFields = [];
            }

            let tempGroupFields = [];
            if (!common.isEmpty(data.groupFields)) {
                data.groupFields.forEach(element => {
                    tempGroupFields.push(element);
                })
            }

            let tempOrderFields = [];
            if (!common.isEmpty(data.orderFields)) {
                console.log("orderFieldsValue2", data.orderFields);
                data.orderFields.forEach(element => {
                    if (element.field.indexOf(')') != -1 && element.field.indexOf('(')) {
                        element.field = element.field.split('(')[1].split(')')[0];
                    }
                    tempOrderFields.push(`${element.field}·-·${element.order}`);

                })
            }
            if (!common.isEmpty(data.tables)) {
                this.saveData.tables = data.tables;
            } else {
                this.saveData.tables = [{
                    "aliasName": "",
                    "name": ""
                }]
            }
            this.saveData.sqlCode = data.sqlCode;
            let tempMappingArray = [];
            if (!common.isEmpty(data.queryFields)) {
                if (data.mappingType === 1) {
                    tempMappingArray = this.renderTable(data.queryFields);
                } else {

                }
                this.resetOrderBySelectData();
            }


            this.setState({
                mappings: tempMappingArray,
                groupFieldsValue: tempGroupFields,
                orderFieldsValue: tempOrderFields
            })

            // console.log('testing.....');
            // console.log("groupFieldsValue", tempGroupFields);
            console.log("orderFieldsValue", tempOrderFields);

        })
    }

    checkQueryFieldsFinish() {
        let rs = true
        if (!common.isEmpty(this.saveData.queryFields)) {
            for (let i = 0; i < this.saveData.queryFields.length; i++) {
                const element = this.saveData.queryFields[i];
                if (common.isEmpty(element.field)) rs = false;
                if (common.isEmpty(element.fieldName)) rs = false;
                if (common.isEmpty(element.varCode)) rs = false;
                if (common.isEmpty(element.varName)) rs = false;
                if (common.isEmpty(element.varDataType)) rs = false;
            }
        }
        return rs
    }

    // fillGroupFields() {
    //     let tempArray = [];
    //     if (!common.isEmpty(this.saveData.queryFields)) {
    //         for (let i = 0; i < this.saveData.queryFields.length; i++) {
    //             const element = this.saveData.queryFields[i];
    //             tempArray.push(element.field);
    //         }
    //     }
    //     this.saveData.groupFields = tempArray;
    //     this.setState({
    //         index: this.state.index++
    //     })
    // }

    resetOrderBySelectData() {
        console.log("this.saveData.queryFields", this.saveData.queryFields)
        let tempArray = [];
        let tempArray2 = [];
        if (!common.isEmpty(this.saveData.queryFields)) {
            for (let i = 0; i < this.saveData.queryFields.length; i++) {
                const element = this.saveData.queryFields[i];
                tempArray.push({
                    code: element.field,
                    value: element.fieldName,
                    field: element.field
                });
            }

            let obj = {};
            let tempArray3 = [];
            for (let i = 0; i < tempArray.length; i++) {
                const element = tempArray[i];
                if (!obj[element.code]) {
                    tempArray3.push(element);
                    obj[element.code] = true;
                }
            }


            tempArray3.forEach(element => {
                this.saveData.queryFields.forEach(element2 => {
                    if (element.field == element2.field) {
                        if (common.isEmpty(element2.functionType)) {
                            element.code = element2.field;
                            element.value = element.field;
                            element.formatField = element.field;
                        } else {
                            element.code = `${element2.functionCode}(${element2.field})`;
                            element.value = `${element2.functionCode}(${element2.field})`;
                            element.formatField = `${element2.functionCode}(${element2.field})`;
                        }
                    }
                })
            })



            tempArray3.forEach(element => {
                tempArray2.push({
                    code: element.field + '·-·asc',
                    value: element.value + ' ↑升序',
                    field: element.field,
                    formatField: element.formatField
                })
                tempArray2.push({
                    code: element.field + '·-·desc',
                    value: element.value + ' ↓降序',
                    field: element.field,
                    formatField: element.formatField
                })
            })

        }
        this.setState({
            simpleFieldList: tempArray2
        })

    }


    renderTable(list) {
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                c1: this.saveData.mappingType == 1 ? <Select defaultValue={element.varName} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'varCode', value.split('·-·')[0]); this.tableDataChange(i, 'varName', option.props.children) }}>
                    {this.state.tempVarList.map((item, j) =>
                        <Select.Option value={item.code}>{item.value}</Select.Option>
                    )}
                </Select> : sessionStorage.rootProcessTreeName,
                c2: <Select defaultValue={element.fieldName} style={{ width: '150px' }} onChange={(value, option) => { this.tableDataChange(i, 'field', value); this.tableDataChange(i, 'fieldName', option.props.children); this.tableDataChange(i, 'varDataType', option.props.varDataType); }}>
                    {this.state.fieldList.map((item, j) =>
                        <Select.Option varDataType={item.varDataType} value={item.code}>{item.value}</Select.Option>
                    )}
                </Select>,
                c3: (() => {
                    switch (this.getVarDataType(element.varDataType)) {
                        case 'string':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForString.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'int':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNumber.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'float':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNumber.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'boolean':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForBoolean.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        case 'time':
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForDate.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                        default:
                            return <Select defaultValue={common.isEmpty(element.functionCode) ? '' : element.functionCode} style={{ width: '109px' }} onChange={(value, option) => { this.tableDataChange(i, 'functionType', value); this.tableDataChange(i, 'functionCode', common.isEmpty(value) ? '' : option.props.children); }}>
                                {functionListForNull.map((item, j) =>
                                    <Select.Option value={item.val}>{item.label}</Select.Option>
                                )}
                            </Select>
                    }
                })(),
                c4: <Switch checkedChildren="开" disabled={common.isEmpty(element.functionCode) ? true : false} defaultChecked={this.saveData.queryFields[i].fieldDistinct == 1 ? true : false} unCheckedChildren="关" onChange={(checked) => { this.tableDataChange(i, 'fieldDistinct', checked ? 1 : 0); }} />,
                c5: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subMappings(uuid) }} /></a>
            })
        }

        return tempArray
    }

    getVarDataType = (dataType) => {
        let rs = null;
        if (typeof dataType === 'string')
            dataType = Number(dataType)

        switch (dataType) {
            case 12:
                rs = 'string';
                break;
            case -3:
                rs = 'string';
                break;
            case -5:
                rs = 'int';
                break;
            case 4:
                rs = 'int';
                break;
            case -6:
                rs = 'int';
                break;
            case 5:
                rs = 'int';
                break;
            case 3:
                rs = 'float';
                break;
            case 2:
                rs = 'float';
                break;
            case 6:
                rs = 'float';
                break;
            case 16:
                rs = 'boolean';
                break;
            case 93:
                rs = 'time';
                break;
            case 1111:
                rs = 'string';
                break;
            default:
                break;
        }
        return rs
    }

    render() {
        function callback(key) {
            // console.log(key);
        }
        // console.log("this.saveData.queryFields", this.saveData.queryFields);
        const Panel = Collapse.Panel;
        let dataSource = common.isEmpty(this.saveData.queryFields) ? [] : this.renderTable(this.saveData.queryFields);

        const columns = [{
            title: '映射变量',
            dataIndex: 'c1',
            key: 'c1',
        }, {
            title: '来源表字段',
            dataIndex: 'c2',
            key: 'c2',
        }, {
            title: '计算函数',
            dataIndex: 'c3',
            key: 'c3',
        }, {
            title: '是否去重',
            dataIndex: 'c4',
            key: 'c4',
        }];

        const columns2 = [{
            title: '映射变量',
            dataIndex: 'c1',
            key: 'c1',
        }, {
            title: '来源表字段',
            dataIndex: 'c2',
            key: 'c2',
        }, {
            title: '计算函数',
            dataIndex: 'c3',
            key: 'c3',
        }, {
            title: '是否去重',
            dataIndex: 'c4',
            key: 'c4',
        }, {
            title: '',
            dataIndex: 'c5',
            key: 'c5',
        }];

        return (
            <div className="pageContent" style={{ marginLeft: '10px', height: '100%', padding: '0 0 64px 0' }}>
                <FormHeader title={this.saveData.name} style={{ padding: '32px 0px 0px 32px' }} ></FormHeader>
                <div style={{ marginTop: '20px' }}>
                    <FormBlock header="节点定义">
                        <Form>
                            <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                            <FormItem name="父节点" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="parentId" defaultValue={this.saveData.parentId ? this.saveData.parentId : sessionStorage.rootProcessTreeName} selectData={this.state.parentNodeList}></FormItem>

                            {
                                this.props.type === 'rtq' ?
                                    <FormItem name="变量映射" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="mappingType" defaultValue={this.saveData.mappingType} selectData={[{ code: 0, value: '实时变量映射' }, { code: 1, value: '临时变量映射' }]}></FormItem>
                                    : ''
                            }
                        </Form>
                    </FormBlock>
                    <FormBlock header="选择表/字段">
                        <div style={{ width: '100%', marginBottom: '24px', float: 'left', marginLeft: '13px' }}>
                            <p style={{ float: 'left', margin: '0 10px 0 0', height: '32px', lineHeight: '32px' }}>
                                选择表：</p>
                            <Select
                                style={{ float: 'left', width: '440px' }}
                                value={this.saveData.tables[0].name}
                                onChange={(value) => {
                                    let tempArray = [];
                                    let tempArray2 = [];
                                    this.saveData.tables[0].name = value;
                                    this.state.allField[value].forEach(element => {
                                        tempArray.push({
                                            code: element.code,
                                            value: element.name,
                                            varDataType: element.type
                                        });
                                        tempArray2.push({
                                            code: element.code,
                                            value: element.name
                                        });
                                    });
                                    this.saveData.orderFields = [];
                                    if (this.saveData.mappingType == 1) {
                                        this.saveData.queryFields = [];
                                    } else {
                                        this.saveData.queryFields = [{
                                            "field": "",
                                            "fieldName": "",
                                            "table": this.saveData.tables[0],
                                            "varCode": sessionStorage.rootProcessTreeCode,
                                            "varName": sessionStorage.rootProcessTreeName,
                                            "functionType": "",
                                            "functionCode": "",
                                            "fieldDistinct": 0
                                        }];
                                    }
                                    // console.log("this.saveData.queryFields =", this.saveData.queryFields);
                                    this.saveData.groupFields = [];
                                    this.saveData.conditionVO.conditions = [{
                                        "relType": 1,
                                        "expressionVO": {
                                            "varCode": "",
                                            "varName": "",
                                            "varType": "",
                                            "optType": "",
                                            "value": "",
                                            "valueType": 0,
                                            "valueCode": "",
                                            "valueName": ""
                                        },
                                        "nodeType": 1
                                    }];
                                    // console.log("fieldList  = ", tempArray);
                                    this.setState({
                                        fieldList: tempArray,
                                        simpleFieldList: [],
                                        orderFieldsValue: [],
                                        groupFieldsValue: [],
                                        mappings: []
                                    })
                                    // this.controlNodeTranslateToSql();
                                }}
                            >
                                {
                                    this.state.tableList.map((item, i) =>
                                        <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                                    )
                                }
                            </Select>
                        </div>
                        <div style={{ width: '100%', marginBottom: '24px', float: 'left' }}>
                            <p style={{ float: 'left', margin: '0 10px 0 0', height: '32px', lineHeight: '32px' }}>
                                分组字段：</p>
                            <Select
                                style={{ float: 'left', width: '440px' }}
                                mode="multiple"
                                value={this.state.groupFieldsValue}
                                onChange={(value, option) => {
                                    this.saveData.groupFields = value;
                                    this.setState({ groupFieldsValue: value });
                                    this.controlNodeTranslateToSql();
                                }}
                            >
                                {
                                    this.state.fieldList.map((item, i) =>
                                        <Select.Option value={item.code} varDataType={item.varDataType} index={i}>{item.value}</Select.Option>
                                    )
                                }
                            </Select>
                        </div>
                        <div style={{ width: '100%', marginBottom: '24px', float: 'left' }}>
                            <p style={{ float: 'left', margin: '0 10px 0 0', height: '32px', lineHeight: '32px' }}>
                                排序字段：</p>
                            <Select
                                style={{ float: 'left', width: '440px' }}
                                mode="multiple"
                                value={this.state.orderFieldsValue}
                                onChange={(value, option) => {
                                    console.log("option", option, this.state.simpleFieldList)
                                    let tempArray1 = [];
                                    let tempArray2 = [];
                                    for (let i = 0; i < value.length; i++) {
                                        const element = value[i];
                                        let field = element.split("·-·")[0];
                                        let order = element.split("·-·")[1];
                                        tempArray1.push({
                                            table: this.saveData.tables[0],
                                            field: option[i].props.formatField,
                                            order: order
                                        })
                                        tempArray2.push(field + '·-·' + order)
                                    }
                                    this.saveData.orderFields = tempArray1;
                                    this.setState({
                                        orderFieldsValue: tempArray2
                                    })
                                    this.controlNodeTranslateToSql();
                                }}
                            >
                                {
                                    this.state.simpleFieldList.map((item, i) =>
                                        <Select.Option value={item.code} formatField={item.formatField}>{item.value}</Select.Option>
                                    )
                                }
                            </Select>
                        </div>
                    </FormBlock>

                    {
                        this.saveData.mappingType == 0 ?
                            <FormBlock header="添加实时变量映射">
                                <Table dataSource={dataSource} columns={columns} pagination={false} />
                            </FormBlock>
                            :
                            <FormBlock header="添加临时变量映射">
                                <Table dataSource={this.state.mappings} columns={columns2} pagination={false} />
                                <Button type="dashed" block style={{ marginTop: '10px' }} onClick={this.addMappings}><Icon type="plus" theme="outlined" />添加映射</Button>
                            </FormBlock>
                    }



                    {/* <FormBlock header="分组字段">
                        <SelectGroup firstTitle="按" secondTitle="和" valueList={this.state.groupFieldsValue} selectData={this.state.fieldList} selectGroupChange={this.selectGroupChange} resultName="groupFields" selectGroupAddAndSubCallBack={this.selectGroupAddAndSubCallBack} />
                    </FormBlock>
                    <FormBlock header="添加排序字段">
                        <SelectGroup firstTitle="按" secondTitle="和" valueList={this.state.orderFieldsValue} selectData={this.state.simpleFieldList} selectGroupChange={this.selectGroupChange} resultName="orderFields" selectGroupAddAndSubCallBack={this.selectGroupAddAndSubCallBack} />
                    </FormBlock> */}
                    <FormBlock header="过滤" style={{ minWidth: '260px', overflowX: 'auto' }}>
                        <TreePanel translateToSql={this.controlNodeTranslateToSql} allVarListTypeForm={this.props.type} id={this.props.id} type="query" fieldList={this.state.fieldList} initTempVarListCallBack={this.initTempVarListCallBack} updateConditionTree={this.updateConditionTree} treeData={this.saveData.conditionVO} treeDataCallBack={this.treeDataCallBack} />
                    </FormBlock>
                    <FormBlock header="SQL">
                        <Code sqlCode={this.saveData.sqlCode} />
                    </FormBlock>
                </div>
                <FormButtonGroup
                    cancelCallBack={() => this.props.history.goBack()}
                    saveCallBack={this.verify}
                    isFixed={true}
                />
            </div>
        )
    }
}
Query.propTypes = {
    type: PropTypes.oneOf(['rtq', 'rule', 'strategy'])
}
export default Query;