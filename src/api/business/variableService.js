/*
 * @Author: zengzijian
 * @Date: 2018-08-20 15:00:05
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-19 14:53:48
 * @Description: 变量管理的api前端定义
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
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';  //此处是增加的代码，设置请求头的类型
export default {
    /**
     * 获取事件变量列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getEventVarList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/eventVar/list?name=${query.name}&code=${query.code}&eventSourceId=${query.eventSourceId}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 获取批次变量列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns
     */
    getBatchVarList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/bachVar/list?name=${query.name}&code=${query.code}&category=${query.category}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 获取实时变量列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns
     */
    getRTQVarList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/list?name=${query.name}&code=${query.code}&category=${query.category}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 获取衍生变量列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns
     */
    getExtVarList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/extVar/list?name=${query.name}&code=${query.code}&category=${query.category}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 事件源下拉列表
     * @param {Boolean} showDimension
     * @returns
     */
    getEventSourceSelectList(showDimension) {
        return axios.get(`${http.gwApiPrefix}/api/eventSources/selection?showDimension=${showDimension}`).catch(errorHandler);
    },

    /**
     * 保存实时查询变量（信息维护）
     * @param {*} params
     * @returns
     */
    saveRtqVar(params) {
        return axios.put(`${http.gwApiPrefix}/api/rtqVar/save`, params).catch(errorHandler);
    },

    /**
     * 保存控制节点信息
     * @param {*} params
     * @returns
     */
    saveControlNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/save/condition`, params).catch(errorHandler);
    },

    /**
     * 保存查询节点信息
     * @param {*} params
     * @returns
     */
    saveQueryNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/save/selectNode`, params).catch(errorHandler);
    },
    /**
    * 生成查询节点sql
    * @param {*} params
    * @returns
    */
    sqlQueryNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/selectNode/sql`, params).catch(errorHandler);
    },
    /**
    * 保存规则节点信息
    * @param {*} params
    * @returns
    */
    saveRuleNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/save/ruleNode`, params).catch(errorHandler);
    },
    /**
     * 保存规则集节点信息
     * @param {*} params
     * @returns
     */
    saveRuleSetNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/save/ruleSetNode`, params).catch(errorHandler);
    },
    /**
     * 保存策略（贪婪模式）规则集
     * @param {*} params
     * @returns
     */
    saveRuleSetNodeForGreedy(ruleSetId, strategyId) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/save/ruleSet?ruleSetId=${ruleSetId}&strategyId=${strategyId}`).catch(errorHandler)
    },
    /**
     * 删除策略（贪婪模式）规则集
     * @param {*} params
     * @returns
     */
    deleteRuleSetNOdeForGreedy(ruleSetId, strategyId) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/delete/ruleSet?ruleSetId=${ruleSetId}&strategyId=${strategyId}`).catch(errorHandler)
    },
    /**
     * 获取所有变量列表（级联选择）
     * @returns
     */
    getAllVarList(id, type) {
        switch (type) {
            case "rtq":
                return axios.get(`${http.gwApiPrefix}/api/var/selection/var?rtqVarId=${id}`).catch(errorHandler);
            case "rule":
                return axios.get(`${http.gwApiPrefix}/api/var/selection/var?ruleId=${id}`).catch(errorHandler);
            case "strategy":
                return axios.get(`${http.gwApiPrefix}/api/var/selection/var?strategyId=${id}`).catch(errorHandler);
            case "ext":
                return axios.get(`${http.gwApiPrefix}/api/var/selection/var?eventSourceId=${sessionStorage.tempEventSourceId}&dimensionId=${sessionStorage.tempDimensionId}`).catch(errorHandler);
            default:
                errorHandler();
                break;
        }

    },
    /**
     * 根据ID查询实时查询变量
     * @param {*} id
     * @returns
     */
    getRtqVarById(id) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/get/${id}`).catch(errorHandler)
    },
    /**
     * 根据节点ID和节点类型获取节点信息
     * @param {*} id
     * @param {*} type
     * @returns
     */
    getNodeByIdAndType(id, type) {
        return axios.get(`${http.gwApiPrefix}/api/`).catch(errorHandler);
    },
    /**
     * 选择表
     * @returns
     */
    getTableList() {
        return axios.get(`${http.gwApiPrefix}/api/table/selection`).catch(errorHandler);
    },
    /**
     * 获取实时查询变量下的临时变量(下拉框调用)
     * @param {*} id
     * @returns
     */
    getTempVarListByRtqId(id) {
        return axios.get(`${http.gwApiPrefix}/api/tempVar/byRtq/${id}`).catch(errorHandler);
    },
    /**
     * 根据实时查询变量获取全部节点
     * @param {*} id
     * @returns
     */
    getParantNodeById(id) {
        return axios.put(`${http.gwApiPrefix}/api/node/findByRtqId/${id}`).catch(errorHandler);
    },
    /**
     * 根据ID获取节点详情
     * @param {*} id
     * @returns
     */
    getNodeDetailById(id) {
        return axios.get(`${http.gwApiPrefix}/api/node/get/${id}`).catch(errorHandler)
    },
    /**
     * 改变实时查询变量的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeRtqVarStatus(id, type) {
        console.log(id);
        let ids = '';
        switch (type) {
            case "delete":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.delete(`${http.gwApiPrefix}/api/rtqVar/batchDelete?${ids}`).catch(errorHandler);
            case "offline":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.post(`${http.gwApiPrefix}/api/rtqVar/upStatus?${ids}&onOff=false`).catch(errorHandler);
            case "online":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.post(`${http.gwApiPrefix}/api/rtqVar/upStatus?${ids}&onOff=true`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     * 改变实时衍生变量的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeExtVarStatus(id, type) {
        console.log(id);
        let ids = '';
        switch (type) {
            case "delete":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.delete(`${http.gwApiPrefix}/api/extVar/batchDelete?${ids}`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     * 改变实时查询变量的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeRuleSetGreedyStatus(id, onOff) {
        if (onOff === 'online') {
            onOff = true;
        } else {
            onOff = false;
        }
        console.log(id);
        let ids = '';
        id.forEach(element => {
            ids += 'ids=' + element + '&';
        });
        ids = ids.substr(0, ids.length - 1);
        return axios.post(`${http.gwApiPrefix}/api/rule/upStatus?${ids}&onOff=${onOff}`).catch(errorHandler);
    },
    /**
     * 获取数据类型下拉列表的数据
     * @returns
     */
    getDataTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/statusType`).catch(errorHandler)
    },
    /**
     * 删除实时查询变量的节点
     * @param {*} id
     * @returns
     */
    deleteNode(id) {
        return axios.delete(`${http.gwApiPrefix}/api/node/delete/${id}`).catch(errorHandler);
    },
    /**
     * 枚举列表 type取值expressionVarType， expressionFunctionType, dateType
     * @returns
     */
    getEnumList(type) {
        return axios.get(`${http.gwApiPrefix}/api/var/${type}`).catch(errorHandler);
    },
    /**
     * 表达式值类型列表
     * @returns
     */
    getExpressionValueTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/expressionValueType`).catch(errorHandler)
    },
    /**
     * 获取函数列表
     * @returns
     */
    functionTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/functionType`).catch(errorHandler);
    },
    /**
     * 控制节点解析SQL
     * @param {*} params
     * @returns
     */
    controlNodeTranslateToSql(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/condition/sql`, params).catch(errorHandler);
    },
    /**
     * 获取条件树的条件操作符类型列表
     * @returns
     */
    getOptTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/optType`).catch(errorHandler);
    },
    /**
     * 保存衍生变量
     * @param {*} params
     * @returns
     */
    saveExtVar(params) {
        return axios.put(`${http.gwApiPrefix}/api/extVar/save`, params).catch(errorHandler);
    },
    /**
     * 根据ID查询衍生变量
     * @param {*} id
     * @returns
     */
    getExtVarById(id) {
        return axios.get(`${http.gwApiPrefix}/api/extVar/get/${id}`).catch(errorHandler)
    },
    /**
     * 测试衍生变量
     * @param {*} checkValue
     * @param {*} params
     * @returns
     */
    testExtVar(checkValue, params) {
        return axios.post(`${http.gwApiPrefix}/api/extVar/checkValue?varValue=${checkValue}`, params).catch(errorHandler)
    },
    /**
     * 获取实时查询变量的SQL预览
     * @param {String} id
     * @returns
     */
    getRtqSqlPreview(id) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/sql/${id}`).catch(errorHandler)
    },
    /**
     * 实时查询变量提交
     * @param {*} id
     * @returns
     */
    submitRtq(id) {
        return axios.post(`${http.gwApiPrefix}/api/rtqVar/submit`, { id: id }).catch(errorHandler);
    }
}