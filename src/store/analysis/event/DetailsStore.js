/*
 * @Author: zengzijian
 * @Date: 2018-11-13 11:26:07
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-15 15:40:58
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import eventService from '@/api/analysis/eventService';
import React, { Component } from 'react';

class store {
    constructor() {
        this.getEventDetails = this.getEventDetails.bind(this);
    }
    @observable strategyList = [];
    @observable ruleList = [];
    @observable cols = [];
    @observable selectValueList1 = [];//{eventSourceCode: '', eventSourceId: '', strategyId: ''}
    @observable selectValueList2 = [];//{ruleCode: '', optType: '', value: '', col: ''}
    @observable colsValue = [];
    @observable pageNum = 1;
    @observable pageSize = 40;
    @observable total = 0;
    @observable dataSource = [];
    @observable columns = [];
    @observable isLoading = true;
    @observable showDrawer = false;
    @observable drawerData = { eventVars: {}, batchVars: {}, rtqVars: {}, ruleResultOut: {} };
    drawerDataList = [];

    @computed get getDrawerData() {
        return toJS(this.drawerData)
    }
    @action.bound setDrawerData(value) {
        this.drawerData = value;
    }

    @computed get getColsValue() {
        return toJS(this.colsValue)
    }
    @action.bound setColsValue(value) {
        this.colsValue = value;
    }

    @computed get getShowDrawer() {
        return toJS(this.showDrawer)
    }
    @action.bound setShowDrawer(value) {
        this.showDrawer = value;
    }

    @computed get getIsLoading() {
        return toJS(this.isLoading)
    }
    @action.bound setIsLoading(value) {
        this.isLoading = value;
    }

    @computed get getColumns() {
        return toJS(this.columns)
    }
    @action.bound setColumns(value) {
        this.columns = value;
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
    @action.bound getPageSize(value) {
        this.pageSize = value;
    }

    @computed get getRuleList() {
        return toJS(this.ruleList)
    }
    @action.bound setRuleList(value) {
        this.ruleList = value;
    }

    @computed get getCols() {
        return toJS(this.cols)
    }
    @action.bound setCols(value) {
        this.cols = value;
    }

    @computed get getStrategyList() {
        return toJS(this.strategyList)
    }
    @action.bound setStrategyList(value) {
        this.strategyList = value;
    }

    @computed get getSelectValueList1() {
        return toJS(this.selectValueList1)
    }
    @action.bound setSelectValueList1(value) {
        this.selectValueList1 = value;
    }

    @computed get getSelectValueList2() {
        return toJS(this.selectValueList2)
    }
    @action.bound setSelectValueList2(value) {
        this.selectValueList2 = value;
    }

    @action.bound getEventSourceListAndStrategyList() {
        eventService.getEventSourceListAndStrategyList().then(this.getEventSourceListAndStrategyListCallBack)
    }
    @action.bound getEventSourceListAndStrategyListCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        res.data.result.forEach(element => {
            let temp = {
                title: element.name,
                value: element.key,
                key: element.id,
                children: [],
                eventSourceCode: element.key,
                strategyId: null,
                eventSourceId: element.id
            }
            if (!common.isEmpty(element.strategyList)) {
                let tempArray2 = [];
                element.strategyList.forEach(element2 => {
                    tempArray2.push({
                        title: element2.name,
                        value: element2.id,
                        key: element2.id,
                        eventSourceCode: element.key,
                        strategyId: element2.id,
                        eventSourceId: element.id
                    })
                })
                temp.children = tempArray2;
            }
            tempArray.push(temp);
        })
        this.setStrategyList(tempArray);
    }

    @action.bound getRuleListByStrategyList(params) {
        eventService.getRuleListByStrategyList(params).then(this.getRuleListByStrategyListCallBack);
    }
    @action.bound getRuleListByStrategyListCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        res.data.result.forEach(element => {
            tempArray.push({ code: element.code, value: element.name })
        })
        this.setRuleList(tempArray);
    }

    @action.bound getEventCols() {
        let tempArray = [];
        this.getSelectValueList1.forEach(element => {
            tempArray.push(element.eventSourceId)
        })
        eventService.getEventCols(tempArray).then(this.getEventColsCallBack);
    }
    @action.bound getEventColsCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        if (!common.isEmpty(res.data.result)) {
            for (const key in res.data.result) {
                if (res.data.result.hasOwnProperty(key)) {
                    const element = res.data.result[key];
                    tempArray.push({
                        title: element,
                        value: key,
                        key: common.getGuid(),
                        children: [],
                    });
                }
            }
        }
        this.setCols(tempArray);
    }

    getEventDetails() {
        let selectValueList2 = this.getSelectValueList2;
        let procRules = [];
        let conditions = [];
        for (let i = 0; i < selectValueList2.length; i++) {
            const element = selectValueList2[i];
            if (common.isEmpty(element.ruleCode) || common.isEmpty(element.optType) || common.isEmpty(element.value) || common.isEmpty(element.col)) return
            procRules.push(element.ruleCode);
            conditions.push({
                "attribute": element.col,
                // "dataType": "DataType{description='字符串', value=12}",
                "operator": element.optType,
                "value": element.value
            });
        }

        let eventSourcesCodes = [];
        this.getSelectValueList1.forEach(element => {
            eventSourcesCodes.push(element.eventSourceCode);
        })

        let params = {
            "pageNum": this.getPageNum,
            "pageSize": this.getPageSize,
            "dsTypes": eventSourcesCodes,
            "fields": this.getColsValue,
            "procRules": procRules,
            "conditions": conditions
        }
        eventService.getEventDetails(params).then(this.getEventDetailsCallBack);
    }
    @action.bound getEventDetailsCallBack(res) {
        if (!publicUtils.isOk(res)) return;
        let data = common.deepClone(res.data.result.resultList);
        let dataSource = [];
        let columns = [];
        let drawerDataList = [];
        if (!common.isEmpty(data)) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];

                let sourceObj = { key: i }
                if (i === 0) {
                    for (const key in element) {
                        if (element.hasOwnProperty(key)) {
                            console.log(key)
                            if (key === 'eventVars' || key === 'batchVars' || key === 'rtqVars' || key === 'ruleResultOut') {

                            } else {
                                let columnObj = {}
                                columnObj.title = key;
                                columnObj.dataIndex = key;
                                columnObj.key = key;
                                if (key === 'seqNo') {
                                    columnObj.title = '流水号';
                                    columnObj.render = text => <a href="javascript:;" onClick={() => {
                                        this.setShowDrawer(true);
                                        let temp = {
                                            eventVars: this.drawerDataList[i].eventVars,
                                            batchVars: this.drawerDataList[i].batchVars,
                                            rtqVars: this.drawerDataList[i].rtqVars,
                                            ruleResultOut: this.drawerDataList[i].ruleResultOut
                                        }
                                        this.setDrawerData(temp);
                                    }}>{text}</a>
                                }
                                if (key === 'ddApdate') {
                                    columnObj.title = '事件发生时间';
                                }
                                if (key === 'dsType') {
                                    columnObj.title = '事件源';
                                }
                                columns.push(columnObj);
                            }


                        }
                    }
                }
                dataSource.push(sourceObj);
                drawerDataList.push({
                    eventVars: element.eventVars,
                    batchVars: element.batchVars,
                    rtqVars: element.rtqVars,
                    ruleResultOut: element.ruleResultOut
                })

            }


            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                for (const key in element) {
                    if (element.hasOwnProperty(key)) {
                        const element2 = element[key];
                        if (key === 'ddApdate') {
                            dataSource[i][key] = common.formatTime(element2);
                        } else {
                            dataSource[i][key] = element2;
                        }
                    }
                }
            }
        }

        this.drawerDataList = drawerDataList;
        this.setPageNum(res.data.result.sum === 0 ? this.getPageNum : res.data.result.curPageNO);
        this.setTotal(res.data.result.sum);
        this.setIsLoading(false);
        this.setDataSource(dataSource);
        this.setColumns(columns);
    }
}

export default new store