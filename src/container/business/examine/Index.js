import React, { Component } from 'react'
import { Provider } from 'mobx-react';
import store from '@/store/business/Examine'
import PageHeader from '@/components/PageHeader'

class Examine extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>

                    <div className="pageContent">
                        Examine
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Examine