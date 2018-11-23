import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, Icon, Button, message, Modal, Select } from 'antd';
import '@/styles/business/variable/real-time-query-edit.less';
import QueryConfig from '@/components/business/variable/real-time-query/QueryConfig';
import AddSub from '@/components/process-tree/AddSub';
import FormButtonGroup from '@/components/FormButtonGroup';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import { withRouter } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import common from '@/utils/common';
import DragSortingTable from '@/components/DragSortingTable';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/rule-set/Save';

const Panel = Collapse.Panel;
function callback(key) {
    console.log(key);
}


const columns = [{
    title: '序号',
    dataIndex: 'c1',
    key: 'c1',
}, {
    title: '规则名',
    dataIndex: 'c2',
    key: 'c2',
}, {
    title: '',
    dataIndex: 'c3',
    key: 'c3',
}];

@withRouter
@observer
class Save extends Component {
    constructor(props) {
        super(props);
        this.getInitDataList = this.getInitDataList.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.addTempVar = this.addTempVar.bind(this);
        this.subTempVars = this.subTempVars.bind(this);
        this.formatTempVars = this.formatTempVars.bind(this);
        this.verify = this.verify.bind(this);
        this.save = this.save.bind(this);
        this.getRuleListByDimensionForRuleNode = this.getRuleListByDimensionForRuleNode.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.getRuleSetById = this.getRuleSetById.bind(this);
        this.ruleSortCallBackFunc = this.ruleSortCallBackFunc.bind(this);
        this.state = {
            eventSourceList: [],
            dimensionList: [],
            dimensionListAll: [],
            allRules: [],
            selectRulreList: [],
            index: 0
        }
        this.saveData = {
            "name": "",
            "code": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "",
            "description": "",
            "category": "",
            "categoryName": "",
            "type": this.props.match.params.type,
            "rules": [
                // {
                //     "id": ""
                // }
            ],
            "priority": ""


        }
    }

    componentDidMount() {
        this.getInitDataList();
        store.setIsCanCommit(false);
        if (this.props.match.params.id) {
            sessionStorage.removeItem('isFinishNode');
            store.setCommitId(this.props.match.params.id);
        }
        if (this.props.match.params.type == '0') {
            store.setIsHaveCommitBtn(true);
        } else {
            store.setIsHaveCommitBtn(false);
        }

    }

    componentWillUnmount() {
        if (sessionStorage.processTreeMaxLength) {
            sessionStorage.removeItem("processTreeMaxLength");
        }
    }

