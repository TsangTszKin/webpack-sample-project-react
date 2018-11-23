import React from 'react';
import { Button } from 'antd';
import homeStore from '../store/Home';
import DataList from './DataList';
import { observer } from "mobx-react";

@observer
export default class Home extends React.Component {
    render() {
        return (
            <div>
                <DataList homeStore={homeStore} />
                <Button onClick={() => homeStore.addOne()}>新增</Button>
                一共有条{homeStore.listCount}数据
            </div>
        )
    }
}