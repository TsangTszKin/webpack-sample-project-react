import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { inject, observer } from 'mobx-react'
const FormItem = Form.Item

@inject('GlobalStore')
@observer
class FromBox extends Component {
    constructor() {
        super()
    }
    handleSubmit = (e) => {
        e.preventDefault()
        let { updateLoading } = this.props.GlobalStore
        let { form } = this.props
        this.props.submit(form, updateLoading)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { loading } = this.props.GlobalStore
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '输入admin' }],
                    })(
                        <Input prefix={<span className='font icon-user' style={{ color: 'rgba(0,0,0,.25)' }}></span>} style={{  height: '40px' }} placeholder="admin" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '密码是123456' }],
                    })(
                        <Input prefix={<span className='font icon-mima' style={{ color: 'rgba(0,0,0,.25)' }}></span>} type="password" style={{ height: '40px' }} placeholder="123456" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="l_button" loading={loading} style={{ height: '40px' }}>
                        登录
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(FromBox);