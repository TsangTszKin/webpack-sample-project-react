/*
 * @Author: zengzijian
 * @Date: 2018-07-24 17:13:32
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-08-28 15:24:34
 * @Description: ** 流程树形组件的Store数据仓库 **
 */
import { observable, action } from 'mobx'

class ProcessTreeStore {

    constructor(props) {
    }

    /**
     * 流程树的数据
     *
     * @memberof ProcessTreeStore
     */
    @observable processTreeJson = null;
    /**
     * 当前流程树形的激活key
     *
     * @memberof ProcessTreeStore
     */
    @observable processTreeActiveNodeKey = '0';

    /**
     * 更新processTreeActiveNodeKey
     *
     * @param {*} value
     * @memberof ProcessTreeStore
     */
    @action updateProcessTreeActiveNodeKey(value) {

        this.processTreeActiveNodeKey = value;
    }

    /**
     * 更新processTreeJson
     *
     * @param {*} value
     * @memberof ProcessTreeStore
     */
    @action updateProcessTreeJson(value) {
        this.processTreeJson = value;
    }

    @action addNode(name, type, secondType, nodeKey) {
        nodeKey = String(nodeKey);
        let keyArray;
        nodeKey === '0' ? keyArray = '0' :
            keyArray = nodeKey.split('·-·');
        let elememnt = {
            name: name,
            type: type,
            secondType: secondType
        }
        switch (keyArray.length) {
            case 1:
                this.processTreeJson.nodes.push(elememnt);
                break;
            case 2:
                if (this.processTreeJson.nodes[keyArray[1]].nodes) {
                    this.processTreeJson.nodes[keyArray[1]].nodes.push(elememnt);
                } else {
                    this.processTreeJson.nodes[keyArray[1]].nodes = [];
                    this.processTreeJson.nodes[keyArray[1]].nodes.push(elememnt);
                }
                break;
            case 3:
                if (this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes) {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes.push(elememnt);
                } else {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes = [];
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes.push(elememnt);
                }
                break;
            case 4:
                if (this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes) {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes.push(elememnt);
                } else {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes = [];
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes.push(elememnt);
                }
                break;
            case 5:
                if (this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes) {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes.push(elememnt);
                } else {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes = [];
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes.push(elememnt);
                }
                break;
            case 6:
                if (this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes) {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes.push(elememnt);
                } else {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes = [];
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes.push(elememnt);
                }
                break;
            case 7:
                if (this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes) {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes.push(elememnt);
                } else {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes = [];
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes.push(elememnt);
                }
                break;
            case 8:
                if (this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes) {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes.push(elememnt);
                } else {
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes = [];
                    this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes.push(elememnt);
                }
                break;
            default:
                break;
        }
    }

    @action subNode(nodeKey) {
        nodeKey = String(nodeKey);
        var keyArray;
        nodeKey === '0' ? keyArray = '0' :
            keyArray = nodeKey.split('·-·');
        var tempArray = [];
        var newTempArray = [];
        switch (keyArray.length) {
            case 1:

                break;
            case 2:
                tempArray = this.processTreeJson.nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[1]) continue;
                    newTempArray.push(element);
                }
                this.processTreeJson.nodes = newTempArray;
                break;
            case 3:
                tempArray = this.processTreeJson.nodes[keyArray[1]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[2]) continue;
                    newTempArray.push(element);
                }
                this.processTreeJson.nodes[keyArray[1]].nodes = newTempArray;
                break;
            case 4:
                tempArray = this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[3]) continue;
                    newTempArray.push(element);
                }
                this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes = newTempArray;
                break;
            case 5:
                tempArray = this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[4]) continue;
                    newTempArray.push(element);
                }
                this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes = newTempArray;
                break;
            case 6:
                tempArray = this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[5]) continue;
                    newTempArray.push(element);
                }
                this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes = newTempArray;
                break;
            case 7:
                tempArray = this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[6]) continue;
                    newTempArray.push(element);
                }
                this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes = newTempArray;
                break;
            case 8:
                tempArray = this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[7]) continue;
                    newTempArray.push(element);
                }
                this.processTreeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes = newTempArray;
                break;
            default:
                break;
        }
    }

    @action changeActiveNode(newNodeKey) {
        console.log('processTreeStore newNodeKey  = '+newNodeKey);
        newNodeKey = String(newNodeKey);
        let treeJson = this.processTreeJson;
        let keyArray;
        newNodeKey === '0' ? keyArray = '0' :
            keyArray = newNodeKey.split('·-·');
        let oldKeyArray;
        this.processTreeActiveNodeKey === '0' ? oldKeyArray = '0' :
            oldKeyArray = this.processTreeActiveNodeKey.split('·-·');
        switch (oldKeyArray.length) {
            case 1:
                treeJson.active = false;
                break;
            case 2:
                treeJson.nodes[oldKeyArray[1]].active = false;
                break;
            case 3:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].active = false;
                break;
            case 4:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].nodes[oldKeyArray[3]].active = false;
                break;
            case 5:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].nodes[oldKeyArray[3]].nodes[oldKeyArray[4]].active = false;
                break;
            case 6:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].nodes[oldKeyArray[3]].nodes[oldKeyArray[4]].nodes[oldKeyArray[5]].active = false;
                break;
            case 7:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].nodes[oldKeyArray[3]].nodes[oldKeyArray[4]].nodes[oldKeyArray[5]].nodes[oldKeyArray[6]].active = false;
                break;
            case 8:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].nodes[oldKeyArray[3]].nodes[oldKeyArray[4]].nodes[oldKeyArray[5]].nodes[oldKeyArray[6]].nodes[oldKeyArray[7]].active = false;
                break;
            default:
                break;
        }
        switch (keyArray.length) {
            case 1:
                treeJson.active = true;
                break;
            case 2:
                treeJson.nodes[keyArray[1]].active = true;
                break;
            case 3:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].active = true;
                break;
            case 4:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].active = true;
                break;
            case 5:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].active = true;
                break;
            case 6:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].active = true;
                break;
            case 7:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].active = true;
                break;
            case 8:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].active = true;
                break;
            default:
                break;
        }
        this.updateProcessTreeActiveNodeKey(newNodeKey);
        this.updateProcessTreeJson(treeJson);
    }

}

export default ProcessTreeStore