import React from 'react';
import './Cell.scss';
import startIcon from '../../styling/start.svg';
import targetIcon from '../../styling/target.svg'; 

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
                { type ===  'cell-start' &&
                    <img alt="startIcon" src={startIcon}></img>
                }
                { type ===  'cell-target' &&
                    <img alt="targetIcon" src={targetIcon}></img>
                }
            </div >
        )
    }
}