/*
 * @Author: zengzijian
 * @Date: 2018-11-16 13:47:01
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-16 18:07:54
 * @Description: 
 */
import { observable, action, computed, toJS } from 'mobx';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message, Modal } from 'antd';

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
        strategyService.submitStrategy(this.getCommitId).then(this.submitSaveDataCallback);
    }
    @action.bound submitSaveDataCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        message.success("提交成功");
    }

    getSqlPreviewForAPI(id) {
        strategyService.getStrategySqlPreview(id).then(this.getSqlPreviewCallback);
    }
    @action.bound getSqlPreviewCallback(res) {
        if (!publicUtils.isOk(res)) return;
        this.setSqlPreview(res.data.result);
        this.setIsShowDrawerForSql(true);
    }
}

export default new store