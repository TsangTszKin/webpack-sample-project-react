/*
 * @Author: zengzijian
 * @Date: 2018-11-05 11:48:08
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-14 11:19:20
 * @Description: 数据分析接口
 */
import $ from 'jquery'
import { Modal } from 'antd'
import axios from 'axios'
import http from '@/config/http'
import { Axis } from 'viser-react';
const errorHandler = error => {
    console.log("出错信息如下");
    console.log(error);
    // message.error("出错了，请稍候再试");
    Modal.error({
        title: '系统提示',
        content: error,
    });

}
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';  //此处是增加的代码，设置请求头的类型
export default {
    /**
     * 事件分析-事件明细列表
     * @param {*} params
     * @returns
     */
    getEventDetails(params) {
        return axios.post(`${http.gwApiPrefix}/api/data/event/detail`, params).catch(errorHandler)
    },
    /**
     * 获取指定事件源下的字段列表
     * @param {*} params
     * @returns
     */
    getEventCols(values) {
        let paramsForUrl = '';
        values.forEach(element => {
            paramsForUrl += `eventSourceIds=${element}&`;
        })
        paramsForUrl = paramsForUrl.substr(0, paramsForUrl.length - 1);
        return axios.post(`${http.gwApiPrefix}/api/data/event/cols?${paramsForUrl}`).catch(errorHandler)
    },
    /**
     * 获取事件源列表及其每个事件源下的策略列表
     * @returns
     */
    getEventSourceListAndStrategyList() {
        return axios.get(`${http.gwApiPrefix}/api/data/event/strategy`).catch(errorHandler)
    },
    getRuleListByStrategyList(values) {
        let paramsForUrl = '';
        values.forEach(element => {
            paramsForUrl += `strategyIds=${element}&`;
        })
        paramsForUrl = paramsForUrl.substr(0, paramsForUrl.length - 1);
        return axios.post(`${http.gwApiPrefix}/api/data/strategy/rule?${paramsForUrl}`).catch(errorHandler)
    }
}