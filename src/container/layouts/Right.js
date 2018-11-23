import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import routerConfig from '@/config/routes';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';
import Top from './Top';
import PropTypes from 'prop-types';

@withRouter
@inject('GlobalStore')
@observer
class Right extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='right' style={this.props.style}>
                <Top GlobalStore={this.props.GlobalStore} collapsed={this.props.collapsed} changeCollapsed={this.props.changeCollapsed}></Top>

                <div className='routeWrap'>

                    <Loading GlobalStore={this.props.GlobalStore}>
                        {routerConfig.map((item, i) =>
                            <Route key={i} path={item.path} exact render={props =>
                                <item.component collapsed={this.props.collapsed} changeCollapsed={this.props.changeCollapsed} meta={item.meta} />
                            } >
                            </Route>
                        )}
                    </Loading>
                </div>
            </div>
        )
    }
}
Right.propTypes = {
    changeCollapsed: PropTypes.func,
    collapsed: PropTypes.bool
}
Right.defaultProps = {
    changeCollapsed: () => { },
    collapsed: false
}
export default Right