import React, { Component } from 'react'
import { Divider } from 'antd'
import PropTypes from 'prop-types'

const style = {
    divider: {
        background: '#E44B4E',
        height: '20px',
        width: '4px'
    },
    title: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#000'
    }
}

class FormHeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={this.props.style}>
                <Divider type="vertical" style={style.divider} /><span style={style.title}>{this.props.title}</span>
            </div>
        )
    }
}
FormHeader.propTypes = {
    title: PropTypes.string.isRequired,
    style: PropTypes.object
}
FormHeader.defaultProps = {

}
export default FormHeader