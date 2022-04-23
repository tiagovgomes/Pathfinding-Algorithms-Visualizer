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
            type,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            row,
        } = this.props;
        return (
            <div
                id={`cell-${row}-${col}`}
                className={`cell ${type}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}>
            </div >
        )
    }
}