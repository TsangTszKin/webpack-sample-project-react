import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Icon } from 'antd';
import variableImg from '@/assets/home/variable.png';
import strategyImg from '@/assets/home/strategy.png';
import greedyImg from '@/assets/home/greedy.png';
import processImg from '@/assets/home/process.png';
import sqlImg from '@/assets/home/sql.png';
import Cell from '@/components/business/home/Cell';

class CellBlock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p style={{ margin: '0', color: '#000', fontSize: '16px', fontWeight: 'bold', margin: '0', whiteSpace: 'nowrap', cursor: 'pointer' }} title={this.props.data.name} >
                    {(() => {
                        switch (this.props.data.type) {
                            case 'variable':
                                return <img src={variableImg} style={{ width: '24px', height: '24px', margin: '24px 15px 24px 24px' }} />
                            case 'strategy':
                                return <img src={strategyImg} style={{ width: '24px', height: '24px', margin: '24px 15px 24px 24px' }} />
                            case 'strategyGreedy':
                                return <img src={greedyImg} style={{ width: '24px', height: '24px', margin: '24px 15px 24px 24px' }} />
                            case 'strategyProcess':
                                return <img src={processImg} style={{ width: '24px', height: '24px', margin: '24px 15px 24px 24px' }} />
                            case 'strategySql':
                                return <img src={sqlImg} style={{ width: '24px', height: '24px', margin: '24px 15px 24px 24px' }} />
                            default:
                                break;
                        }
                    })()}
                    {this.props.data.name}
                </p>
                <Row type="flex" justify="space-around" align="middle">
                    {
                        this.props.data.list.map((item, i) =>
                            <Cell data={item} type={this.props.data.type} />
                        )
                    }
                </Row>
            </div>
        )
    }
}

CellBlock.propTypes = {
    data: PropTypes.object.isRequired
}
CellBlock.defaultProps = {}
export default CellBlock;