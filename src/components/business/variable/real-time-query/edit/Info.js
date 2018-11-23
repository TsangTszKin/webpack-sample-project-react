import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Table, Button, message, Input, Select, Spin, Icon } from 'antd';
import '@/styles/business/variable/real-time-query-edit.less';
import AddSub from '@/components/process-tree/AddSub';
import FormButtonGroup from '@/components/FormButtonGroup';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import common from '@/utils/common';
import Code from '@/components/Code';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject } from 'mobx-react';

function callback(key) {
    console.log(key);
}


const columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '标识',
    dataIndex: 'code',
    key: 'code',
}, {
    title: '数据类型',
    dataIndex: 'type',
    key: 'type',
}, {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
}, {
    title: '',
    dataIndex: 'action',
    key: 'action',
}];

@withRouter
@inject('store')
class Info extends Component {
    constructor(props) {
        super(props);
        this.getInitDataList = this.getInitDataList.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.subTempVars = this.subTempVars.bind(this);
        this.addTempVar = this.addTempVar.bind(this);
        this.tableDataChange = this.tableDataChange.bind(this);
        this.verify = this.verify.bind(this);
        this.save = this.save.bind(this);
        this.getRtqVarById = this.getRtqVarById.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.changeCode = this.changeCode.bind(this);
        this.initSaveData = this.initSaveData.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.state = {
            eventSourceList: [],
            dimensionList: [],
            dimensionListAll: [],
            tempVars: [],
            index: 0,
            dataTypeList: [],
            isLoading: false,
            model: 0
        }
        this.saveData = {
            "name": "",
            "code": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "",
            "type": '',
            "defaultValue": "",
            "description": "",
            "approvalStatus": '',
            "autoEnabled": false,
            "category": '',
            "categoryName": '',
            "mode": 0,
            "status": 0,
            "tempVars": [
                //     {
                //     "code": "v_trade_num",
                //     "defaultValue": "0",
                //     "name": "交易总金额",
                //     "type": 1
                // }
            ],
            "script": ''


        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.script !== this.props.script && this.saveData.script) {
            this.saveData.script = nextProps.script;
        }
    }

    componentDidMount() {
        this.getInitDataList();
        this.getDataTypeList();
        if (this.props.match.params.id) {
            this.props.store.setCommitId(this.props.match.params.id);
        }
    }