    getRuleSetById(id) {
        strategyService.getRuleSetById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let data = res.data.result;
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
            if (data.id) {
                this.saveData.id = data.id;
            }
            if (!common.isEmpty(data.priority)) {
                this.saveData.priority = data.priority;
            }
            if (!common.isEmpty(data.name)) {
                this.saveData.name = data.name;
            }
            if (!common.isEmpty(data.status)) {
                this.saveData.status = data.status;
            }
            if (!common.isEmpty(data.code)) {
                this.saveData.code = data.code;
            }
            if (!common.isEmpty(data.eventSourceId)) {
                this.saveData.eventSourceId = data.eventSourceId;
            }
            if (!common.isEmpty(data.eventSourceName)) {
                this.saveData.eventSourceName = data.eventSourceName;
            }
            if (!common.isEmpty(data.dimensionId)) {
                this.saveData.dimensionId = data.dimensionId;
            }
            if (!common.isEmpty(data.dimensionName)) {
                this.saveData.dimensionName = data.dimensionName;
            }
            if (!common.isEmpty(data.description)) {
                this.saveData.description = data.description;
            }
            if (!common.isEmpty(data.category)) {
                this.saveData.category = data.category;
            } else {
                this.saveData.category = "";
            }
            if (!common.isEmpty(data.categoryName)) {
                this.saveData.categoryName = data.categoryName;
            }
            if (!common.isEmpty(data.type)) {
                this.saveData.type = data.type;
            }
            if (!common.isEmpty(data.procRuleId)) {
                this.saveData.procRuleId = data.procRuleId;
            }
            if (!common.isEmpty(data.strategyCode)) {
                this.saveData.strategyCode = data.strategyCode;
            }
            if (!common.isEmpty(data.ruleSetCode)) {
                this.saveData.ruleSetCode = data.ruleSetCode;
            }

            // if (!common.isEmpty(data.rules)) {


            strategyService.getRuleListByDimensionForRuleNode(this.props.match.params.type, data.dimensionId, data.eventSourceId, this.saveData.category).then(res2 => {
                if (!publicUtils.isOk(res2)) return
                this.setState({
                    selectRulreList: []
                })
                let tempArray = [];
                if (res2.data.result && typeof res2.data.result === 'object') {

                    res2.data.result.forEach(element => {
                        tempArray.push({
                            code: element.id,
                            value: element.name
                        });
                    })
                    if (this.props.match.params.type == 0) {
                        this.setState({
                            allRules: tempArray
                        });
                    } else {
                        if (!common.isEmpty(res.data.result.rules)) {
                            res.data.result.rules.forEach(element => {
                                tempArray.push({
                                    code: element.id,
                                    value: element.name
                                });
                            })
                            if (this.props.match.params.type == 1) {
                                this.setState({
                                    allRules: tempArray
                                });
                            }
                        }
                    }

                }

                this.saveData.rules = data.rules;
                var tempArray2 = [];
                for (let i = 0; i < this.saveData.rules.length; i++) {
                    let uuid = common.getGuid();
                    let element = this.saveData.rules[i];
                    element = {
                        key: uuid,
                        c1: i + 1,
                        c2: <Select style={{ width: '100%' }} onChange={(value, option) => { this.formatTempVars(i, 'id', value); this.formatTempVars(i, 'name', option.props.children) }} defaultValue={common.isEmpty(this.saveData.rules[i].name) ? this.saveData.rules[i].id : this.saveData.rules[i].name} >
                            {
                                this.state.allRules.map((item, i) =>
                                    <Select.Option value={item.code}>{item.value}</Select.Option>
                                )
                            }
                        </Select>,
                        c3: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subTempVars(uuid) }} /></a>
                    }
                    tempArray2.push(element);
                }
                this.setState({
                    selectRulreList: tempArray2
                })

            })

            // }
            this.setState({
                dimensionList: this.state.dimensionListAll[data.eventSourceId + '·-·' + data.eventSourceName]
            })

            console.log("this.saveData = ", this.saveData);
        })
    }

    showConfirm(key, value, isBatch) {
        let self = this;
        console.log("this.saveData.eventSourceId 前", self.saveData.eventSourceId);
        Modal.confirm({
            title: '更改事件源或维度会清空规则集，是否确定更改？',
            content: '',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                console.log('OK');
                self.saveData.rules = [];

                self.setState({
                    selectRulreList: []
                })
                if (isBatch) {
                    for (let i = 0; i < key.length; i++) {
                        const element = key[i];
                        self.saveData[element] = value[i];
                    }
                    if (key.indexOf('eventSourceId') >= 0 || key.indexOf('eventSourceName') >= 0) {
                        self.saveData.dimensionId = '';
                        self.saveData.dimensionName = '';
                        self.setState({
                            dimensionList: self.state.dimensionListAll[value[0] + '·-·' + value[1]],
                        });
                    }
                } else {
                    self.saveData[key] = value;
                    if (key === 'eventSourceId') {
                        self.saveData.dimensionId = '';
                        self.saveData.dimensionName = '';
                        self.setState({
                            dimensionList: self.state.dimensionListAll[value],
                        });
                    }
                    if (key === 'dimensionId') {
                        self.getRuleListByDimensionForRuleNode(value, self.saveData.eventSourceId);
                    }
                }

            },
            onCancel() {
                console.log('Cancel');
                self.setState({
                    index: self.state.index++
                })
                console.log("this.saveData.eventSourceId 后", self.saveData.eventSourceId);
            },
        });
    }

    save = () => {
        common.loading.show();
        strategyService.saveRuleSet(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            store.setIsCanCommit(true);
            message.success('保存成功');
            this.props.history.push(`/business/strategy/rule-set/save/${this.props.match.params.type}/${res.data.result.id}`);
        }).catch(res => {
            common.loading.hide();
        });
    }

    getRuleListByDimensionForRuleNode(dimensionId, eventSourceId) {
        strategyService.getRuleListByDimensionForRuleNode(this.props.match.params.type, dimensionId, eventSourceId, this.saveData.category).then(res => {
            if (!publicUtils.isOk(res)) return

            this.setState({
                selectRulreList: []
            })
            this.saveData.rules = [];
            if (res.data.result) {
                let tempArray = [];
                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.id,
                        value: element.name
                    });
                })
                this.setState({
                    allRules: tempArray
                });
            }

        })
    }

    verify() {
        console.log("this.saveData = ", this.saveData);
        if (common.isEmpty(this.saveData.name)) {
            message.warning('基本信息 - 名称 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.code)) {
            message.warning('基本信息 - 标识 不能为空');
            return
        }
        if (this.saveData.code.indexOf("rs_") !== 0) {
            message.warning('基本信息 - 标识 必须以 rs_ 开头');
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
            message.warning('基本信息 - 类型 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.priority)) {
            message.warning('基本信息 - 优先级 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.category)) {
            message.warning('基本信息 - 类别 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.rules)) {
            message.warning('规则集配置 - 请添加规则');
            return
        }

        for (let i = 0; i < this.saveData.rules.length; i++) {
            const element = this.saveData.rules[i];
            if (element.code === 0) continue;
            if (common.isEmpty(element.id)) {
                message.warning('规则集配置 - 规则 不能为空');
                return
            }
            for (let j = 0; j < this.saveData.rules.length; j++) {
                const element2 = this.saveData.rules[j];
                if (i === j) continue;
                if (element.id === element2.id) {
                    message.warning("请勿重复选择规则");
                    return
                }
            }
        }
        this.save();
    }

    updateSaveData = (key, value, isBatch) => {
        console.log("data-change", key, value)
        if (isBatch) {
            if (key.indexOf('category') >= 0) {
                for (let i = 0; i < key.length; i++) {
                    const element = key[i];
                    this.saveData[element] = value[i];
                }
                this.getRuleListByDimensionForRuleNode(this.saveData.dimensionId, this.saveData.eventSourceId);
                this.setState({
                    index: this.state.index++
                })
            }

            if (key.indexOf('eventSourceId') >= 0 || key.indexOf('eventSourceName') >= 0 || key.indexOf('dimensionId') >= 0 || key.indexOf('dimensionName') >= 0) {
                if (this.saveData.rules && this.saveData.rules.length > 0) {
                    this.showConfirm(key, value, isBatch);
                } else {

                    for (let i = 0; i < key.length; i++) {
                        const element = key[i];
                        this.saveData[element] = value[i];
                        if (element === 'eventSourceId') {
                            this.saveData.dimensionId = '';
                            // console.log('test ------', this.state.dimensionListAll[value[0]]+ '·-·'+ this.state.dimensionListAll[value[1]])
                            this.setState({
                                dimensionList: this.state.dimensionListAll[value[0] + '·-·' + value[1]],
                            });
                            this.saveData.dimensionId = '';
                            this.saveData.dimensionName = '';
                        }
                        if (element === 'dimensionId') {
                            this.getRuleListByDimensionForRuleNode(value[i], this.saveData.eventSourceId);
                        }
                    }

                    this.setState({
                        index: this.state.index++
                    })
                }
            }
        } else {
            if (key === 'eventSourceId' || key === 'dimensionId') {
                if (this.saveData.rules && this.saveData.rules.length > 0) {
                    this.showConfirm(key, value);
                } else {
                    this.saveData[key] = value;
                    if (key === 'eventSourceId') {
                        this.saveData.dimensionId = '';
                        this.setState({
                            dimensionList: this.state.dimensionListAll[value],
                        });
                    }
                    if (key === 'dimensionId') {
                        this.getRuleListByDimensionForRuleNode(value, this.saveData.eventSourceId);
                    }
                }

            } else {
                if (key === 'code') {
                    this.saveData.code = value.replace(/[^\w_]/g, '');
                } else {
                    this.saveData[key] = value;
                }
            }
            switch (key) {
                case 'name':
                    this.saveData.name = common.stripscript(this.saveData.name.substr(0, 30));
                    break;
                case 'code':
                    this.saveData.code = common.stripscript(this.saveData.code.substr(0, 30));
                    break;
                case 'description':
                    this.saveData.description = this.saveData.description.substr(0, 255);
                    break;
                case 'priority':
                    let intValue = String(value);
                    if (intValue.indexOf('.') >= 0) {
                        value = Number(intValue.split('.')[0]);
                        this.saveData.priority = value;
                    }
                    break;
                default:
                    break;
            }
        }
        this.setState({
            index: this.state.index++
        })
    }

    addTempVar = () => {

        let tempArray = this.state.selectRulreList;
        console.log(tempArray);
        const key = tempArray.length;
        let uuid = common.getGuid();
        tempArray.push({
            key: uuid,
            c1: key + 1,
            c2: <Select style={{ width: '100%' }} onChange={(value, option) => { this.formatTempVars(key, 'id', value); this.formatTempVars(key, 'name', option.props.children) }}>
                {
                    this.state.allRules.map((item, i) =>
                        <Select.Option value={item.code}>{item.value}</Select.Option>
                    )
                }
            </Select>,
            c3: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subTempVars(uuid) }} /></a>
        });
        this.saveData.rules.push({
            "id": ""
        })
        this.setState({
            selectRulreList: tempArray
        })
    }

    subTempVars = (key) => {
        var tempArray = [];
        let arrayIndex;
        for (let i = 0; i < this.state.selectRulreList.length; i++) {
            const element = this.state.selectRulreList[i];
            if (element.key === key) {
                arrayIndex = i;
                continue
            }
            tempArray.push(element);
        }

        this.saveData.rules.splice(arrayIndex, 1);

        var tempArray2 = [];
        for (let i = 0; i < tempArray.length; i++) {
            let uuid = common.getGuid();
            let element = tempArray[i];
            console.log("this.saveData.rules[i]", this.saveData.rules);
            console.log("i  ", i);
            element = {
                key: uuid,
                c1: i + 1,
                c2: <Select style={{ width: '100%' }} onChange={(value, option) => { this.formatTempVars(i, 'id', value); this.formatTempVars(i, 'name', option.props.children) }} defaultValue={this.saveData.rules[i].id} >
                    {
                        this.state.allRules.map((item, i) =>
                            <Select.Option value={item.code}>{item.value}</Select.Option>
                        )
                    }
                </Select>,
                c3: <a style={{ color: '#D9D9D9' }}><AddSub type="sub" sub={() => { this.subTempVars(uuid) }} /></a>
            }
            tempArray2.push(element);
        }
        this.setState({
            selectRulreList: tempArray2
        })
        console.log(tempArray2);
    }

    formatTempVars = (i, name, value) => {
        this.saveData.rules[i][name] = value;
        console.log(this.saveData.rules);
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
            console.log(temp2);
            console.log(temp2[array1[0].code])
            self.setState({
                eventSourceList: array1,
                dimensionListAll: temp2
            })

            // self.saveData.eventSourceId = array1[0].code;
            // self.saveData.dimensionId = temp2[array1[0].code];
            if (this.props.match.params.id) {
                this.getRuleSetById(this.props.match.params.id);
            }
        })
    }


    ruleSortCallBackFunc(dragIndex, hoverIndex) {

        let dataSource = common.deepClone(this.state.selectRulreList);
        let dataSourceAfter = common.deepClone(this.state.selectRulreList);
        let rules = common.deepClone(this.saveData.rules);
        console.log("before the rules sort is", rules);
        dataSourceAfter[dragIndex] = dataSource[hoverIndex];
        dataSourceAfter[hoverIndex] = dataSource[dragIndex];
        this.saveData.rules[dragIndex] = rules[hoverIndex];
        this.saveData.rules[hoverIndex] = rules[dragIndex];
        this.setState({
            selectRulreList: dataSourceAfter
        })
        console.log("after the rules sort is", this.saveData.rules);
    }

    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent" style={{ padding: '0 0 64px 0' }}>
                        <FormHeader title="信息维护" style={{ padding: '32px 0px 0px 32px' }}></FormHeader>
                        <div style={{ marginTop: '20px' }}>
                            <FormBlock header="基本信息">
                                <Form>
                                    <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                                    <FormItem name="标识" placeHolder="请输入以rs_开头的标识" disabled={this.props.match.params.id ? true : false} type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="code" defaultValue={this.saveData.code}></FormItem>
                                    <FormItem name="事件源" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={["eventSourceId", "eventSourceName"]} selectData={this.state.eventSourceList} defaultValue={this.saveData.eventSourceId + '·-·' + this.saveData.eventSourceName}></FormItem>
                                    <FormItem name="维度" disabled={this.props.match.params.id ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['dimensionId', 'dimensionName']} selectData={this.state.dimensionList} defaultValue={this.saveData.dimensionId + '·-·' + this.saveData.dimensionName}></FormItem>
                                    <FormItem name="匹配模式" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="type" selectData={[{ code: 1, value: '全规则模式' }, { code: 0, value: '优先级模式' }]} defaultValue={Number(this.props.match.params.type)} disabled={true}></FormItem>
                                    <FormItem name="类别" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['category', 'categoryName']} categoryType="ruleSet" defaultValue={this.saveData.category + '·-·' + this.saveData.categoryName}></FormItem>
                                    <FormItem name="优先级" type="InputNumber" numberMin={1} isNotNull={true} changeCallBack={this.updateSaveData} code="priority" defaultValue={this.saveData.priority}></FormItem>
                                    <FormItem name="描述" type="textarea" isNotNull={false} changeCallBack={this.updateSaveData} code="description" defaultValue={this.saveData.description}></FormItem>
                                </Form>
                            </FormBlock>
                            <FormBlock header="规则集配置">
                                <DragSortingTable dataSource={this.state.selectRulreList} columns={columns} callBackFunc={this.ruleSortCallBackFunc} />
                                <Button type="dashed" block style={{ marginTop: '10px' }} onClick={this.addTempVar}><Icon type="plus" theme="outlined" />添加规则</Button>
                            </FormBlock>
                        </div>
                        <FormButtonGroup
                            cancelCallBack={() => this.props.history.push('/business/strategy/rule-set')}
                            saveCallBack={() => this.verify()}
                        />
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Save