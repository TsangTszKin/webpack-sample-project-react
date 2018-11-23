/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-22 14:40:22
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
import { observer } from 'mobx-react';
import $ from 'jquery';

let timer = 0;
class store {
    constructor() {
        this.changeEditType = this.changeEditType.bind(this);
        this.getRtqVarById = this.getRtqVarById.bind(this);
        this.addNode = this.addNode.bind(this);
        this.submitSaveData = this.submitSaveData.bind(this);
        this.getSqlPreviewForAPI = this.getSqlPreviewForAPI.bind(this);
    }
    @observable editType = 'info';
    @observable currentName = '';
    @observable nodeId = '';
    @observable processTreeData = {};
    @observable activeNodeKey = 0;
    @observable script = '';
    @observable isAlreadyAdjustHeight = false;
    @observable isLoading = true;
    @observable sqlMode = false;

    @observable isHaveCommitBtn = true;
    @observable isCanCommit = false;
    @observable commitId = '';
    @observable isShowDrawerForSql = false;
    @observable sqlPreview = "";

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

    @computed get getEditType() {
        return toJS(this.editType);
    }
    @action.bound setEditType(value) {
        this.editType = value;
    }

    @computed get getCurrentName() {
        return toJS(this.currentName);
    }
    @action.bound setCurrentName(value) {
        this.currentName = value;
    }

    @computed get getNodeId() {
        return toJS(this.nodeId);
    }
    @action.bound setNodeId(value) {
        this.nodeId = value;
    }

    @computed get getProcessTreeData() {
        return toJS(this.processTreeData);
    }
    @action.bound setProcessTreeData(value) {
        this.processTreeData = value;
    }

    @computed get getActiveNodeKey() {
        return toJS(this.activeNodeKey);
    }
    @action.bound setActiveNodeKey(value) {
        this.activeNodeKey = value;
    }

    @computed get getScript() {
        return toJS(this.script);
    }
    @action.bound setScript(value) {
        this.script = value;
    }

    @computed get getIsAlreadyAdjustHeight() {
        return toJS(this.isAlreadyAdjustHeight);
    }
    @action.bound setIsAlreadyAdjustHeight(value) {
        this.isAlreadyAdjustHeight = value;
    }

    @computed get getIsLoading() {
        return toJS(this.isLoading);
    }
    @action.bound setIsLoading(value) {
        this.isLoading = value;
    }

    @computed get getSqlMode() {
        return toJS(this.sqlMode);
    }
    @action.bound setSqlMode(value) {
        this.sqlMode = value;
    }

    changeEditType = (type, secondType, nodeId) => {
        let editType = '';
        if (type === -1) {
            editType = 'info';
        } else if (type === 0) {
            editType = 'control';
        } else if (type === 1) {

            if (secondType === 2) {
                editType = 'query';
            } else if (secondType === 4) {
                editType = 'assign';
            }
        }
        this.setEditType(editType);
        this.setNodeId(nodeId);
    }

    autoAdjustHeight() {
        let leftPageContentHeight = $("#panel-left .pageContent").height();
        let rightPageContentHeight = $("#panel-right .pageContent").height();
        if (leftPageContentHeight != rightPageContentHeight) {
            // if (leftPageContentHeight > rightPageContentHeight) {
            //     // alert(leftPageContentHeight - 80)
            //     // $("#panel-right .pageContent").height(leftPageContentHeight)
            // } else {
            //     $("#panel-left .pageContent").height(rightPageContentHeight)
            // }
            $("#panel-left .pageContent").height(rightPageContentHeight)
        }
    }

    getRtqVarById(id, activeKey, editType, name) {
        this.setIsLoading(true);
        variableService.getRtqVarById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            let rootNode = {
                type: -1,
                active: true,
                name: res.data.result.name,
                nodes: res.data.result.treeNode,
                id: res.data.result.id
            }
            sessionStorage.rootProcessTreeName = res.data.result.name;
            sessionStorage.rootProcessTreeCode = res.data.result.code;
            this.setCurrentName(res.data.result.name);
            this.setProcessTreeData(rootNode);
            this.setScript(res.data.result.script);
            this.setIsLoading(false);
            this.autoAdjustHeight();
            if (!common.isEmpty(activeKey)) {
                this.setActiveNodeKey(activeKey);
                this.setEditType(editType);
                this.setCurrentName(name);
            }

            if (!this.getIsAlreadyAdjustHeight) {
                this.setIsAlreadyAdjustHeight(this.getIsAlreadyAdjustHeight);
            }

            if (res.data.result.script) {
                this.setSqlMode(true);
            } else {
                let self = this;
                timer = setInterval(function () {
                    self.autoAdjustHeight();
                }, 100)
            }
        })
    }

    addNode(type, parentId, rtqId, name, firstType, secondType, activeKey) {
        function adjustLeftWidth() {
            var panelWidth = $('#edit-panel').width();
            var panelLeftWidth = $("#panel-left").width();
            var panelRightWidth = panelWidth - panelLeftWidth;
            $("#panel-right").width(panelRightWidth - 20 + 'px');
        }
        if (isNaN(activeKey) && activeKey.split('·-·').length == 2 && activeKey.split('·-·')[0] == '0') {
            parentId = null;
        }
        if (type === 'control') {
            common.loading.show();
            variableService.saveControlNode({ parentId: parentId, name: name, rtqId: rtqId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                    adjustLeftWidth();
                }
                this.getRtqVarById(this.props.match.params.id, activeKey, type, name);
                this.setNodeId(res.data.result.id);
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }
        if (type === 'query') {
            common.loading.show();
            variableService.saveQueryNode({ parentId: parentId, name: name, rtqId: rtqId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                    adjustLeftWidth();
                }
                this.getRtqVarById(this.props.match.params.id, activeKey, type, name);
                this.setNodeId(res.data.result.id);
                sessionStorage.newNodeId = res.data.result.id;
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }
        if (type === 'assign') {
            common.loading.show();
            strategyService.saveOutPutNode({ parentId: parentId, name: name, rtqId: rtqId, type: firstType, secondType: secondType }).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return
                if (activeKey.split('·-·').length > Number(sessionStorage.processTreeMaxLength)) {
                    adjustLeftWidth();
                }
                this.getRtqVarById(this.props.match.params.id, activeKey, type, name);
                this.setNodeId(res.data.result.id);
                sessionStorage.newNodeId = res.data.result.id;
                sessionStorage.isFinishNode = '0';
            }).catch(res => {
                common.loading.hide();
            });
        }
    }

    submitSaveData() {
        common.loading.show();
        variableService.submitRtq(this.getCommitId).then(this.submitSaveDataCallback);
    }
    @action.bound submitSaveDataCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        message.success("提交成功");
    }

    getSqlPreviewForAPI(id) {
        variableService.getRtqSqlPreview(id).then(this.getSqlPreviewCallback);
    }
    @action.bound getSqlPreviewCallback(res) {
        if (!publicUtils.isOk(res)) return;
        this.setSqlPreview(res.data.result);
        this.setIsShowDrawerForSql(true);
    }

}

export default new store