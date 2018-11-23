/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-16 10:21:27
 * @Description: 
 */
import { observable, action, computed, toJS } from 'mobx';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message, Modal } from 'antd';
import TableAction from '@/components/business/variable/real-time-query/TableAction';
import Status from '@/components/Status';
import React from 'react';

class store {
    
    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
    }

    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable isLoading = true;
    @observable query = { name: '', code: '', category: '',  };

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

    getDataSourceForApi() {
        variableService.getBatchVarList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }
    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        let dataList = [];
            if (res.data.result.resultList) {
                for (let i = 0; i < res.data.result.resultList.length; i++) {
                    const element = res.data.result.resultList[i];
                    let data = element;
                    data.index = i + 1;
                    data.key = i;
                    data.status = <Status status={element.status} />;
                    dataList.push(data);
                }
            }

        this.setPageNum(res.data.result.sum === 0 ? this.getPageNum : ++res.data.result.curPageNO);
        this.setTotal(res.data.result.sum);
        this.setIsLoading(false);
        this.setDataSource(dataList);

    }
}

export default new store