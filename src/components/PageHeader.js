/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:51:05
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-15 13:45:06
 * @Description: 每个容器的页眉
 */
import React, { Component } from 'react';
import BreadCrumb from '@/components/BreadCrumb';
import PropTypes from 'prop-types';
import common from '@/utils/common';
import { Icon } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
/**
 * 容器页面的面包屑导航以及页面基础信息
 * 
 * @class PageHeader
 * @extends {Component}
 */
@observer
@inject('store')
@withRouter
class PageHeader extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }
    render() {
        return (
            <div className="panel-header">
                <BreadCrumb nav={this.props.meta.nav} />
                <p className='title'>
                    {this.props.meta.title} <span className="description">{this.props.meta.descript}</span>
                </p>
                {this.props.isShowBtns ?
                    !common.isEmpty(this.props.meta.btns) ?
                        <div style={{ height: '21px', float: 'right' }}>
                            {this.props.meta.btns.map((item, i) =>
                                <p style={{ width: 'fit-content', margin: '0 30px 0 0', float: 'left', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (item.name === '总览') {
                                            this.props.store.getSqlPreviewForAPI(this.props.match.params.id);
                                        }
                                    }}
                                >
                                    <Icon
                                        type={item.icon}
                                        theme="outlined"
                                        style={{ marginRight: '5px' }}
                                    />
                                    {item.name}
                                </p>
                            )}
                        </div> : ''

                    : ''
                }

            </div>
        )
    }
}
PageHeader.propTypes = {
    isShowBtns: PropTypes.bool
}
PageHeader.defaultProps = {
    isShowBtns: false
}
export default PageHeader