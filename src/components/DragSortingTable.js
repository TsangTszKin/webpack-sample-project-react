/*
 * @Author: zengzijian
 * @Date: 2018-09-29 10:38:10
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-09-29 11:39:18
 * @Description: 可拖拽排序表格
 */
import { Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}

class BodyRow extends React.Component {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: 'move' };

        let className = restProps.className;
        if (isOver && initialClientOffset) {
            const direction = dragDirection(
                dragRow.index,
                restProps.index,
                initialClientOffset,
                clientOffset,
                sourceClientOffset
            );
            if (direction === 'downward') {
                className += ' drop-over-downward';
            }
            if (direction === 'upward') {
                className += ' drop-over-upward';
            }
        }

        return connectDragSource(
            connectDropTarget(
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
}, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
}, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
}];

class DragSortingTable extends React.Component {

    state = {
        dataSource: []
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: nextProps.dataSource
        })
    }

    components = {
        body: {
            row: DragableBodyRow,
        },
    }

    moveRow = (dragIndex, hoverIndex) => {
        console.log("moveRow function   params dragIndex, hoverIndex = ", dragIndex, hoverIndex);
        const { dataSource } = this.state;
        const dragRow = dataSource[dragIndex];

        this.setState(
            update(this.state, {
                dataSource: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
        );
        this.props.callBackFunc(dragIndex, hoverIndex);
    }

    render() {
        return (
            <Table
                scroll={{ y: 700 }}
                pagination={false}
                columns={this.props.columns}
                dataSource={this.state.dataSource}
                components={this.components}
                onRow={(record, index) => (
                    {
                        index,
                        moveRow: this.moveRow,
                    })

                }
            />
        );
    }
}
DragSortingTable.propTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    callBackFunc: PropTypes.func
}
DragSortingTable.defaultProps = {
    dataList: [],
    columns: [],
    callBackFunc: () => { }
}
const Demo = DragDropContext(HTML5Backend)(DragSortingTable);

export default Demo;