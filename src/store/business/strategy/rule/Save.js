/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-22 15:57:05
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message, Modal } from 'antd';

import React from 'react';
import $ from 'jquery';

let timer = 0;
class store {
    constructor() {
        this.submitSaveData = this.submitSaveData.bind(this);
        this.getSqlPreviewForAPI = this.getSqlPreviewForAPI.bind(this);
    }
   
    @observable isShowDrawerForSql = false;
    @observable sqlPreview = "";
    @observable isHaveCommitBtn = true;
    @observable isCanCommit = false;
    @observable commitId = '';

    @computed get getIsShowDrawerForSql() {
        return toJS(this.isShowDrawerForSql);
    }
    @action.bound setIsShowDrawerForSql(value) {
        this.isShowDrawerForSql = value;
    }

    @computed get getSqlPreview() {
        return toJS(this.sqlPreview);
    }
    @action.bound setSqlPreview(value) {
        this.sqlPreview = value;
    }

    @computed get getCommitId() {
        return toJS(this.commitId);
    }
    @action.bound setCommitId(value) {
        this.commitId = value;
    }

    @computed get getIsCanCommit() {
        return toJS(this.isCanCommit);
    }
    @action.bound setIsCanCommit(value) {
        this.isCanCommit = value;
    }

    @computed get getIsHaveCommitBtn() {
        return toJS(this.isHaveCommitBtn);
    }
    @action.bound setIsHaveCommitBtn(value) {
        this.isHaveCommitBtn = value;
    }

    submitSaveData() {
        common.loading.show();
        strategyService.submitRule(this.getCommitId).then(this.submitSaveDataCallback);
    }
    @action.bound submitSaveDataCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        message.success("提交成功");
    }

    getSqlPreviewForAPI(id) {
        strategyService.getRuleSqlPreview(id).then(this.getSqlPreviewCallback);
    }
    @action.bound getSqlPreviewCallback(res) {
        if (!publicUtils.isOk(res)) return;
        this.setSqlPreview(res.data.result);
        this.setIsShowDrawerForSql(true);
    }

}

export default new store