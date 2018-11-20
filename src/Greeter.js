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
        return (
            <div className={styles.root}>
                {config.greetText}
            </div>
        );
    }
}

export default Greeter