    getDataTypeList() {
        variableService.getDataTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.val,
                    value: element.label
                });
            })
            this.setState({
                dataTypeList: tempArray
            })
        })
    }

    save = () => {
        common.loading.show();
        variableService.saveRtqVar(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            if (!common.isEmpty(this.saveData.rtdRtqVarId)) {
                this.props.store.setIsCanCommit(true);
            }
            sessionStorage.removeItem('isFinishNode');
            sessionStorage.rootProcessTreeName = this.saveData.name;
            if (!this.props.match.params.id) {
                message.success('保存成功', 1, () => this.props.history.replace({ pathname: '/business/variable/real-time-query/save/' + res.data.result.id }));
            } else {
                message.success('保存成功');
                this.getInitDataList();
                this.getDataTypeList();
                this.props.reRender();
            }
        });
    }

    verify() {
        // console.log("tempVars", this.saveData.tempVars)
        if (common.isEmpty(this.saveData.name)) {
            message.warning('基本信息 - 名称 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.code)) {
            message.warning('基本信息 - 标识 不能为空');
            return
        }
        if (this.saveData.code.indexOf("rv_") !== 0) {
            message.warning('基本信息 - 标识 必须以 rv_ 开头');
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
        if (common.isEmpty(this.saveData.category)) {
            message.warning('基本信息 - 类别 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.defaultValue)) {
            message.warning('基本信息 - 默认值 不能为空');
            return
        } else {
            this.saveData.defaultValue = String(this.saveData.defaultValue).substr(0, 255);
        }
        if (this.state.model === 0) {
            for (let i = 0; i < this.saveData.tempVars.length; i++) {
                const element = this.saveData.tempVars[i];
                if (element.code === 0) continue;
                if (common.isEmpty(element.name)) {
                    message.warning('临时变量 - 变量名称 不能为空');
                    return
                }
                if (common.isEmpty(element.code)) {
                    message.warning('临时变量 - 变量标识 不能为空');
                    return
                }
                if (common.isEmpty(element.type)) {
                    message.warning('临时变量 - 数据类型 不能为空');
                    return
                }
                if (common.isEmpty(element.defaultValue)) {
                    message.warning('临时变量 - 默认值 不能为空');
                    return
                }
                if (element.name.length > 30) {
                    message.warning('临时变量 - 变量名称 不能超过30个字符');
                    return
                }
                if (element.code.length > 30) {
                    message.warning('临时变量 - 变量标识 不能超过30个字符');
                    return
                }
                if (element.defaultValue.length > 30) {
                    message.warning('临时变量 - 变量默认值 不能超过255个字符');
                    return
                }
                for (let j = 0; j < this.saveData.tempVars.length; j++) {
                    if (i === j) continue
                    const element2 = this.saveData.tempVars[j];
                    if (element.name == element2.name) {
                        message.warning('临时变量 - 变量名称 不能重复');
                        // console.log(element.name , element2.name)
                        return
                    }
                    if (element.code == element2.code) {
                        message.warning('临时变量 - 变量标识 不能重复');
                        return
                    }
                }
            }
        } else {
            if (common.isEmpty(this.saveData.script)) {
                message.warning('SQL脚本 不能为空');
                return
            }
        }


        this.save();
        console.log("this.saveData  =", this.saveData);

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
                this.setState({
                    dimensionList: this.state.dimensionListAll[value[0] + '·-·' + value[1]],
                });
            }
        } else {
            if (key === 'code') {
                this.saveData.code = value.replace(/[^\w_]/g, '');
            } else {
                this.saveData[key] = value;
            }
            switch (key) {
                case 'name':
                    this.saveData.name = this.saveData.name.substr(0, 30);
                    break;
                case 'code':
                    this.saveData.code = this.saveData.code.substr(0, 30);
                    break;
                case 'description':
                    this.saveData.description = this.saveData.description.substr(0, 255);
                    break;
                case 'type':
                    this.saveData.defaultValue = '';
                    break;

                default:
                    break;
            }
        }

        this.setState({
            index: this.state.index++
        })
    }

    subTempVars = (key) => {
        var tempArray = [];
        let arrayIndex;
        for (let i = 0; i < this.state.tempVars.length; i++) {
            const element = this.state.tempVars[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
            tempArray.push(element);
        }
        this.saveData.tempVars.splice(arrayIndex, 1);
        var tempArray2 = this.renderTable(this.saveData.tempVars);

        this.setState({
            tempVars: tempArray2
        })
    }

    tableDataChange = (i, name, value) => {
        console.log(`${i}  ${name}  ${value}`);
        if (name === 'code') {
            this.saveData.tempVars[i][name] = value.replace(/[^\w_]/g, '');
        } else {
            this.saveData.tempVars[i][name] = value;
        }
        if (name === 'type') {
            this.saveData.tempVars[i].defaultValue = '';
            this.setState({
                tempVars: this.renderTable(this.saveData.tempVars)
            })
        }
        console.log('this.saveData.tempVars', this.saveData.tempVars);
        this.setState({
            index: this.state.index++
        })
    }

    addTempVar = () => {
        let tempArray = this.state.tempVars;
        const key = tempArray.length;
        let uuid = common.getGuid();
        tempArray.push({
            key: uuid,
            name: <Input style={{ width: '120px' }} onChange={(e) => this.tableDataChange(key, 'name', e.target.value)} />,
            code: <Input style={{ width: 'auto' }} onChange={(e) => this.tableDataChange(key, 'code', e.target.value)} />,
            type: <Select style={{ width: '109px' }} onChange={(value) => this.tableDataChange(key, 'type', value)}>
                {this.state.dataTypeList.map((item, i) =>
                    <Select.Option value={item.code}>{item.value}</Select.Option>
                )}
            </Select>,
            defaultValue: <FixedValue type="defaultValueForList" changeData={this.tableDataChange} index={key} />,
            action: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subTempVars(uuid) }} /></a>
        });
        this.saveData.tempVars.push({
            "code": "",
            "defaultValue": "",
            "name": "",
            "type": ""
        })
        this.setState({
            tempVars: tempArray
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

            // self.saveData.eventSourceId = array1[0].code;
            // self.saveData.dimensionId = temp2[array1[0].code];
            if (this.props.match.params.id) {
                this.getRtqVarById(this.props.match.params.id);
            }
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
                name: <Input defaultValue={element.name} style={{ width: '120px' }} onChange={(e) => this.tableDataChange(i, 'name', e.target.value)} />,
                code: <Input disabled={common.isEmpty(this.saveData.tempVars[i].id) ? false : true} style={{ width: 'auto' }} title={element.code} defaultValue={element.code} onChange={(e) => this.tableDataChange(i, 'code', e.target.value)} />,
                type: <Select defaultValue={element.type} style={{ width: '109px' }} onChange={(value) => this.tableDataChange(i, 'type', value)} >
                    {this.state.dataTypeList.map((item, i) =>
                        <Select.Option value={item.code}>{item.value}</Select.Option>
                    )}
                </Select>,
                defaultValue: <FixedValue type="defaultValueForList" value={element.defaultValue} changeData={this.tableDataChange} dataType={element.type} index={i} />,
                action: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subTempVars(uuid) }} /></a>

            })
        }

        return tempArray
    }

    initSaveData(data) {
        this.saveData.id = data.id;
        this.saveData.name = data.name;
        this.saveData.code = data.code;
        this.saveData.mode = data.mode;
        this.saveData.eventSourceId = data.eventSourceId;
        this.saveData.dimensionId = data.dimensionId;
        this.saveData.status = data.status;
        if (!common.isEmpty(data.createdTime)) {
            this.saveData.createdTime = data.createdTime;
        }
        if (!common.isEmpty(data.createdUser)) {
            this.saveData.createdUser = data.createdUser;
        }
        if (!common.isEmpty(data.tenantId)) {
            this.saveData.tenantId = data.tenantId;
        }
        if (!common.isEmpty(data.onlineTime)) {
            this.saveData.onlineTime = data.onlineTime;
        }
        if (!common.isEmpty(data.onlineUser)) {
            this.saveData.onlineUser = data.onlineUser;
        }
        if (!common.isEmpty(data.offlineTime)) {
            this.saveData.offlineTime = data.offlineTime;
        }
        if (!common.isEmpty(data.offlineUser)) {
            this.saveData.offlineUser = data.offlineUser;
        }
        if (!common.isEmpty(data.organization)) {
            this.saveData.organization = data.organization;
        }
        if (!common.isEmpty(data.version)) {
            this.saveData.version = data.version;
        }
        if (!common.isEmpty(data.approvalId)) {
            this.saveData.approvalId = data.approvalId;
        }
        if (!common.isEmpty(data.approvalStatus)) {
            this.saveData.approvalStatus = data.approvalStatus;
        }
        if (!common.isEmpty(data.description)) {
            this.saveData.description = data.description;
        }
        if (data.category)
            this.saveData.category = data.category;
        if (data.categoryName)
            this.saveData.categoryName = data.categoryName;

        if (data.treeNode) {
            this.saveData.treeNode = data.treeNode;
        }
        if (data.eventSourceName) {
            this.saveData.eventSourceName = data.eventSourceName;
        }
        if (data.dimensionName) {
            this.saveData.dimensionName = data.dimensionName;
        }
        this.saveData.defaultValue = data.defaultValue;
        this.saveData.type = data.type;
        if (!common.isEmpty(data.type)) {
            sessionStorage.rtqType = data.type;
        }
        this.saveData.script = data.script;
        this.saveData.description = data.description;
        this.saveData.tempVars = data.tempVars ? data.tempVars : [];
        if (!common.isEmpty(data.rtdRtqVarId)) {
            this.saveData.rtdRtqVarId = data.rtdRtqVarId;
        } else {
            this.saveData.rtdRtqVarId = null;
        }
        let tempArray = this.renderTable(this.saveData.tempVars);
        if (data.script && data.script != 0) {
            this.setState({
                index: ++this.state.index,
                tempVars: tempArray,
                model: 1,
                dimensionList: this.state.dimensionListAll[data.eventSourceId + '·-·' + data.eventSourceName]
            })
        } else {
            this.setState({
                index: ++this.state.index,
                tempVars: tempArray,
                model: 0,
                dimensionList: this.state.dimensionListAll[data.eventSourceId + '·-·' + data.eventSourceName]
            })
        }

        console.log('testing ----- ', this.state.dimensionListAll[data.eventSourceId + '·-·' + data.eventSourceName]);
    }

    getRtqVarById(id) {
        variableService.getRtqVarById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            // console.log('info数据');
            // console.log(res.data);
            let data = res.data.result;
            this.initSaveData(data);

        })
    }

    changeCode(code) {
        this.updateSaveData('script', code);
    }

    render() {
        return (
            <div className="pageContent" style={{ marginLeft: this.props.match.params.id ? '10px' : '24px', height: '100%', padding: '0 0 64px 0' }}>
                <FormHeader title="信息维护" style={{ padding: '32px 0px 0px 32px' }}></FormHeader>
                <div style={{ marginTop: '20px' }}>
                    <Spin spinning={this.state.isLoading} size="large">
                        <FormBlock header="基本信息">
                            <Form>
                                <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                                <FormItem name="标识" placeHolder="请输入以rv_开头的标识" disabled={this.props.match.params.id ? true : false} type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="code" defaultValue={this.saveData.code}></FormItem>
                                <FormItem name="事件源" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={["eventSourceId", "eventSourceName"]} selectData={this.state.eventSourceList} defaultValue={this.saveData.eventSourceId + '·-·' + this.saveData.eventSourceName}></FormItem>
                                <FormItem name="维度" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['dimensionId', 'dimensionName']} selectData={this.state.dimensionList} defaultValue={this.saveData.dimensionId + '·-·' + this.saveData.dimensionName}></FormItem>
                                <FormItem name="数据类型" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="type" selectData={this.state.dataTypeList} defaultValue={this.saveData.type}></FormItem>
                                <FormItem name="默认值" type="input" isNotNull={true} changeCallBack={this.updateSaveData} type="defaultValue" dataType={this.saveData.type} code="defaultValue" defaultValue={this.saveData.defaultValue}></FormItem>
                                <FormItem name="类别" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['category', 'categoryName']} categoryType="var" defaultValue={this.saveData.category + '·-·' + this.saveData.categoryName}></FormItem>
                                <FormItem disabled={this.props.match.params.id ? true : false} name="是否SQL模式" type="switch" isNotNull={false} changeCallBack={() => { this.setState({ model: this.state.model === 0 ? 1 : 0 }) }} code="mode" defaultValue={this.state.model}></FormItem>
                                <FormItem name="描述" type="textarea" isNotNull={false} changeCallBack={this.updateSaveData} code="description" defaultValue={this.saveData.description}></FormItem>
                            </Form>
                        </FormBlock>
                        {
                            this.state.model == 0 ?
                                <FormBlock header="临时变量">
                                    {/* <Button style={{ margin: '20px 0 15px 0' }} onClick={this.addTempVar}>添加临时变量</Button> */}
                                    <Table dataSource={this.state.tempVars} columns={columns} pagination={false} />
                                    <Button type="dashed" block style={{ marginTop: '10px' }} onClick={this.addTempVar}><Icon type="plus" theme="outlined" />添加临时变量</Button>
                                </FormBlock> :
                                <FormBlock header="SQL">
                                    <Code sqlCode={this.saveData.script} type={2} changeCode={this.changeCode} />
                                </FormBlock>
                        }

                    </Spin>
                </div>
                <FormButtonGroup
                    cancelCallBack={() => this.props.history.push('/business/variable/real-time-query')}
                    saveCallBack={this.verify}
                />
            </div>
        )
    }
}
Info.propTypes = {
    script: PropTypes.string
}
export default Info