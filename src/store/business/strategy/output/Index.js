/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-16 15:38:52
 * @Description: 
 */
import { observable, action, computed, toJS } from 'mobx';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import TableAction from '@/components/business/strategy/output/TableAction';
import React from 'react';

class store {

    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }

    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable isLoading = true;
    @observable query = { name: '', code: '' };

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
        strategyService.getResultList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
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
                data.action = <TableAction dataId={element.id} deleteOne={this.deleteOne} editPath={'/business/strategy/output/save/' + element.id} />;
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

    deleteOne(id) {
        common.loading.show();
        strategyService.deleteResultById(id).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            this.getDataSourceForApi();
        }).catch(() => {
            common.loading.hide();
        })
    }
}

export default new store