/*
 * @Author: zengzijian
 * @Date: 2018-09-29 11:57:27
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-21 11:57:24
 * @Description: 通用的api
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
     * 根据不同类型获取类别列表
     * @param {String} type
     * @returns
     */
    getCategoryListByType(type) {
        console.log(" getCategoryListByType =", type);
        switch (type) {
            case "var":
                type = 'category_var';
                break;
            case "ext":
                type = 'category_ext';
                break;
            case "rule":
                type = 'category_rule';
                break;
            case "ruleSet":
                type = 'category_rule_set';
                break;
            case "strategy":
                type = 'category_strategy';
                break;
            default:
                break;
        }
        return axios.get(`${http.gwApiPrefix}/api/dictionary?keyCode=${type}`).catch(errorHandler)
    },
    /**
     * 首页信息统计
     * @param {*} eventSourceId
     * @returns
     */
    getHomeData(eventSourceId) {
        return axios.get(`${http.gwApiPrefix}/api/eventSources/info/${eventSourceId}`).catch(errorHandler)
    }

}