import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

@withRouter
class TableAction extends Component {
    constructor(props) {
        super(props);
        this.edit = this.edit.bind(this);
    }
    edit = () => {
        console.log(this.props);
        this.props.history.push(this.props.editPath);
    }
    render() {
        return (
            <div className="table-action">
                <Icon type="edit" title="编辑" onClick={() => this.edit()} />
                {/* <Icon type="share-alt" title="共享" /> */}
                <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.dataId) }} onCancel={() => { }} okText="确定" cancelText="取消">
                    <Icon type="delete" title="删除" />
                </Popconfirm>
            </div>
        )
    }
}
TableAction.propTypes = {
    editPath: PropTypes.bool
}
TableAction.defaultProps = {
    editPath: false
}
export default TableAction