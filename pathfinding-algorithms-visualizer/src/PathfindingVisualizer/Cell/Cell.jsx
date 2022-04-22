import React from 'react';
import './Cell.scss';

export default class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            col,
            isFinish,
            isStart,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            row,
        } = this.props;
        const extraClassName = isFinish
            ? 'cell-finish'
            : isStart
                ? 'cell-start'
                : isWall
                    ? 'cell-wall'
                    : '';
        return (
            <div
                id={`cell-${row}-${col}`}
                className={`cell ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}>
            </div >
        )
    }
}