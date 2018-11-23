/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-21 10:45:19
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message, Modal } from 'antd';
import TableAction from '@/components/business/strategy/definition/TableAction';
import Status from '@/components/Status';
import React from 'react';

class store {
    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
    }
    @observable isCanSubmit = false;
    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable isLoading = true;
    @observable query = { name: '', code: '', category: '' };
    @observable selectedRowKeys = [];

    @computed get getSelectedRowKeys() {
        return toJS(this.selectedRowKeys)
    }
    @action.bound setSelectedRowKeys(value) {
        this.selectedRowKeys = value;
    }

    @computed get getQuery() {
        return toJS(this.query)
    }
    @action.bound setQuery(value) {
        this.query = value;
    }

    @computed get getIsLoading() {
        return toJS(this.isLoading)
    }
    @action.bound setIsLoading(value) {
        this.isLoading = value;
    }

    @computed get getDataSource() {
        return toJS(this.dataSource)
    }
    @action.bound setDataSource(value) {
        this.dataSource = value;
    }

    @computed get getTotal() {
        return toJS(this.total)
    }
    @action.bound setTotal(value) {
        this.total = value;
    }

    @computed get getPageNum() {
        return toJS(this.pageNum)
    }
    @action.bound setPageNum(value) {
        this.pageNum = value;
    }

    @computed get getPageSize() {
        return toJS(this.pageSize)
    }
    @action.bound setPageSize(value) {
        this.pageSize = value;
    }

    @computed get getIsCanSubmit() {
        return toJS(this.isCanSubmit);
    }
    @action.bound setIsCanSubmit(value) {
        this.isCanSubmit = value;
    }

    @computed get getSqlPreview() {
        return toJS(this.sqlPreview);
    }
    @action.bound setSqlPreview(value) {
        this.sqlPreview = value;
    }

    @action.bound submit(id) {
        common.loading.show();
        strategyService.submitRtq(id).then(this.submitRtqCallback).catch(() => { common.loading.hide(); })
    }
    @action.bound submitRtqCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        message.success("提交成功");
    }

    getDataSourceForApi() {
        strategyService.getStrategyList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }
    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        let dataList = [];
        if (!common.isEmpty(res.data.result.resultList)) {
            for (let i = 0; i < res.data.result.resultList.length; i++) {
                const element = res.data.result.resultList[i];
                const e = common.deepClone(element);
                const status = element.status;
                let data = element;
                data.index = i + 1;
                data.key = i;
                data.status = <Status status={element.status} />;
                switch (data.type) {
                    case 0:
                        data.typeLabel = '流程模式';
                        break;
                    case 1:
                        data.typeLabel = '贪婪模式';
                        break;
                    case 2:
                        data.typeLabel = 'SQL模式';
                        break;

                    default:
                        break;
                }
                if (!common.isEmpty(data.name)) {
                    if (data.name.length > 20) {
                        data.name = String(data.name).substr(0, 20) + '...';
                    }
                }
                if (!common.isEmpty(data.defaultValue)) {
                    if (data.defaultValue.length > 20) {
                        data.defaultValue = String(data.defaultValue).substr(0, 20) + '...';
                    }
                }
                data.statusNumber = status;
                data.status = <Status status={status} />;
                let typeDetail;
                switch (data.type) {
                    case 0:
                        typeDetail = 'process';
                        break;
                    case 1:
                        typeDetail = 'greedy';
                        break;
                    case 2:
                        typeDetail = 'sql';
                        break;
                    default: break;
                }
                // alert(data.script)
                data.action = <TableAction dataId={element.id} eventSourceId={element.eventSourceId} status={status} changeStatus={this.changeStatus} deleteOne={this.deleteOne} shareCallBack={() => { this.setState({ isShowShareModal: true }) }} editPath={`/business/strategy/definition/save/${typeDetail}/${data.id}`} />;
                dataList.push(data);
            }
        } else {
            if (this.getPageNum > 1) {
                window.location.reload();
            }
        }

        this.setPageNum(res.data.result.sum === 0 ? this.getPageNum : ++res.data.result.curPageNO);
        this.setTotal(res.data.result.sum);
        this.setIsLoading(false);
        this.setDataSource(dataList);

    }

    deleteOne(id, status) {
        if (status !== 4) {
            let dataList = this.getDataSource;
            dataList.forEach(element => {
                if (element.id === id) {
                    element.status = <Status status={5} />;
                }
            })
            this.setDataSource(dataList);
            common.loading.show();
            strategyService.changeStrategyStatus([id], "delete").then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                this.getDataSourceForApi();
            }).catch(() => {
                common.loading.hide();
            })
        } else {
            Modal.info({
                title: '提示',
                content: (
                    <div>
                        <p>请先下线该变量再删除~</p>
                    </div>
                ),
                onOk() { },
            });
            return
        }
    }

    changeStatus(id, status, eventSourceId) {
        let dataList = this.getDataSource;
        switch (status) {
            case 1:
                dataList.forEach(element => {
                    if (element.id === id) {
                        element.status = <Status status={2} />;
                    }
                })
                this.setDataSource(dataList);
                common.loading.show();
                strategyService.changeStrategyStatus([id], "online", eventSourceId).then(res => {
                    common.loading.hide();
                    if (!publicUtils.isOk(res)) return
                    this.getDataSourceForApi();
                }).catch(() => {
                    common.loading.hide();
                })
                break;
            case 4:
                dataList.forEach(element => {
                    if (element.id === id) {
                        element.status = <Status status={3} />;
                    }
                })
                this.setDataSource(dataList);
                common.loading.show();
                strategyService.changeStrategyStatus([id], "offline").then(res => {
                    common.loading.hide();
                    if (!publicUtils.isOk(res)) return
                    this.getDataSourceForApi();
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
}

export default new store