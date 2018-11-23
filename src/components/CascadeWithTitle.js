import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

class CascadeWithTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstValue: this.props.firstValue,
            secondValue: this.props.secondValue,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            firstValue: nextProps.firstValue,
            secondValue: nextProps.secondValue
        })
    }

    render() {
        return (
            <div>
                <p style={{ float: 'left', width: 'fit-content', height: '32px', lineHeight: '32px', padding: '0 10px' }}>{this.props.firstTitle}</p>
                <Select style={{ float: 'left', width: '150px' }} value={this.state.firstValue} onChange={(value) => {
                    this.props.changeCallBack(this.props.firstCode, value)
                }}>
                    {
                        this.props.firstSelectData.map((item, i) =>
                            <Select.Option value={item.code}>{item.value}</Select.Option>
                        )
                    }
                </Select>
                <p style={{ float: 'left', width: 'fit-content', height: '32px', lineHeight: '32px', padding: '0 10px' }}>{this.props.secondTitle}</p>
                <Select style={{ float: 'left', width: '150px' }} value={this.state.secondValue} onChange={(value, option) => {
                    console.log("option", option)
                    this.props.changeCallBack(this.props.secondCode, value, option.props.index);
                }}>
                    {
                        this.props.secondSelectData.map((item, i) =>
                            <Select.Option value={item.code} index={i}>{item.value}</Select.Option>
                        )
                    }
                </Select>
            </div>
        )
    }
}

CascadeWithTitle.propTypes = {
    firstTitle: PropTypes.string,
    secondTitle: PropTypes.string,
    firstSelectData: PropTypes.array,
    secondSelectData: PropTypes.array,
    firstValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool
    ]),
    secondValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool
    ]),
    firstCode: PropTypes.string,
    secondCode: PropTypes.string,
    changeCallBack: PropTypes.func
}
CascadeWithTitle.defaultProps = {
    firstTitle: '在',
    secondTitle: '中',
    firstSelectData: [],
    secondSelectData: [],
    firstValue: '',
    secondValue: '',
    changeCallBack: () => { }
}

export default CascadeWithTitle;