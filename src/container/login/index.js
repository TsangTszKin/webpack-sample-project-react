import React, { Component } from 'react';
import { Provider, inject, observer } from 'mobx-react';
import { message } from 'antd';
import CryptoJS from 'crypto-js';
import FormBox from '@/components/login/FormBox';
import ReactImg from '@/assets/logo2.png';
import loginLogo from '@/assets/login-logo.png';
import Cookies from 'js-cookie';
import '@/styles/login/index.less';
import LoginBg from '@/assets/login-bg.png';

@inject('GlobalStore')
@observer
class Login extends Component {
    constructor() {
        super();
    }

    submit = (form, updateLoading) => {
        form.validateFields((err, values) => {
            if (!err) {
                updateLoading(true)
                this.timer = setTimeout(() => {
                    updateLoading(false)
                    let { userName, password } = values
                    if (userName == 'admin' && password == '123456') {
                        let message = `M&${userName}&${password}`
                        let key = 'react_starter'
                        let session = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(message, key))
                        // Cookies.set('JSESSIONID', session, { expires: 1, path: '/' });
                        // Cookies.set('userName', userName, { expires: 1, path: '/' });
                        localStorage.userName = userName;
                        localStorage.JSESSIONID = session;
                        this.props.GlobalStore.updateName(userName)
                        this.props.history.push('/home')
                    } else {
                        message.error('账号：admin ； 密码：123456')
                    }
                }, 1500)
            }
        });
    }

    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {
        return (
            <Provider GlobalStore={this.props.GlobalStore}>
                <div className='Login_wrap clear clearFix' style={{ backgroundImage: 'url(' + LoginBg + ')' }}>
                    <div className='form P_auto'>
                        <img src={loginLogo} style={{ marginBottom: '30px', width: '40%' }} />
                        <FormBox submit={this.submit} />
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Login