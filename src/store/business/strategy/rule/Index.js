/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-16 14:41:38
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message, Modal } from 'antd';
import TableAction from '@/components/business/strategy/rule/TableAction';
import Status from '@/components/Status';
import React from 'react';

class store {
    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
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
        strategyService.getRuleList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }
    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        let dataList = [];
        if (!common.isEmpty(res.data.result.resultList)) {
            for (let i = 0; i < res.data.result.resultList.length; i++) {
                const element = res.data.result.resultList[i];
                let data = element;
                data.index = i + 1;
                data.key = i;
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
                data.type = element.type === 0 ? '普通规则' : '过滤规则';
                data.status = <Status status={element.status} />;
                data.action = <TableAction dataId={element.id} status={element.status} deleteOne={this.deleteOne} shareCallBack={() => { this.setState({ isShowShareModal: true }) }} editPath={{ pathname: '/business/strategy/rule/save/' + element.id }} />;
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
        strategyService.deleteRule(id).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            this.getDataSourceForApi();
        }).catch(() => {
            common.loading.hide();
        })
    }

}

export default new store