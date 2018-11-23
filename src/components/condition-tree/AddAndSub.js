import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Icon, Popconfirm } from 'antd';
import PropTypes from 'prop-types';

const style = {
    container: {
        width: 'fit-content',
        float: 'left',
        height: '32px',
        lineHeight: '32px',
        padding: 0
    },
    sub: {
        margin: '0 3px 0 2px',
        color: '#E44B4E',
        fontSize: '15px',
        cursor: 'pointer'
    },
    add: {
        margin: '0 2px 0 3px',
        color: '#00A854',
        fontSize: '15px',
        cursor: 'pointer'
    }
}
@inject('GlobalStore')
class AddAndSub extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.level);
    }

    render() {
        return (
            <div className="container" style={style.container}>

                {(() => {
                    switch (this.props.type) {
                        case 'add':
                            return <Popconfirm okText="并且" cancelText="或者" onConfirm={this.props.addAnd} onCancel={this.props.addOr} title='选择"并且"还是"或者"条件？'><Icon type="plus-circle" className="add" style={style.add} title="增加" /></Popconfirm>;
                        case 'sub':
                            return <Icon type="minus-circle" className="sub" onClick={this.props.sub} style={style.sub} title="删除" />;
                        case 'add-sub':
                            return <p><Popconfirm okText="并且" cancelText="或者" onConfirm={this.props.addAnd} onCancel={this.props.addOr} title='选择"并且"还是"或者"条件？'><Icon type="plus-circle" className="add" onClick={this.add} style={style.add} title="增加" /></Popconfirm> <Icon type="minus-circle" className="sub" onClick={this.props.sub} style={style.sub} title="删除" /></p>;
                        default:
                            break;
                    }
                })()}

            </div>
        )
    }
}

AddAndSub.propTypes = {
    type: PropTypes.oneOf(['add', 'sub', 'add-sub'])
}
AddAndSub.defaultProps = {
    type: 'add-sub'
}

export default AddAndSub;