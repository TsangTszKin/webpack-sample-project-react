/*
 * @Author: zengzijian
 * @Date: 2018-08-20 14:25:34
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-08-20 14:44:40
 * @Description: 
 */
export default {

    /**
     * '变量管理'中变量的状态
     *
     * @param {*} status
     * @returns
     */
    variableStatus(status) {
        let resultStr;
        if (isNaN(status)) {
            return status
        } else {
            switch (status) {
                case 0:
                    resultStr = '未就绪';
                    break;
                case 1:
                    resultStr = '已就绪';
                    break;
                case 2:
                    resultStr = '上线中';
                    break;
                case 3:
                    resultStr = '下线中';
                    break;
                case 4:
                    resultStr = '已上线';
                    break;
                case 5:
                    resultStr = '删除中';
                    break;
                case 6:
                    resultStr = '已出错';
                    break;
                default:
                     resultStr = '未知状态';
                    break;
            }
            return resultStr;
        }

    }
}