import React, { Component } from 'react';
import FormHeader from '@/components/FormHeader';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import { Collapse, Input, Select, Table, Button, message, Icon } from 'antd';
import FormButtonGroup from '@/components/FormButtonGroup';
import SelectGroup from '@/components/SelectGroup';
import AddSub from '@/components/process-tree/AddSub';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import Status from '@/components/Status';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import FormButtonGroup2 from '@/components/FormButtonGroup2';

const Panel = Collapse.Panel;

@withRouter
class RulesetForGreedy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            ruleList: [],
            dataList: [],
            index: 0
        }
        this.saveData = {
            "strategyId": this.props.match.params.id,
            "name": "",
            "parentId": "",
            "secondType": 1,
            "type": 1,
            "strategyCode": sessionStorage.rootProcessTreeCode
        }
        this.save = this.save.bind(this);
        this.verify = this.verify.bind(this);
        this.multiOnline = this.multiOnline.bind(this);
        this.multiOffline = this.multiOffline.bind(this);
        this.getNodeDetailById = this.getNodeDetailById.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
    }


    componentDidMount() {
        if (!common.isEmpty((this.props.nodeId))) {
            this.getNodeDetailById(this.props.nodeId);
        }

    }


    save() {
        common.loading.show();
        variableService.saveRuleSetNode(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success('保存成功');
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.currentName !== this.props.currentName) {
            this.saveData.name = nextProps.currentName;
        }
        if (this.props.nodeId !== nextProps.nodeId && nextProps.nodeId) {
            this.getNodeDetailById(nextProps.nodeId);
        }

    }

    getNodeDetailById(id) {
        strategyService.getRuleSetById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            this.saveData.name = res.data.result.name;
            if (res.data.result.sort) {
                this.saveData.sort = data.sort;
            }
            this.state.dataList = res.data.result.rules;
            let tempArray = [];
            for (let i = 0; i < res.data.result.rules.length; i++) {
                const element = res.data.result.rules[i];
                tempArray.push({
                    key: i,
                    c1: element.name,
                    c2: element.description,
                    c3: <div>
                        <p style={{ width: 'fit-content', float: 'left' }}>
                            <Icon onClick={() => { this.changeStatus(element.id, element.status) }} type={element.status === 1 ? "caret-right" : "pause"} theme="outlined" style={{ cursor: 'pointer' }} />
                        </p>
                        <p style={{ width: 'fit-content', float: 'left' }}>
                            <Status status={element.status} />
                        </p>
                    </div>
                });
            }
            this.setState({
                ruleList: tempArray,
                selectedRowKeys: []
            })
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
        this.setState({
            index: this.state.index++
        })
    }

    multiOnline() {
        var ids = [];
        for (let i = 0; i < this.state.dataList.length; i++) {
            for (let j = 0; j < this.state.selectedRowKeys.length; j++) {
                const element = this.state.selectedRowKeys[j];
                if (element === i && this.state.dataList[i].status === 1) {
                    ids.push(this.state.dataList[i].id);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        common.loading.show();
        variableService.changeRuleSetGreedyStatus(ids, "online").then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("上线成功");
            this.getNodeDetailById(this.props.nodeId);
            this.props.reRender();
            this.setState({
                selectedRowKeys: []
            })
        }).catch(() => {
            common.loading.hide();
        })

    }

    multiOffline() {
        var ids = [];
        for (let i = 0; i < this.state.dataList.length; i++) {
            for (let j = 0; j < this.state.selectedRowKeys.length; j++) {
                const element = this.state.selectedRowKeys[j];
                if (element === i && this.state.dataList[i].status === 4) {
                    ids.push(this.state.dataList[i].id);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }
        common.loading.show();
        variableService.changeRuleSetGreedyStatus(ids, "offline").then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("下线成功");
            this.getNodeDetailById(this.props.nodeId);
            this.props.reRender();
            this.setState({
                selectedRowKeys: []
            })
        }).catch(() => {
            common.loading.hide();
        })

    }

    changeStatus(id, status) {
        let dataList = this.state.dataList;
        switch (status) {
            case 1:

                dataList.forEach(element => {
                    if (element.id === id) {
                        // element.status = <Status status={2} />;
                    }
                })
                this.setState({
                    dataList: dataList
                })
                common.loading.show();
                variableService.changeRuleSetGreedyStatus([id], "online").then(res => {
                    common.loading.hide();
                    if (!publicUtils.isOk(res)) return
                    this.getNodeDetailById(this.props.nodeId);
                    this.props.reRender();
                }).catch(() => {
                    common.loading.hide();
                })
                break;
            case 4:
                dataList.forEach(element => {
                    if (element.id === id) {
                        // element.status = <Status status={3} />;
                    }
                })
                this.setState({
                    dataList: dataList
                })
                common.loading.show();
                variableService.changeRuleSetGreedyStatus([id], "offline").then(res => {
                    common.loading.hide();
                    if (!publicUtils.isOk(res)) return
                    this.getNodeDetailById(this.props.nodeId);
                    this.props.reRender();
                }).catch(() => {
                    common.loading.hide();
                })
                break;

            default:
                Modal.info({
                    title: '提示',
                    content: (
                        <div>
                            <p>请稍等~</p>
                        </div>
                    ),
                    onOk() { },
                });
                break;
        }
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
        }, {
            title: '状态',
            dataIndex: 'c3',
            key: 'c3',
        }];


        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.setState({ selectedRowKeys });
            }
        };
        return (
            <div className="pageContent" style={{ marginLeft: '10px', height: '100%', padding: '0 0 64px 0' }}>
                <FormHeader title={this.saveData.name} style={{ padding: '32px 0px 0px 32px' }}></FormHeader>
                <div style={{ marginTop: '20px' }}>
                        <FormBlock header="规则描述【全规则模式】" key="1">
                            {/* <Select
                                style={{ width: '106px' }}
                                placeholder="批量操作"
                                style={{ width: '109px', margin: '20px  0' }}
                                value="批量操作"
                                onChange={(value) => {
                                    switch (value) {
                                        case '1':
                                            this.multiOnline();
                                            break;
                                        case '2':
                                            this.multiOffline();
                                            break;
                                        default:
                                            break;
                                    }
                                }}
                            >
                                <Select.Option value="1">上线</Select.Option>
                                <Select.Option value="2">下线</Select.Option>
                            </Select> */}
                            <Table rowSelection={rowSelection} dataSource={this.state.ruleList} columns={columns} pagination={false} />
                        </FormBlock>
                </div>
                <FormButtonGroup2
                    cancelCallBack={() => this.props.history.goBack()}
                    multiOnline={this.multiOnline}
                    multiOffline={this.multiOffline}
                    isFixed={true}
                />
            </div >
        )
    }
}

export default RulesetForGreedy;