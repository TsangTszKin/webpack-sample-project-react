/*
 * @Author: zengzijian
 * @Date: 2018-08-22 16:41:34
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-16 14:54:18
 * @Description: 衍生变量保存页面级组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/variable/ext/Save';
import PageHeader from '@/components/PageHeader';
import FormHeader from '@/components/FormHeader';
import Form from '@/components/Form';
import FormItem from '@/components/FormItem';
import { Collapse, message, Select } from 'antd';
import FormButtonGroup from '@/components/FormButtonGroup';
import Calculator from '@/components/business/variable/derivation/Calculator';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import variableService from '@/api/business/variableService';
import '@/styles/business/variable/saveCount.less';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';

@withRouter
@observer
class SaveCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventSourceList: [],
            dimensionList: [],
            index: 0,
            extRealdy: false,
            dataTypeList: []
        }
        this.getInitDataList = this.getInitDataList.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.valueResult = this.valueResult.bind(this);
        this.valueDescResult = this.valueDescResult.bind(this);
        this.addRequiredVars = this.addRequiredVars.bind(this);
        this.getExtVarById = this.getExtVarById.bind(this);

        this.saveData = {
            "name": "",
            "code": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "",
            "type": 0,//类型 0计算变量 1正则变量 2函数变量
            "typeLabel": "计算变量",
            "defaultValue": "",
            "description": "",
            "category": '',
            "categoryName": "",
            "dataType": '',//数据类型
            "dataTypeLabel": '',//dataTypeLabel
            "expression": "",
            "expressionDesc": '',
            "requiredVars": ""
        }
    }
    componentDidMount() {
        if (common.isEmpty(this.props.match.params.id)) {
            this.getInitDataList();
            this.getDataTypeList();
        } else {
            this.getExtVarById(this.props.match.params.id);
        }

    }
    getDataTypeList() {
        variableService.getDataTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.val + '·-·' + element.label,
                    value: element.label
                });
            })
            this.setState({
                dataTypeList: tempArray
            })
        })
    }
    componentWillReceiveProps(nextProp) {
        if (nextProp.match.params.id !== this.props.match.params.id) {
            this.getExtVarById(nextProp.match.params.id);
        }
    }
    verify() {
        console.log(this.saveData);
        if (common.isEmpty(this.saveData.name)) {
            message.warning("基础信息 - 名称 不能为空");
            return
        }
        if (common.isEmpty(this.saveData.code)) {
            message.warning("基础信息 - 名称 不能为空");
            return
        }
        if (this.saveData.code.indexOf("ev_d_") !== 0) {
            message.warning('基本信息 - 标识 必须以 ev_d_ 开头');
            return
        }
        if (common.isEmpty(this.saveData.eventSourceId)) {
            message.warning('基本信息 - 事件源 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.dimensionId)) {
            message.warning('基本信息 - 维度 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.type)) {
            message.warning('基本信息 - 数据类型 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.defaultValue)) {
            message.warning('基本信息 - 默认值 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.category)) {
            message.warning('基本信息 - 类别 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.expression)) {
            message.warning('计算表达式 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.expressionDesc)) {
            message.warning('计算表达式 不能为空');
            return
        }

        common.loading.show();
        variableService.saveExtVar(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            this.props.history.push(`/business/variable/derivation/save-count/${res.data.result.id}`);
        }).catch(() => {
            common.loading.hide();
        });

    }

    getExtVarById(id) {
        variableService.getExtVarById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let data = common.deepClone(res.data.result);
            if (!common.isEmpty(data.vars)) delete data.vars;
            if (!common.isEmpty(data.dicts)) delete data.dicts;
            this.saveData = data;
            if (!common.isEmpty(this.saveData.eventSourceId) && !common.isEmpty(this.saveData.dimensionId)) {
                sessionStorage.tempEventSourceId = this.saveData.eventSourceId;
                sessionStorage.tempDimensionId = this.saveData.dimensionId;
                this.setState({
                    extRealdy: true
                })
            }
            this.setState({
                index: 0
            })
        })

    }

    getInitDataList = () => {
        let self = this;
        variableService.getEventSourceSelectList(true).then(res => {
            if (!publicUtils.isOk(res)) return
            let array1 = [];
            let temp2 = {};
            res.data.result.forEach(element => {
                if (element.dimensionVOS.length <= 0) return;
                let temp1 = {};

                let tempArray = [];
                temp1.code = element.eventSourceId + '·-·' + element.eventSourceType;
                temp1.value = element.eventSourceType;
                element.dimensionVOS.forEach(element1 => {
                    tempArray.push({ code: element1.dimensionId + '·-·' + element1.dimensionName, value: element1.dimensionName })
                })
                temp2[element.eventSourceId + '·-·' + element.eventSourceType] = tempArray;
                array1.push(temp1);
            });
            // console.log(array1);
            // console.log(temp2);
            self.setState({
                eventSourceList: array1,
                dimensionListAll: temp2
            })
        })
    }
    updateSaveData = (key, value, isBatch) => {
        if (key === 'name' || key === 'code') {
            value = common.stripscript(value);
        }
        console.log("data-change", key, value)
        
        if (isBatch) {
            for (let i = 0; i < key.length; i++) {
                const element = key[i];
                this.saveData[element] = value[i];
            }
            if (key.indexOf('eventSourceId') >= 0 || key.indexOf('eventSourceName') >= 0) {
                this.saveData.dimensionId = '';
                this.saveData.dimensionName = '';
                this.setState({
                    dimensionList: this.state.dimensionListAll[value[0] + '·-·' + value[1]],
                });
            }
            if (key.indexOf('dimensionId') >= 0 || key.indexOf('dimensionName') >= 0) {
                if (!common.isEmpty(this.saveData.eventSourceId) && !common.isEmpty(this.saveData.dimensionId)) {
                    sessionStorage.tempEventSourceId = this.saveData.eventSourceId;
                    sessionStorage.tempDimensionId = this.saveData.dimensionId;
                    this.setState({
                        extRealdy: true
                    })
                }
            }
        } else {
            if (key === 'code') {
                this.saveData.code = value.replace(/[^\w_]/g, '');
            } else {
                this.saveData[key] = value;
            }
        }



        this.setState({
            index: this.state.index++
        })
    }

    valueResult(value) {
        console.log("valueResult value", value);
        if (value == '') this.saveData.requiredVars = '';
        // if (value.indexOf('()') != -1)
        //     return
        this.saveData.expression = value;
        this.setState({
            index: this.state.index
        })
    }

    valueDescResult(value) {
        console.log("valueDescResult value", value);
        if (value == '') this.saveData.requiredVars = '';
        // if (value.indexOf('()') != -1)
        //     return
        this.saveData.expressionDesc = value;
        this.setState({
            index: this.state.index
        })
    }

    addRequiredVars(value) {
        let array = common.deepClone(common.stringToArray(this.saveData.requiredVars));
        array.push(value);
        this.saveData.requiredVars = common.arrayToString(array);
    }

    render() {

        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent" style={{ padding: '0 0 64px 0' }}>
                        <FormHeader title="计算变量" style={{ padding: '32px 0px 0px 32px' }}></FormHeader>
                        <div style={{ marginTop: '20px' }}>
                                <FormBlock header="基本信息">
                                    <Form>
                                        <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                                        <FormItem name="标识" placeHolder="请输入以ev_d_开头的标识" disabled={this.props.match.params.id ? true : false} type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="code" defaultValue={this.saveData.code}></FormItem>
                                        <FormItem name="事件源" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={["eventSourceId", "eventSourceName"]} selectData={this.state.eventSourceList} defaultValue={this.saveData.eventSourceName}></FormItem>
                                        <FormItem name="维度" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['dimensionId', 'dimensionName']} selectData={this.state.dimensionList} defaultValue={this.saveData.dimensionName}></FormItem>
                                        <FormItem name="数据类型" type="select" disabled={this.props.match.params.id ? true : false} isNotNull={true} changeCallBack={this.updateSaveData} code={["dataType", "dataTypeLabel"]} selectData={this.state.dataTypeList} defaultValue={this.saveData.dataTypeLabel}></FormItem>
                                        <FormItem name="默认值" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="defaultValue" dataType={this.saveData.dataType} defaultValue={this.saveData.defaultValue}></FormItem>
                                        <FormItem name="类型" type="select" disabled={true} isNotNull={true} defaultValue={0} selectData={[{ code: 0, value: '计算变量' }]}></FormItem>
                                        <FormItem name="类别" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['category', 'categoryName']} categoryType="ext" defaultValue={this.saveData.categoryName}></FormItem>
                                        <FormItem name="描述" type="textarea" isNotNull={false} changeCallBack={this.updateSaveData} code="description" defaultValue={this.saveData.description}></FormItem>
                                    </Form>
                                </FormBlock>
                                <FormBlock header="计算方式" style={{ overflowX: 'scroll' }}>
                                    <div style={{ height: '90px', padding: '18px', border: '1px solid gainsboro', borderRadius: '5px', marginBottom: '20px' }}>
                                        <p title={this.saveData.name} style={{ overflowX: "auto", width: '30%', float: 'left', height: '60px', lineHeight: '60px' }}>
                                            {this.saveData.name}
                                        </p>
                                        <p style={{ textAlign: 'center', width: '10%', float: 'left', height: '60px', lineHeight: '60px', display: common.isEmpty(this.saveData.name) ? 'none' : 'block' }}>=</p>
                                        <p id="count-show-panel" title={this.saveData.expressionDesc}>
                                            {
                                                this.saveData.expressionDesc
                                            }
                                        </p>
                                    </div>
                                    <Calculator eventSourceId={this.saveData.eventSourceId} dimensionId={this.saveData.dimensionId} extRealdy={this.state.extRealdy} value={this.saveData.expressionDesc} valueCode={this.saveData.expression} valueResult={this.valueResult} valueDescResult={this.valueDescResult} addRequiredVars={this.addRequiredVars} />
                                </FormBlock>
                        </div>
                        <FormButtonGroup
                            cancelCallBack={() => this.props.history.push('/business/variable/derivation')}
                            saveCallBack={() => { this.verify() }}
                        />
                    </div>
                </div>
            </Provider >
        )
    }
}
export default SaveCount;
