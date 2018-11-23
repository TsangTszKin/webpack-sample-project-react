import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, Input, Select, Table, Button, message } from 'antd';
import FormButtonGroup from '@/components/FormButtonGroup';
import SelectGroup from '@/components/SelectGroup';
import AddSub from '@/components/process-tree/AddSub';
import variableService from '@/api/business/variableService';
import { withRouter } from 'react-router-dom';
import CascadeWithTitle from '@/components/CascadeWithTitle';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import commonService from '@/api/business/commonService';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import { inject, observer } from 'mobx-react';

const Panel = Collapse.Panel;

@withRouter
@observer
@inject('store')
class RulesetForProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentNodeList: [],
            index: 0,
            categoryList: [],
            ruleSetList: [],
            ruleList: []
        }
        this.saveData = {
            "strategyId": this.props.match.params.id,
            "name": "",
            "parentId": "",
            "secondType": 1,
            "type": 1,
            "category": "",
            "strategyCode": sessionStorage.rootProcessTreeCode
        }
        this.originCategory = "";
        this.save = this.save.bind(this);
        this.verify = this.verify.bind(this);
        this.getRuleSetListByDimensionForRuleNode = this.getRuleSetListByDimensionForRuleNode.bind(this);
        this.getNodeDetailById = this.getNodeDetailById.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.getCategoryList = this.getCategoryList.bind(this);
    }

    componentDidMount() {
        this.getCategoryList();
        this.setState({
            parentNodeList: [],
            index: 0,
            ruleSetList: [],
            ruleList: [],
            categoryList: []
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentName !== this.props.currentName) {
            this.saveData.name = nextProps.currentName;
        }
        if (this.props.nodeId !== nextProps.nodeId && nextProps.nodeId) {
            this.getCategoryList();
        }

    }

    getCategoryList() {
        commonService.getCategoryListByType("ruleSet").then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            if (res.data.result && res.data.result instanceof Array) {

                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.dataValue,
                        value: element.dataName
                    });
                })
                this.setState({
                    categoryList: tempArray
                })

                if (this.props.nodeId) {
                    this.getNodeDetailById(this.props.nodeId);
                }
            }
        })
    }

    save() {
        if (common.isEmpty(this.saveData.parentId))
            this.saveData.parentId = null;
        common.loading.show();
        variableService.saveRuleSetNode(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            this.props.store.setIsCanCommit(true);
            message.success('保存成功');
            sessionStorage.removeItem('isFinishNode');
            this.getNodeDetailById(this.props.nodeId);
        }).catch(res => {
            common.loading.hide();
        })
    }

    getNodeDetailById(id, isEnd) {
        this.setState({
            ruleList: []
        })
        variableService.getNodeDetailById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let data = res.data.result;
            this.saveData.id = data.id;
            this.saveData.name = data.name;
            this.saveData.parentId = data.parentId;
            if (data.sort) {
                this.saveData.sort = data.sort;
            }

            if (data.parentNodeMap) {
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

            this.saveData.type = data.type;
            this.saveData.secondType = data.secondType;
            this.saveData.strategyId = data.strategyId;
            if (data.ruleSetId) {
                this.saveData.ruleSetId = data.ruleSetId;
                this.setState({
                    ruleList: []
                });
                this.state.ruleSetList.forEach(element => {

                    if (element.code === data.ruleSetId) {
                        let tempArray = [];
                        for (let i = 0; i < element.rules.length; i++) {
                            const element2 = element.rules[i];
                            tempArray.push({
                                key: i,
                                c1: element2.name,
                                c2: element2.description ? element2.description : '暂无'
                            });
                        }
                        this.setState({
                            ruleList: tempArray
                        });
                    }
                })
            } else if (!common.isEmpty(this.saveData.ruleSetId)) {
                this.saveData.ruleSetId = '';
            }

            if (data.category) {

                if (!isEnd) {
                    this.saveData.category = data.category;
                    this.originCategory = data.category;
                    this.getRuleSetListByDimensionForRuleNode(data.category)
                }

            } else {
                if (common.isEmpty(this.saveData.category)) {
                    this.saveData.category = "";
                }

            }
            console.log("this.saveData.category this.originCategory", this.saveData.category, this.originCategory);
            if (!common.isEmpty(this.saveData.category) && !common.isEmpty(this.originCategory)) {
                if (this.saveData.category !== this.originCategory) {
                    this.saveData.ruleSetId = "";
                } else {
                    this.saveData.ruleSetId = data.ruleSetId;
                }
            } else {
                this.saveData.ruleSetId = data.ruleSetId;
            }
            if (data.sqlCode) {
                this.saveData.sqlCode = data.sqlCode;
            }
            if (data.ruleSetCode) {
                this.saveData.ruleSetCode = data.ruleSetCode;
            }
            this.setState({
                index: this.state.index++
            })
        })
    }

    getRuleSetListByDimensionForRuleNode(category) {
        strategyService.getRuleSetListByDimensionForRuleNode(sessionStorage.eventSourceId, sessionStorage.dimensionId, category, sessionStorage.rootProcessTreeType).then(res => {
            if (!publicUtils.isOk(res)) return
            if (res.data.result) {
                let tempArray = [];
                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.id,
                        value: element.name,
                        rules: element.rules
                    })
                })
                this.setState({
                    ruleSetList: tempArray
                })

            }
            if (this.props.nodeId) {
                this.getNodeDetailById(this.props.nodeId, true);
            }
        })
    }

    verify() {
        for (const key in this.saveData) {
            if (this.saveData.hasOwnProperty(key)) {
                const element = this.saveData[key];
                if (element === 0) continue;
                if (!element) {
                    switch (key) {
                        case 'name':
                            message.warning('节点定义 - 名称 不能为空');
                            return
                            break;

                        default:
                            break;
                    }
                }
            }
        }
        this.save();
    }





    updateSaveData = (key, value) => {
        if (key === 'name') {
            value = common.stripscript(value);
        }
        this.saveData[key] = value;
        if (key === 'ruleSetId') {
            this.setState({
                ruleList: []
            })
            this.state.ruleSetList.forEach(element => {

                if (element.code === value) {
                    this.saveData.ruleSetCode = element.code;
                    this.saveData.sqlCode = element.script;
                    let tempArray = [];
                    for (let i = 0; i < element.rules.length; i++) {
                        const element2 = element.rules[i];

                        tempArray.push({
                            key: i,
                            c1: element2.name,
                            c2: element2.description ? element2.description : '暂无'
                        });
                    }
                    this.setState({
                        ruleList: tempArray
                    })
                }
            })

        }
        switch (key) {
            case 'name':
                this.saveData.name = this.saveData.name.substr(0, 30);
                break;
            case 'category':
                this.saveData.ruleSetId = "";
                this.getRuleSetListByDimensionForRuleNode(value);
                break;
            default:
                break;
        }
        this.setState({
            index: this.state.index++
        })
    }

    render() {
        function callback(key) {
            console.log(key);
        }

        const columns = [{
            title: '规则名',
            dataIndex: 'c1',
            key: 'c1',
        }, {
            title: '规则描述',
            dataIndex: 'c2',
            key: 'c2',
        }];
        return (

            <div className="pageContent" style={{ marginLeft: '10px', height: '100%', padding: '0 0 64px 0' }}>
                <FormHeader title={this.saveData.name} style={{ padding: '32px 0px 0px 32px' }} ></FormHeader>
                <div style={{ marginTop: '20px' }}>
                    <FormBlock header="节点定义">
                        <Form>
                            <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                            <FormItem name="父节点" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="parentId" defaultValue={this.saveData.parentId ? this.saveData.parentId : sessionStorage.rootProcessTreeName} selectData={this.state.parentNodeList}></FormItem>
                        </Form>
                    </FormBlock>
                    <FormBlock header="选择需要添加的规则集">
                        <div style={{ height: '32px' }}>
                            <CascadeWithTitle changeCallBack={this.updateSaveData} firstCode="category" secondCode="ruleSetId" firstValue={this.saveData.category} secondValue={this.saveData.ruleSetId} firstSelectData={this.state.categoryList} secondSelectData={this.state.ruleSetList} />
                        </div>
                    </FormBlock>
                    <FormBlock header="规则描述【优先级模式】">
                        <Table dataSource={this.state.ruleList} columns={columns} pagination={false} />
                    </FormBlock>
                </div>
                <FormButtonGroup
                    cancelCallBack={() => this.props.history.push('/business/strategy/definition')}
                    saveCallBack={this.verify}
                />
            </div>
        )
    }
}

export default RulesetForProcess;