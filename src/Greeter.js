// es5语法
// var config = require('./config.json')

// module.exports = function () {
//     var greet = document.createElement('div');
//     greet.textContent = config.greetText;
//     return greet;
// };


// ES6语法
import React, { Component } from 'react'
import config from './config.json';
import styles from './Greeter.css';//导入

class Greeter extends Component {
    render() {
        console.log(process.env)
        return (
            <div className={styles.root}>
                {config.greetText} // 当前的环境是{process.env.http_env}
            </div>
        );
    }
}

export default Greeter