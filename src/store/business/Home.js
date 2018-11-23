
import { observable, action, toJS, computed } from 'mobx';
import { message } from 'antd';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import variableService from '@/api/business/variableService';
import commonService from '@/api/business/commonService';

class Store {
    constructor() {
        this.getEventSourceSelectListForApi = this.getEventSourceSelectListForApi.bind(this);
        this.getHomeDataForApi = this.getHomeDataForApi.bind(this);
    }

    @observable eventSourceList = []// {"eventSourceType": "", "eventSourceId": ""}

    @observable isLoading = true;

    @observable statistics = {
        "requestSum": '',
        "failSum": '',
        "hitSum": '',

        get getRequestSum() { return toJS(this.requestSum) },
        setReuquestSum(value) { this.requestSum = value },

        get getFailSum() { return toJS(this.failSum) },
        setFailSum(value) { this.failSum = value },

        get getHitSum() { return toJS(this.hitSum) },
        setHitSum(value) { this.hitSum = value },
    }

    @observable varData = {
        "eventVarSum": '',
        "eventVarOnline": '',
        "extVarSum": '',
        "extVarOnline": '',
        "rtqVarSum": '',
        "rtqVarOnline": '',

        get getEventVarSum() { return toJS(this.eventVarSum) },
        setEventVarSum(value) { this.eventVarSum = value },

        get getEventVarOnline() { return toJS(this.eventVarOnline) },
        setEventVarOnline(value) { this.eventVarOnline = value },

        get getExtVarSum() { return toJS(this.extVarSum) },
        setExtVarSum(value) { this.extVarSum = value },

        get getExtVarOnline() { return toJS(this.extVarOnline) },
        setExtVarOnline(value) { this.extVarOnline = value },

        get getRtqVarSum() { return toJS(this.rtqVarSum) },
        setRtqVarSum(value) { this.rtqVarSum = value },

        get getRtqVarOnline() { return toJS(this.rtqVarOnline) },
        setRtqVarOnline(value) { this.rtqVarOnline = value },
    }

    @observable strategyData = {
        "strategySum": '',
        "strategyOnline": '',
        "flowStrategySum": '',
        "flowStrategyOnline": '',
        "greedyStrategySum": '',
        "greedyStrategyOnline": '',
        "ruleSum": '',
        "ruleOnline": '',
        "ruleSetSum": '',
        "ruleSetOnline": '',

        get getStrategySum() { return toJS(this.strategySum) },
        setStrategySum(value) { this.strategySum = value },

        get getStrategyOnline() { return toJS(this.strategyOnline) },
        setStrategyOnline(value) { this.strategyOnline = value },

        get getFlowStrategySum() { return toJS(this.flowStrategySum) },
        setFlowStrategySum(value) { this.flowStrategySum = value },

        get getFlowStrategyOnline() { return toJS(this.flowStrategyOnline) },
        setFlowStrategyOnline(value) { this.flowStrategyOnline = value },

        get getGreedyStrategySum() { return toJS(this.greedyStrategySum) },
        setGreedyStrategySum(value) { this.greedyStrategySum = value },

        get getGreedyStrategyOnline() { return toJS(this.greedyStrategyOnline) },
        setGreedyStrategyOnline(value) { this.greedyStrategyOnline = value },

        get getRuleSum() { return toJS(this.ruleSum) },
        setRuleSum(value) { this.ruleSum = value },

        get getRuleOnline() { return toJS(this.ruleOnline) },
        setRuleOnline(value) { this.ruleOnline = value },

        get getRuleSetSum() { return toJS(this.ruleSetSum) },
        setRuleSetSum(value) { this.ruleSetSum = value },

        get getRuleSetOnline() { return toJS(this.ruleSetOnline) },
        setRuleSetOnline(value) { this.ruleSetOnline = value },
    }

    @observable strategyList = [];

    @computed get getEventSourceList() { return toJS(this.eventSourceList); }
    @action.bound setEventSourceList(value) { this.eventSourceList = value; }

    @computed get getIsLoading() { return toJS(this.isLoading); }
    @action.bound setIsLoading(value) { this.isLoading = value; }

    @computed get getStrategyList() { return toJS(this.strategyList); }
    @action.bound setStrategyList(value) { this.strategyList = value; }

    getEventSourceSelectListForApi() {
        variableService.getEventSourceSelectList(false).then(this.getEventSourceSelectListForApiCallback);
    }
    @action.bound getEventSourceSelectListForApiCallback(res) {
        if (!publicUtils.isOk(res)) return;
        this.setEventSourceList(res.data.result);
        if (!common.isEmpty(res.data.result))
            this.getHomeDataForApi(res.data.result[0].eventSourceId);
    }

    getHomeDataForApi(eventSourceId) {
        commonService.getHomeData(eventSourceId).then(this.getHomeDataForApiCallback);
    }
    @action.bound getHomeDataForApiCallback(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        let data = res.data.result;
        this.statistics.setReuquestSum(common.isEmpty(data.requestSum) ? '' : data.requestSum);
        this.statistics.setFailSum(common.isEmpty(data.failSum) ? '' : data.failSum);
        this.statistics.setHitSum(common.isEmpty(data.hitSum) ? '' : data.hitSum);
        this.varData.setEventVarSum(common.isEmpty(data.eventVarSum) ? '' : data.eventVarSum);
        this.varData.setEventVarOnline(common.isEmpty(data.eventVarOnline) ? '' : data.eventVarOnline);
        this.varData.setExtVarSum(common.isEmpty(data.extVarSum) ? '' : data.extVarSum);
        this.varData.setExtVarOnline(common.isEmpty(data.extVarOnline) ? '' : data.extVarOnline);
        this.varData.setRtqVarSum(common.isEmpty(data.rtqVarSum) ? '' : data.rtqVarSum);
        this.varData.setRtqVarOnline(common.isEmpty(data.rtqVarOnline) ? '' : data.rtqVarOnline);
        this.strategyData.setStrategySum(common.isEmpty(data.strategySum) ? '' : data.strategySum);
        this.strategyData.setStrategyOnline(common.isEmpty(data.strategyOnline) ? '' : data.strategyOnline);
        this.strategyData.setFlowStrategySum(common.isEmpty(data.flowStrategySum) ? '' : data.flowStrategySum);
        this.strategyData.setFlowStrategyOnline(common.isEmpty(data.flowStrategyOnline) ? '' : data.flowStrategyOnline);
        this.strategyData.setGreedyStrategySum(common.isEmpty(data.greedyStrategySum) ? '' : data.greedyStrategySum);
        this.strategyData.setGreedyStrategyOnline(common.isEmpty(data.greedyStrategyOnline) ? '' : data.greedyStrategyOnline);
        this.strategyData.setRuleSum(common.isEmpty(data.ruleSum) ? '' : data.ruleSum);
        this.strategyData.setRuleOnline(common.isEmpty(data.ruleOnline) ? '' : data.ruleOnline);
        this.strategyData.setRuleSetSum(common.isEmpty(data.ruleSetSum) ? '' : data.ruleSetSum);
        this.strategyData.setRuleSetOnline(common.isEmpty(data.ruleSetOnline) ? '' : data.ruleSetOnline);

        this.setStrategyList(common.isEmpty(data.strategyInfoVOS) ? [] : data.strategyInfoVOS);
    }
}

export default new Store