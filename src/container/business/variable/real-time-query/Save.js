import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/variable/rtq/Save';
import PageHeader from '@/components/PageHeader';
import FormHeader from '@/components/FormHeader';
import '@/styles/business/variable/real-time-query-edit.less';
import ProcessTreePanel from '@/components/process-tree/ProcessTreePanel';
import $ from 'jquery';
import Info from '@/components/business/variable/real-time-query/edit/Info';
import Control from '@/components/business/node/Control';
import Query from '@/components/business/node/Query';
import Assign from '@/components/business/node/Assign';
import { withRouter } from 'react-router-dom';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import { message, Row, Col, Spin, Drawer } from 'antd';
import PropTypes from 'prop-types';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import Code from '@/components/Code';

let timer = 0;

@withRouter
@observer
class Save extends Component {
    constructor(props) {
        super(props);
        this.reRender = this.reRender.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
        // console.log('~~~~~~');
        // console.log(this.props);
    }

    componentWillMount() {
        if (sessionStorage.processTreeMaxLength) {
            sessionStorage.removeItem("processTreeMaxLength");
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            store.getRtqVarById(this.props.match.params.id);
            sessionStorage.removeItem('isFinishNode');
        } else {
            store.setIsLoading(false);
        }
        store.setIsCanCommit(false);
        store.setEditType('info');
        store.setSqlMode(false);
    }

    componentWillUnmount() {
        window.clearInterval(timer);
        if (sessionStorage.processTreeMaxLength) {
            sessionStorage.removeItem("processTreeMaxLength");
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    deleteNode(id) {
        common.loading.show();
        variableService.deleteNode(id).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("删除成功");
            store.setActiveNodeKey(0);
            store.getRtqVarById(this.props.match.params.id);
        }).catch(res => {
            common.loading.hide();
        });
    }

    reRender() {
        store.getRtqVarById(this.props.match.params.id)
    }


    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta} isShowBtns={common.isEmpty(store.getScript)}></PageHeader>
                    <div style={{ height: '100%', width: 'auto' }} id="edit-panel">
                        <Spin spinning={store.getIsLoading} size="large">
                            <Row>
                                <Col span={store.getSqlMode ? 0 : this.props.match.params.id ? 6 : 0} id="panel-left">
                                    <div className="pageContent" style={{ height: '100%' }}>
                                        <FormHeader title="实时查询变量" style={{ marginBottom: '10px' }}></FormHeader>
                                        <ProcessTreePanel saveType={this.props.meta.saveType} deleteNode={this.deleteNode} activeNodeKey={store.getActiveNodeKey} addNode={store.addNode} processTreeData={store.getProcessTreeData} changeEditType={store.changeEditType} currentName={store.getCurrentName} ></ProcessTreePanel>
                                    </div>
                                </Col>
                                <Col span={store.sqlMode ? 24 : this.props.match.params.id ? 18 : 24} id="panel-right">
                                    {
                                        (() => {
                                            switch (store.getEditType) {
                                                case 'info':
                                                    return <Info script={store.getScript} reRender={this.reRender} currentName={store.getCurrentName} />
                                                    break;
                                                case 'control':
                                                    return <Control type="rtq" id={this.props.match.params.id} nodeId={store.getNodeId} reRender={this.reRender} currentName={store.getCurrentName} />
                                                    break;
                                                case 'query':
                                                    return <Query type="rtq" id={this.props.match.params.id} nodeId={store.getNodeId} reRender={this.reRender} currentName={store.getCurrentName} />
                                                    break;
                                                case 'assign':
                                                    return <Assign type="rtq" nodeId={store.getNodeId} reRender={this.reRender} currentName={store.getCurrentName} />
                                                    break;
                                                default:
                                                    return <Info script={store.getScript} reRender={this.reRender} currentName={store.getCurrentName} />
                                                    break;
                                            }
                                        })()
                                    }
                                </Col>
                            </Row>
                        </Spin>
                    </div>

                    <Drawer
                        title="总览"
                        placement="right"
                        closable={false}
                        onClose={() => { store.setIsShowDrawerForSql(false) }}
                        visible={store.getIsShowDrawerForSql}
                        width="720"
                    >
                        <Code sqlCode={store.getSqlPreview} type={1} />
                    </Drawer>
                </div>

            </Provider >
        )
    }
}
Save.propTypes = {
    changeCollapsed: PropTypes.func,
    collapsed: PropTypes.bool
}
Save.defaultProps = {
    changeCollapsed: () => { },
    collapsed: false
}
export default Save