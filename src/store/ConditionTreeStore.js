/*
 * @Author: zengzijian
 * @Date: 2018-07-24 17:13:32
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-08-27 14:57:12
 * @Description: ** 条件树形组件的Store数据仓库 **
 */
import { observable, action } from 'mobx'

class ConditionTreeStore {

    constructor(props) {
    }

    /**
     * 条件树的数据
     *
     * @memberof ConsitionTreeStore
     */
    @observable conditionTreeJson = null;


    /**
     * 更新processTreeJson
     *
     * @param {*} value
     * @memberof ConsitionTreeStore
     */
    @action updateConditionTreeJson(value) {
        // console.log("updateConditionTreeJson value", value);
        this.conditionTreeJson = value;
        // console.log("updateConditionTreeJson conditionTreeJson", this.conditionTreeJson);
    }

    @action addNode(nodeKey, type, expressionVO, isBranch) {
        let self = this;
        let temp = {
            expressionVO: {
                "varCode": "",
                "varName": "",
                "varType": "",
                "optType": "",
                "value": "",
                "valueType": 0,
                "valueCode": "",
                "valueName": ""
            },
            relType: type === 'and' ? 0 : 1,
            nodeType: 1
        }
        let keyArray = [];
        if (!isBranch) {
            //点击节点的加号
            nodeKey == 0 ?
                self.conditionTreeJson.push(temp)
                :
                (() => {
                    keyArray = nodeKey.split('·-·');
                    switch (keyArray.length) {
                        case 2:
                            self.conditionTreeJson[keyArray[0]].conditions.push(temp);
                            break;
                        case 3:
                            if (keyArray[0] == 0 && keyArray[1] == 0 && keyArray[2] == 0) {
                                self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.push(temp);
                            } else {
                                if (keyArray[1] == keyArray[2] && keyArray[1] == 0) self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.push(temp);
                                else {
                                    self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.push(temp);
                                }
                            }

                            break;
                        case 4:
                            self.conditionTreeJson.bro[keyArray[1]].bro[keyArray[2]].bro[keyArray[3]].bro ? self.conditionTreeJson.bro[keyArray[1]].bro[keyArray[2]].bro[keyArray[3]].bro.push(temp) : self.conditionTreeJson.bro[keyArray[1]].bro[keyArray[2]].bro[keyArray[3]].bro = [temp];
                            break;
                        default:
                            break;
                    }
                })()
        } else {
            //点击表达式的加号
            if (isNaN(nodeKey)) {//非第一层
                keyArray = nodeKey.split('·-·');
                let selfCondition;
                switch (keyArray.length) {
                    case 2:
                        selfCondition = self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]];
                        self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions = [{ relType: selfCondition.relType, nodeType: selfCondition.nodeType, expressionVO: selfCondition.expressionVO }];
                        self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.push(temp);
                        self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].nodeType = 2;
                        delete self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].expressionVO;
                        if (self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].id) {
                            self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions[0].id = self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].id;
                            delete self.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].id;
                        }
                        break;
                    default:
                        break;
                }

            } else {//第一层
                let selfCondition = self.conditionTreeJson[nodeKey];
                self.conditionTreeJson[nodeKey].conditions = [{ relType: selfCondition.relType, nodeType: selfCondition.nodeType, expressionVO: selfCondition.expressionVO }];
                self.conditionTreeJson[nodeKey].conditions.push(temp);
                self.conditionTreeJson[nodeKey].nodeType = 2;
                delete self.conditionTreeJson[nodeKey].expressionVO;
                if (self.conditionTreeJson[nodeKey].id) {
                    self.conditionTreeJson[nodeKey].conditions[0].id = self.conditionTreeJson[nodeKey].id;
                    delete self.conditionTreeJson[nodeKey].id;
                }
            }
        }

    }

    @action subNode(nodeKey) {
        let keyArray;
        var tempArray = [];
        var newTempArray = [];
        let size;
        if (isNaN(nodeKey)) {
            keyArray = nodeKey.split('·-·');
            switch (keyArray.length) {
                case 2:
                    size = this.conditionTreeJson[keyArray[0]].conditions.length;
                    if (size > 2) {
                        this.conditionTreeJson[keyArray[0]].conditions.splice(keyArray[1], 1);
                    } else {
                        this.conditionTreeJson[keyArray[0]].nodeType = 1;
                        if (keyArray[1] == 0) {
                            let tempNode = this.conditionTreeJson[keyArray[0]].conditions[1];
                            this.conditionTreeJson[keyArray[0]].relType = tempNode.relType;
                            this.conditionTreeJson[keyArray[0]].nodeType = tempNode.nodeType;
                            if (tempNode.nodeType == 2) {
                                this.conditionTreeJson[keyArray[0]].conditions = tempNode.conditions;
                            } else {
                                this.conditionTreeJson[keyArray[0]].expressionVO = tempNode.expressionVO;
                                delete this.conditionTreeJson[keyArray[0]].conditions;
                            }

                        } else {
                            let tempNode = this.conditionTreeJson[keyArray[0]].conditions[0];
                            this.conditionTreeJson[keyArray[0]].relType = tempNode.relType;
                            this.conditionTreeJson[keyArray[0]].expressionVO = tempNode.expressionVO;
                            delete this.conditionTreeJson[keyArray[0]].conditions;
                        }
                    }
                    break;
                case 3:
                    size = this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.length;
                    if (size > 2) {
                        this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions.splice(keyArray[2], 1);
                    } else {
                        if (keyArray[2] == 0) {
                            this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].nodeType = 1;
                            let tempNode = this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions[1];
                            this.conditionTreeJson[keyArray[0]].relType = tempNode.relType;
                            this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].relType = tempNode.relType;
                            this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].expressionVO = tempNode.expressionVO;
                            delete this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions;
                        } else {
                            console.log("this.conditionTreeJson",this.conditionTreeJson);
                            this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].nodeType = 1;
                            let tempNode = this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions[0];
                            this.conditionTreeJson[keyArray[0]].relType = tempNode.relType;
                            this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].relType = tempNode.relType;
                            this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].expressionVO = tempNode.expressionVO;
                            delete this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions;
                        }
                    }
                    break;

                default:
                    break;
            }
        } else {
            this.conditionTreeJson.splice(nodeKey, 1);
        }
    }

    @action updateNodeData = (nodeKey, name, value) => {
        console.log(`${nodeKey}  ${name} ${value}`);
        if (isNaN(nodeKey)) {
            let keyArray = [];
            keyArray = nodeKey.split('·-·');
            switch (keyArray.length) {
                case 2:
                    this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].expressionVO[name] = value;
                    break;
                case 3:
                    this.conditionTreeJson[keyArray[0]].conditions[keyArray[1]].conditions[keyArray[2]].expressionVO[name] = value;
                    break;

                default:
                    break;
            }
        } else {
            this.conditionTreeJson[nodeKey].expressionVO[name] = value;
        }

        console.log(this.conditionTreeJson);
    }

}

export default ConditionTreeStore