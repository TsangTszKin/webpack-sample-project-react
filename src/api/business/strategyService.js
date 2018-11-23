/*
 * @Author: zengzijian
 * @Date: 2018-08-20 15:00:05
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-22 15:56:59
 * @Description: 策略管理的api前端定义
 */
import { Modal } from 'antd'
import axios from 'axios'
import http from '@/config/http'
const errorHandler = error => {
    // message.error("出错了，请稍候再试");
    Modal.error({
        title: '系统提示',
        content: error,
    });
    console.log("出错信息如下");
    console.log(error);
}
export default {
    /**
     * 获取规则列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getRuleList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/rule/list?name=${query.name}&code=${query.code}&category=${query.category}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 获取规则集列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getRuleSetList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/ruleSet/list?name=${query.name}&code=${query.code}&category=${query.category}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 获取策略列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getStrategyList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/strategy/list?name=${query.name}&code=${query.code}&category=${query.category}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 保存规则接口
     * @param {*} params
     * @returns
     */
    saveRule(params) {
        return axios.put(`${http.gwApiPrefix}/api/rule/save`, params).catch(errorHandler)
    },
    /**
     * 根据ID的获取规则详情
     * @param {*} id
     * @returns
     */
    getRuleById(id) {
        return axios.get(`${http.gwApiPrefix}/api/rule/${id}`).catch(errorHandler)
    },
    /**
     * 保存规则集接口
     * @param {*} params
     * @returns
     */
    saveRuleSet(params) {
        return axios.put(`${http.gwApiPrefix}/api/ruleSet/save`, params).catch(errorHandler)
    },
    /**
     * 根据ID的获取规则集详情
     * @param {*} id
     * @returns
     */
    getRuleSetById(id) {
        return axios.get(`${http.gwApiPrefix}/api/ruleSet/${id}`).catch(errorHandler)
    },
    /**
     * 保存出输出节点信息
     * @param {*} params
     * @returns
     */
    saveOutPutNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/save/outPut`, params).catch(errorHandler)
    },
    /**
     * 输出节点的输出结果下拉列表
     * @returns
     */
    getOutPutSelectList() {
        return axios.get(`${http.gwApiPrefix}/api/result/selection`).catch(errorHandler);
    },
    /**
     * 保存输出结果
     * @param {*} params
     * @returns
     */
    saveResult(params) {
        return axios.put(`${http.gwApiPrefix}/api/result/save`, params).catch(errorHandler)
    },
    /**
     * 根据ID获取输出结果详情
     * @param {*} id
     * @returns
     */
    getResultById(id) {
        return axios.get(`${http.gwApiPrefix}/api/result/get/${id}`).catch(errorHandler);
    },
    /**
     * 删除输出结果
     * @param {*} id
     * @returns
     */
    deleteResultById(id) {
        return axios.delete(`${http.gwApiPrefix}/api/result/delete/${id}`).catch(errorHandler);
    },
    /**
     * 获取输出结果列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getResultList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/result/list?name=${query.name}&code=${query.code}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 删除规则
     * @param {*} id
     * @returns
     */
    deleteRule(id) {
        return axios.delete(`${http.gwApiPrefix}/api/rule/delete/${id}`).catch(errorHandler);
    },
    /**
     * 删除规则集
     * @param {*} id
     * @returns
     */
    deleteRuleSetById(id) {
        return axios.delete(`${http.gwApiPrefix}/api/ruleSet/delete/${id}`).catch(errorHandler);
    },
    /**
     * 保存策略接口
     * @param {*} params
     * @returns
     */
    saveStrategy(params) {
        return axios.put(`${http.gwApiPrefix}/api/strategy/save`, params).catch(errorHandler);
    },
    /**
     * 根据ID获取策略详情
     * @param {*} id
     * @returns
     */
    getStrategyById(id) {
        return axios.get(`${http.gwApiPrefix}/api/strategy/${id}`).catch(errorHandler);
    },
    /**
     * 改变策略的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeStrategyStatus(id, type, eventSourceId) {
        console.log(id);
        let ids = '';
        switch (type) {
            case "delete":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.delete(`${http.gwApiPrefix}/api/strategy/batchDelete?${ids}`).catch(errorHandler);
            case "offline":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.post(`${http.gwApiPrefix}/api/strategy/offline?${ids}`).catch(errorHandler);
            case "online":
                id.forEach(element => {
                    ids += 'readyOnLineStrategyIdList=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.post(`${http.gwApiPrefix}/api/strategy/online?${ids}&eventSourceId=${eventSourceId}`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     * 根据类别，事件源，维度，规则集类型获取规则列表
     * @param {*} id
     * @returns
     */
    getRuleListByDimensionForRuleNode(ruleSetType, dimensionId, eventSourceId, category) {
        return axios.get(`${http.gwApiPrefix}/api/rule/allBy?category=${category}&dimensionId=${dimensionId}&eventSourceId=${eventSourceId}&ruleSetType=${ruleSetType}`)
    },
    /**
     * 根据维度获取规则节点的规则集列表
     * @param {*} id
     * @returns
     */
    getRuleSetListByDimensionForRuleNode(eventSourceId, dimensionId, category, type) {
        return axios.get(`${http.gwApiPrefix}/api/ruleSet/allBy?category=${category}&eventSourceId=${eventSourceId}&dimensionId=${dimensionId}&type=${type}`).catch(errorHandler);
    },
    /**
     * 获取挑战者冠军列表
     * @param {*} eventSourceId
     * @returns
     */
    getChampionList(eventSourceId) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/champion?eventSourceId=${eventSourceId}`).catch(errorHandler)
    },
    /**
     * 根据多个事件源ID获取策略列表
     * @param {array} eventSourceIds
     * @returns
     */
    getStrategyListByEventSourceIds(eventSourceIds) {
        return axios.post(`${http.gwApiPrefix}/api/data/event/strategyList`, eventSourceIds).catch(errorHandler)
    },
    /**
     * 获取策略的SQL预览
     * @param {String} id
     * @returns
     */
    getStrategySqlPreview(id) {
        return axios.get(`${http.gwApiPrefix}/api/strategy/sql/${id}`).catch(errorHandler)
    },
     /**
     * 获取规则的SQL预览
     * @param {String} id
     * @returns
     */
    getRuleSqlPreview(id) {
        return axios.get(`${http.gwApiPrefix}/api/rule/sql/${id}`).catch(errorHandler)
    },
    /**
    * 规则提交
    * @param {*} id
    * @returns
    */
    submitRule(id) {
        return axios.post(`${http.gwApiPrefix}/api/rule/submit`, { id: id }).catch(errorHandler);
    },
    /**
     * 规则集提交
     * @param {*} id
     * @returns
     */
    submitRuleSet(id) {
        return axios.post(`${http.gwApiPrefix}/api/ruleSet/submit`, { id: id }).catch(errorHandler);
    },
    /**
     * 策略提交
     * @param {*} id
     * @returns
     */
    submitStrategy(id) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/submit`, { id: id }).catch(errorHandler);
    }
}