import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { Spin, message } from 'antd';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/keymap/sublime';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/theme/idea.css';
import '@/styles/code.less';
// import 'codemirror/theme/ambiance.css'; 

class Code extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
    }
    componentDidMount() {
        this.setState({
            isLoading: false
        })
    }

    changeCode = (code) => {
        this.code = code;
        this.setState({
            index: 0
        })
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const options = {
            lineNumbers: true,                     //显示行号  
            mode: { name: "text/x-mysql" },          //定义mode  
            extraKeys: { "Ctrl": "autocomplete" },   //自动提示配置  
            theme: "idea"                  //选中的theme  
        };
        let self = this;
        return (
            <div>
                <Spin spinning={this.state.isLoading} size="small">
                    {
                        this.props.type === 1 ?
                            <CodeMirror
                                value={this.props.sqlCode}
                                onChange={(editor, value) => {
                                    console.log({ editor }, { value });
                                }}
                                options={options}
                                height="auto"
                            />
                            :
                                <CodeMirror
                                    value={this.props.sqlCode}
                                    onChange={(editor, value) => {
                                        console.log({ editor }, { value });
                                    }}
                                    onBeforeChange={(editor, data, value) => {
                                        console.log(value);
                                        this.props.changeCode(value);
                                    }}
                                    options={options}
                                    onFocus={()=>{
                                        if (!localStorage.isFirstUseSqlCodeEdtor) {
                                            message.info("按Ctrl有sql关键字提示~", 5);
                                            localStorage.isFirstUseSqlCodeEdtor = "1";
                                        }
                                    }}
                                    height="auto"
                                />
                    }

                </Spin>
            </div>
        )
    }
}
Code.propTypes = {
    sqlCode: PropTypes.string,
    type: PropTypes.oneOf([1, 2]),//1是只读模式，2是读写模式
    changeCode: PropTypes.func
}
Code.defaultProps = {
    sqlCode: '',
    type: 1
}
export default Code;