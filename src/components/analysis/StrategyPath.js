import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart, Facet, View, Tooltip, Legend, Axis, StackBar, FacetView, Coord } from 'viser-react';
const DataSet = require('@antv/data-set');
const { DataView } = DataSet;


const data = [
    { gender: '命中', count: 0, grade: '学历' },
    { gender: '不命中', count: 1, grade: '学历' },

    { gender: '命中', count: 0, 'class': '交易时间', grade: '交易金额' },
    { gender: '不命中', count: 1, 'class': '交易时间', grade: '交易金额' },

    { gender: '命中', count: 0, 'three': '交易时间', 'class': '卡号', grade: '交易金额' },
    { gender: '不命中', count: 1, 'three': '交易时间', 'class': '卡号', grade: '交易金额' },

    { gender: '命中', count: 10000, 'three': '卡号', 'class': '卡号', grade: '交易金额' },
    { gender: '不命中', count: 1, 'three': '卡号', 'class': '卡号', grade: '交易金额' },

    { gender: '命中', count: 0, grade: '刷卡次数' },
    { gender: '不命中', count: 1, grade: '刷卡次数' },

    { gender: '命中', count: 0, grade: '刷卡次数2' },
    { gender: '不命中', count: 1, grade: '刷卡次数2' },
];

const views = (view, facet) => {
    const data = facet.data;
    const dv = new DataView();
    dv.source(data).transform({
        type: 'percent',
        field: 'count',
        dimension: 'gender',
        as: 'percent',
    });

    return {
        data: dv,
        scale: {
            dataKey: 'percent',
            formatter: '.2%',
        },
        series: {
            quickType: 'stackBar',
            position: 'percent',
            color: 'gender',
        }
    }
}


class StrategyPath extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Chart forceFit={true} height={400} data={data} padding={[60, 90, 80, 80]}>
                <Tooltip showTitle={false} />
                <Coord type="theta" />
                <Legend dataKey="cut" position="top" />
                <Facet type="tree" fields={['grade', 'class', 'three']} line={{ stroke: '#00a3d7' }} lineSmooth={true} views={views}></Facet>
            </Chart>
        )
    }
}

StrategyPath.propTypes = {

}

StrategyPath.defalutProps = {

}

export default StrategyPath