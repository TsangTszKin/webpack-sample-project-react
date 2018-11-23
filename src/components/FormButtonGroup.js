/*
 * @Author: zengzijian
 * @Date: 2018-08-14 10:42:15
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-16 16:50:34
 * @Description: 通用的保存或者编辑页面页脚的按钮组，包括“取消”和“保存”按钮
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import $ from 'jquery';
import { inject, observer } from 'mobx-react';

let timer = 0;

@observer
@inject('store')
class FormButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                // padding: '10px',
                textAlign: 'right',
                backgroundColor: '#fff',
                position: 'fixed',
                bottom: '0',
                right: '0px',
                boxShadow: '0 -4px 4px rgba(0,21,41,.08)',
                zIndex: '999',
                height: "50px",
                padding: "10px"
            }
        }
    }

    adjustWidth() {
        timer = setInterval(function () {
            // alert($("#root .right .panel").width())
            $("#form-button-group").width($("#root .right .panel").width())
        }, 1000)
    }

    componentDidMount() {
        this.adjustWidth();
        $(".panel > .pageContent").height($(".panel>.pageContent").height() + 100)
    }

    componentWillUnmount() {
        window.clearInterval(timer);
    }



    render() {
        return (
            <div style={this.state.style} id="form-button-group">
                <Button style={{ marginRight: '24px' }} onClick={this.props.cancelCallBack} >取消</Button>
                <Button style={{ marginRight: '24px' }} type="primary" onClick={this.props.saveCallBack} >保存</Button>
                {
                    this.props.store.getIsHaveCommitBtn ?
                        <Button style={{ marginRight: '24px' }} onClick={this.props.store.submitSaveData} disabled={!this.props.store.getIsCanCommit} >提交</Button>
                        : ''
                }

            </div>
        )
    }
}
FormButtonGroup.propTypes = {
    cancelCallBack: PropTypes.func,
    saveCallBack: PropTypes.func,
    isFixed: false
}
FormButtonGroup.defaultProps = {
    cancelCallBack: () => { },
    saveCallBack: () => { }
}
export default FormButtonGroup;