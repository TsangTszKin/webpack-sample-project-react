import React from 'react';
import { List } from 'antd';
import { observer } from "mobx-react";

export default class DataList extends React.Component {
    render() {
        console.log("this.props.homeStore", this.props)
        return (
            <List
                header={<div>Header</div>}
                footer={<div>Footer</div>}
                bordered
                dataSource={this.props.homeStore.list}
                renderItem={item => (<List.Item>{item}</List.Item>)}
            />
        )
    }
}