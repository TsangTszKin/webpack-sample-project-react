import React, { Component } from 'react';
import store from '@/store/business/Home';
import PageHeader from '@/components/PageHeader';
import $ from 'jquery';
import { Breadcrumb, Tabs, Row, Col, Spin } from 'antd';
import { Link } from 'react-router-dom';
import HeaderInfo from '@/components/business/home/HeaderInfo';
import MainPanel from '@/components/business/home/MainPanel';
import { observer, Provider } from 'mobx-react';

@observer
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        store.getEventSourceSelectListForApi();
    }
    render() {
        return (
            <Provider store={store}>
                <Spin spinning={store.getIsLoading} size="large">
                    <div className='panel'>
                        <div className="panel-header" style={{ height: '110px' }}>
                            <Row>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Breadcrumb>
                                        <Breadcrumb.Item>业务管理</Breadcrumb.Item>
                                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                                    </Breadcrumb>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <HeaderInfo />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginTop: '-21px' }}>
                                    <Tabs defaultActiveKey="1" style={{ marginTop: '4px' }} onChange={(key) => store.getHomeDataForApi(key)} >
                                        {
                                            store.getEventSourceList.map((item, i) =>
                                                <Tabs.TabPane tab={item.eventSourceType} key={item.eventSourceId}>
                                                    <MainPanel />
                                                </Tabs.TabPane>
                                            )
                                        }
                                    </Tabs>
                                </Col>
                            </Row>

                        </div>
                    </div>
                </Spin>
            </Provider>
        )
    }
}

export default Home

$("body").on("click", ".layui-table-cell", function (event) {
    var layDataStr = $(this).attr('lay-data');
    console.log(" layDataStr ", layDataStr);
    var layData = JSON.parse($(this).attr('lay-data'));
    var field = layData.field;

})