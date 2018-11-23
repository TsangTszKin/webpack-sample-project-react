/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-16 17:31:13
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message, Modal } from 'antd';
import TableAction from '@/components/business/variable/derivation/TableAction';
import Status from '@/components/Status';
import React from 'react';

class store {
    @observable isHaveCommitBtn = false;

    @computed get getIsHaveCommitBtn() {
        return toJS(this.isHaveCommitBtn);
    }
    @action.bound setIsHaveCommitBtn(value) {
        this.isHaveCommitBtn = value;
    }
}

export default new store