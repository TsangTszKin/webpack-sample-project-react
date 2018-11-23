import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import variableImg from '@/assets/home/variable.png';

class Cell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Col style={{ width: '80px', height: '50px', color: '#000', marginBottom: '15px' }}>
                <p style={{ fontSize: '12px', opacity: '0.7', margin: '0', textAlign: 'center' }}>{this.props.data.name}</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', opacity: '0.7', margin: '0', textAlign: 'center' }}>{this.props.data.num}<span style={{ fontSize: '14px', opacity: '0.7' }}>{this.props.type === 'variable' || this.props.type === 'strategy' ? ` / ${this.props.data.total}` : this.props.data.total}</span></p>
            </Col>
        )
    }
}

Cell.propTypes = {
    name: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    num: PropTypes.number.isRequired,
    type: PropTypes.string
}
Cell.defaultProps = {}
export default Cell;