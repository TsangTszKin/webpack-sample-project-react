import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';


@inject('store')
@observer
class HeaderInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("this.props.store.statistics", this.props.store.statistics)
        return (
            <div style={{ height: '83px', float: 'right' }}>
                <div style={{ width: '124px', padding: '5px 0 0 0', float: 'left' }}>
                    <p style={{ margin: '0', width: '100%', textAlign: 'right', height: '24px', lineHeight: '24px', margin: '0', color: '#000', opacity: '0.43', fontSize: '14px' }}>请求数</p>
                    <p style={{ margin: '0', fontSize: '30px', width: '100%', textAlign: 'right', color: '#000' }}>{this.props.store.statistics.getRequestSum}<span style={{ fontSize: '20px', opacity: '0.7' }}>{` / 日`}</span></p>
                </div>
                <div style={{ float: 'left', height: '38px', width: '1px', backgroundColor: 'grey', opacity: '0.5', margin: '34px 15px 34px 15px' }}></div>
                <div style={{ width: '110px', padding: '5px 0 0 0', float: 'left' }}>
                    <p style={{ margin: '0', width: '100%', textAlign: 'center', height: '24px', lineHeight: '24px', margin: '0', color: '#000', opacity: '0.43', fontSize: '14px' }}>失败</p>
                    <p style={{ margin: '0', fontSize: '30px', width: '100%', textAlign: 'center', color: '#000' }}>{this.props.store.statistics.getFailSum}</p>
                </div>
                <div style={{ float: 'left', height: '38px', width: '1px', backgroundColor: 'grey', opacity: '0.5', margin: '34px 15px 34px 15px' }}></div>
                <div style={{ width: '100px', padding: '5px 0 0 0', float: 'left' }}>
                    <p style={{ margin: '0', width: '100%', textAlign: 'right', height: '24px', lineHeight: '24px', margin: '0', color: '#000', opacity: '0.43', fontSize: '14px' }}>命中</p>
                    <p style={{ margin: '0', fontSize: '30px', width: '100%', textAlign: 'right', color: '#000' }}>{this.props.store.statistics.getHitSum}</p>
                </div>
            </div>
        )
    }
}

HeaderInfo.propTypes = {}
HeaderInfo.defaultProps = {}
export default HeaderInfo;