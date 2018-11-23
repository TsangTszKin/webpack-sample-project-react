import React, { Component } from 'react';
import avatar from '@/assets/avatar.png';
import SideMenu from '@/components/SideMenu';
import logo from '@/assets/logo.png';
import shuangzhaokeji from '@/assets/shuangzhaokeji.png';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('GlobalStore')
class Left extends Component {
    constructor(props) {
        super(props);
        this.state = {
            styleOut: {
                width: '250px'
            },
            styleRight: {
                display: 'block'
            },
            styleLeft: {
                width: '60px'
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.collapsed !== this.props.collapsed) {
            if (nextProps.collapsed) {
                this.setState({
                    styleOut: {
                        width: "80px"
                    },
                    styleRight: {
                        display: 'none'
                    },
                    styleLeft: {
                        width: '100%'
                    }
                })
            } else {
                this.setState({
                    styleOut: {
                        width: "250px"
                    },
                    styleRight: {
                        display: 'block'
                    },
                    styleLeft: {
                        width: '60px'
                    }
                })
            }
        }
    }
    render() {
        return (
            <div className='left' style={this.props.style}>
                <div className='userInfo' style={this.state.styleOut}>
                    <div className="left" style={this.state.styleLeft}>
                        <img src={logo} />
                    </div>
                    <div className="right" style={this.state.styleRight}>
                        <img src={shuangzhaokeji} />
                    </div>

                </div>
                <SideMenu collapsed={this.props.collapsed}></SideMenu>
            </div>
        )
    }
}

Left.propTypes = {
    collapsed: PropTypes.bool
}
Left.defaultProps = {
    collapsed: false
}

export default Left