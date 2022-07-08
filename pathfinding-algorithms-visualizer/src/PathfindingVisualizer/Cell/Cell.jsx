import React from 'react';
import './Cell.scss';
import startIcon from '../../styling/start.svg';
import targetIcon from '../../styling/target.svg';

export default function Cell({col, type, onMouseDown, onMouseEnter, onMouseUp, row}) {

    return (
        <div
            id={`cell-${row}-${col}`}
            className={`cell ${type}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}>
            {type === 'cell-start' &&
                <img alt="startIcon" src={startIcon}></img>
            }
            {type === 'cell-target' &&
                <img alt="targetIcon" src={targetIcon}></img>
            }
        </div >
    )
}