import React, { Component } from 'react'
import { inject } from 'mobx-react'
import Left from './Left'
import Right from './Right'
import Top from './Top';
import '@/styles/layouts.less'

@inject('GlobalStore')
class Layouts extends Component {
    constructor() {
        super();
        this.state = {
            collapsed: false,
            winHeight: 0
        }
        this.changeCollapsed = this.changeCollapsed.bind(this);
    }
    changeCollapsed () {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }
    getWinHeight() {
        let winHeight = 0;
        if (window.innerHeight) winHeight = window.innerHeight;
        else if (document.body && document.body.clientHeight)     //IE 
            winHeight = document.body.clientHeight;
        return winHeight;
    }
    componentWillMount() {
        this.setState({
            winHeight: this.getWinHeight()
        })
    }
    render() {

        return (
            <div className='Layouts_wrap clear clearFix'>
                
                <Left collapsed={this.state.collapsed} />
                <Right collapsed={this.state.collapsed} collapsed={this.state.collapsed} changeCollapsed={this.changeCollapsed} />
            </div>
        )
    }
}

export default Layouts

