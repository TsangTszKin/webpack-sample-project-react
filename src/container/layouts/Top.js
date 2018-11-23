import React, { Component } from 'react';
import logo from '@/assets/logo.png';
import Cookies from 'js-cookie';
import { Tooltip, Tabs, Avatar, Button, Icon, Menu, Dropdown } from 'antd';
import { inject } from 'mobx-react';
import { Route, withRouter } from 'react-router-dom';
import TopNav from '@/components/TopNav';
import PropTypes from 'prop-types';

@inject('GlobalStore') 
@withRouter
class Top extends Component {
    constructor(props) {
        super(props);
        this.resizePanelCallBackFunc = this.resizePanelCallBackFunc.bind(this);
        this.resizePanelCallBackFunc();
    }

    componentDidMount() {
        // let self = this;
        // window.onresize = function () {
        //     self.resizePanelCallBackFunc();
        // }

    }

    resizePanelCallBackFunc = () => {
        let winWidth = 0;
        if (window.innerWidth) winWidth = window.innerWidth;
        else if (document.body && document.body.clientWidth)     //IE 
            winWidth = document.body.clientWidth;
        if (winWidth < 1190 && !this.props.collapsed) {
            this.props.changeCollapsed();
        }
    }

    logout = () => {
        localStorage.removeItem('JSESSIONID');
        localStorage.removeItem('userName');
        this.props.history.replace('/login')
    }
    callback = (key) => {
        console.log(key);
    }
    componentWillMount() {
        let { userInfo, updateName } = this.props.GlobalStore
        if (userInfo.name == '') {
            updateName(localStorage.userName)
        }
    }
    render() {
        const { name } = this.props.GlobalStore.userInfo;
        const menu = (
            <Menu>
                <Menu.Item key="1" onClick={() => this.logout()}><Icon type="logout" /><span style={{ marginLeft: "5px" }}>退出</span></Menu.Item>
            </Menu>
        );
        console.log('menu------');
        console.log(this.props.collapsed);
        return (
            <div className='header clear clearFix'>
                <div className="aside-o">
                    <Button className="aside-ctr" type="primary" onClick={this.props.changeCollapsed}>
                        <Icon type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'} />
                    </Button>

                </div>
                <div className="nav-o">
                    <TopNav />
                </div>

                <div className='user'>
                    <Avatar size="small" icon="user" />
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link name" href="javascript:void(0);">
                            {name}<Icon type="down" />
                        </a>
                    </Dropdown>
                </div>
            </div>
        )
    }
}
Top.propTypes = {
    changeCollapsed: PropTypes.func,
    collapsed: PropTypes.bool
}
Top.defaultProps = {
    changeCollapsed: () => { },
    collapsed: false
}
export default Top