import { observable, action, computed } from 'mobx';

class HomeStore {
    @observable list = [];
    @action addOne() {
        this.list.push('第' + (this.list.length + 1) + '条数据');
    }
    @computed get listCount() {
        return this.list.length;
    }
}
export default new HomeStore();