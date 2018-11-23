/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:33:02
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-22 14:24:47
 * @Description: 根据环境不同，采用不同的请求配置
 */

const development = {
    gwApiPrefix: 'http://192.168.0.72:7081',
}

const developmentTest = {
    gwApiPrefix: 'http://192.168.0.72:6081',
}

const production = {
    // gwApiPrefix: 'http://192.168.0.72:7081',
    gwApiPrefix: '',
}

const test = {
    gwApiPrefix: '',
}

const test2 = {
    gwApiPrefix: '',
}

const huanjia = {
    gwApiPrefix: 'http://192.168.0.123:7081',
}

const huanjiaTest = {
    gwApiPrefix: 'http://192.168.0.123:6081',
}

const mingxing = {
    gwApiPrefix: 'http://192.168.0.113:7081',
}

const weidong = {
    gwApiPrefix: 'http://192.168.0.110:7081',
}

const quanwei = {
    gwApiPrefix: 'http://192.168.0.124:7081',
}

var result;
switch (process.env.type) {
    case 'development':
        // result = huanjiaTest;
        // result = huanjia;
        // result = mingxing;
        result = development;
        // result = quanwei;
        // result = developmentTest;
        // result = weidong;
        break;
    case 'test':
        result = test;
        break;
    case 'test2':
        result = test2;
        break;
    case 'production':
        result = production;
        break;

    default:
        result = development;
        break;
}
// noinspection JSAnnotator
export default result;