import React, { Component } from 'react'
import { Provider } from 'mobx-react';
import store from '@/store/business/Template'
import PageHeader from '@/components/PageHeader'

class Testing extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent">
                        Testing
                </div>
                </div>
            </Provider>
        )
    }
}

export default Testing