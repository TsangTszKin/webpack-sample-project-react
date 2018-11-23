import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import variable from '@/filters/variable';

@withRouter
class TableAction extends Component {
    constructor(props) {
        super(props);
        this.edit = this.edit.bind(this);
        console.log(this.props.dataId);
    }
    edit = () => {
        console.log(this.props);
        this.props.history.push(this.props.editPath);
    }
    render() {
        const status = variable.variableStatus(this.props.status);
        const statueForTitle = this.props.status == 1 ? '上线' : this.props.status == 4 ? '下线' : '';
        return (
            <div className="table-action">
                {/* {
                    this.props.status == 0 ? '' :
                        <Popconfirm title={"是否确定" + statueForTitle + "?"} onConfirm={() => { this.props.changeStatus(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                            <Icon type={this.props.status === 1 ? "caret-right" : "pause"} title={statueForTitle} />
                        </Popconfirm>
                } */}
                <Icon type="edit" title="编辑" onClick={() => this.edit()} />
                {/* <Icon type="share-alt" title="共享" /> */}
                <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                    <Icon type="delete" title="删除" />
                </Popconfirm>

            </div>
        )
    }
}
TableAction.propTypes = {
    editPath: PropTypes.bool,
    status: PropTypes.number,
    changeStatus: PropTypes.func,
    deleteOne: PropTypes.func,
    dataId: PropTypes.string
}
TableAction.defaultProps = {
    editPath: false,
    status: 4,
    changeStatus: () => { },
    deleteOne: () => { },
    dataId: ''
}
export default TableAction