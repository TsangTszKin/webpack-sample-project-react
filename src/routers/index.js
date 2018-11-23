import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Provider } from 'mobx-react';
import Layouts from './layouts'
import GlobalStore from '@/store/GlobalStore'
import Login from './Login'
import Cookies from 'js-cookie'
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
// import "antd/dist/antd.less";   // 引入官方提供的 less 样式入口文件
import "@/styles/default.less";   // 用于覆盖上面定义的变量

@withRouter
class Routers extends Component {
    constructor(props) {
        super(props)
        this.pathname = this.props.location.pathname;
        this.globalStore = new GlobalStore();
    }
    checkJsessionID = () => {
        if (this.props.location.pathname != '/login') {
            if (!localStorage.JSESSIONID) {
                this.props.history.replace('/login')
            }
        } else {
            if (localStorage.JSESSIONID) {
                this.props.history.replace('/business/home')
            }
        }
    }
    componentWillMount() {
        if (this.pathname === '/') {
            if (localStorage.JSESSIONID) {
                this.props.history.replace('/business/home')
            } else {
                this.props.history.replace('/login')
            }
        } else {
            this.checkJsessionID()
        }
    }
    componentWillReceiveProps() {
        this.checkJsessionID()
    }
    render() {
        return (
            <Provider GlobalStore={this.globalStore}>
                <LocaleProvider locale={zh_CN}>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path='/' component={Layouts} />
                    </Switch>
                </LocaleProvider>
            </Provider>
        )
    }
}

export default Routers