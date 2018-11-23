/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:51:37
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-07-24 15:51:37
 * @Description: 页面顶部导航栏
 */
import React, { Component } from 'react'
import topNav from '@/config/topNav'
import { withRouter } from 'react-router-dom'
/**
 * 页面顶部导航栏
 * 
 * @class TopNav
 * @extends {Component}
 */
@withRouter
class TopNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }
    }
    componentWillMount() {
        // console.log(this.props);
    }
    goTo(path)  {
         this.props.history.push(path);
         this.setState({
             index: this.state++
         })
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            return true
        } 
    }
    render() {
        return (
            <ul className="nav">
                {
                    topNav.map((item, i) =>
                        <li key={item.key} className={`nav-item ${this.props.location.pathname.includes(item.belong)? "nav-item-selected":null}`} onClick={this.goTo.bind(this,item.key)}>{item.title}</li>
                    )
                }
            </ul>
        )
    }
}

export default TopNav

