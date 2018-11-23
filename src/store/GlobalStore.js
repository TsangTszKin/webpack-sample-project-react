/*
 * @Author: zengzijian
 * @Date: 2018-07-24 17:13:32
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-07-25 10:06:37
 * @Description: ** 全局Store数据仓库 **

    直接实例化，在 ./index.js 通过 Provider 渗透。
    在模块内用 @inject('Store')，将 Store 注入到 props 上。
    哪里用，哪里 @inject('Store')。

    注意：无论是全局 Store，还是局部 store，必须 @inject('xxx')注入到 props 上才能获取，保证结构的一致性。
 */
import { observable, action } from 'mobx';

class GlobalStore {

    constructor(props) {

    }

    /**
     *数据提交状态，一般用来控制提交按钮
     *
     * @memberof Store
     */
    @observable isSubmiting = false;
    /**
     *菜单是否关闭状态
     *
     * @memberof GlobalStore
     */
    @observable menuCollapsed = false;

    @observable userInfo = {
        name: ''
    }
    @observable loading = false;
    @observable menu = null;

    @observable treeJson = null

    @action updateMenu = (menu) => {
        this.menu = menu;
    }
    @action updateName = (name) => {
        this.userInfo.name = name;
    }
    @action updateLoading = (boolean) => {
        this.loading = boolean;
    }
    @action
    updateIsSubmiting(value) {
        this.isSubmiting = value;
    }
    @action
    updateMenuCollapsed(value) {
        this.menuCollapsed = value;
    }
}

export default GlobalStore