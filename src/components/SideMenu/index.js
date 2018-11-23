import React, { Component } from 'react'
import { withRouter, Route, Switch } from 'react-router-dom'
import { Menu, Icon, Button } from 'antd'
import { browserHistory, Lifecycle, Router, IndexRoute } from 'react-router';
const SubMenu = Menu.SubMenu
import '@/styles/side-menu.less'
import { inject } from 'mobx-react'
import systemManagement from '@/config/menu/system'
import businessManagement from '@/config/menu/business'
import dataAnalysis from '@/config/menu/analysis'
/**
 * 侧导航栏菜单
 * 
 * @class SideMenu
 * @extends {Component}
 */
@inject('GlobalStore') @withRouter
class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keys: [],
            collapsed: false,
            style: {
                width: '250px'
            },
            defaultOpenKeys: []
        }
        this.initMenuActive = this.initMenuActive.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
    }

    initMenuActive = () => {
        let pathname = this.props.history.location.pathname;
        let tempArray = pathname.split('/');
        let openMenukey = '/' + tempArray[1] + '/' + tempArray[2];
        let activeMenuOption = openMenukey + '/' + tempArray[3];
        this.setState({
            keys: [activeMenuOption],
            defaultOpenKeys: [openMenukey]
        })
    }
    componentWillMount() {
        this.initMenuActive();
    }
    onSelect = ({ key }) => {
        console.log("key", key);
        this.props.history.push(key)
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            collapsed: nextProps.collapsed
        });
        if (this.props.location.pathname != nextProps.location.pathname) {
            this.initMenuActive()
        }
    }
    shouldComponentUpdate() {
    }
    componentWillUpdate() {
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.collapsed !== this.props.collapsed) {
            if (nextProps.collapsed) {
                this.setState({
                    style: {
                        width: "80px"
                    }
                })
            } else {
                this.setState({
                    style: {
                        width: "250px"
                    }
                })
            }
        }
        if (nextProps.location.pathname !== this.props.location.pathname) {
            return true
        } else {
            return true
        }
    }
    onOpenChange = (defaultOpenKeys) => {
        console.log("defaultOpenKeys  = ", defaultOpenKeys);
        this.setState({
            defaultOpenKeys: defaultOpenKeys,
        });
    }
    render() {
        return (
            <div className='SideMenu_wrap' style={this.state.style}>
                <Switch>
                    <Route path="/business">
                        <Menu mode="inline" theme="dark" onSelect={this.onSelect} selectedKeys={this.state.keys} inlineCollapsed={this.props.collapsed} defaultOpenKeys={this.state.defaultOpenKeys} openKeys={this.state.defaultOpenKeys} onOpenChange={this.onOpenChange}>
                            {businessManagement.map((item, i) =>
                                item.list && item.list.length > 0 ?
                                    <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>} >
                                        {item.list.map((listItem, ii) =>
                                            <Menu.Item key={item.key + listItem.key}>
                                                <span>{listItem.title}</span>
                                            </Menu.Item>
                                        )}
                                    </SubMenu>
                                    :
                                    <Menu.Item key={item.key}>
                                        <Icon type={item.icon} />
                                        <span>{item.title}</span>
                                    </Menu.Item>
                            )}
                        </Menu>
                    </Route>
                    <Route path="/analysis">
                        <Menu mode="inline" theme="dark" onSelect={this.onSelect} selectedKeys={this.state.keys} inlineCollapsed={this.props.collapsed} defaultOpenKeys={this.state.defaultOpenKeys} openKeys={this.state.defaultOpenKeys} onOpenChange={this.onOpenChange}>
                            {dataAnalysis.map((item, i) =>
                                item.list && item.list.length > 0 ?
                                    <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
                                        {item.list.map((listItem, ii) =>
                                            <Menu.Item key={item.key + listItem.key}>
                                                <span>{listItem.title}</span>
                                            </Menu.Item>
                                        )}
                                    </SubMenu>
                                    :
                                    <Menu.Item key={item.key}>
                                        <Icon type={item.icon} />
                                        <span>{item.title}</span>
                                    </Menu.Item>
                            )}
                        </Menu>
                    </Route>
                    <Route path="/system">
                        <Menu mode="inline" theme="dark" onSelect={this.onSelect} selectedKeys={this.state.keys} inlineCollapsed={this.props.collapsed} defaultOpenKeys={this.state.defaultOpenKeys} openKeys={this.state.defaultOpenKeys} onOpenChange={this.onOpenChange}>
                            {systemManagement.map((item, i) =>
                                item.list && item.list.length > 0 ?
                                    <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
                                        {item.list.map((listItem, ii) =>
                                            <Menu.Item key={item.key + listItem.key}>
                                                <span>{listItem.title}</span>
                                            </Menu.Item>
                                        )}
                                    </SubMenu>
                                    :
                                    <Menu.Item key={item.key}>
                                        <Icon type={item.icon} />
                                        <span>{item.title}</span>
                                    </Menu.Item>
                            )}
                        </Menu>
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default SideMenu