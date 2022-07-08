import React, { useState, useEffect } from "react";
import './PathfindingVisualizer.scss';
import Cell from './Cell/Cell';
import { dijkstra, getCellsInShortestPathOrder } from '../pathfindingAlgorithms/dijkstra';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import arrowDown from '../styling/arrow-down.svg';
import startIcon from '../styling/start.svg';
import targetIcon from '../styling/target.svg';
import { recursiveDivisionMaze } from '../mazeAlgorithms/recursiveDivision';




const START_CELL = 'cell-start';
const TARGET_CELL = 'cell-target';
const WALL_CELL = 'cell-wall';

const SLOW_SPEED = 5;
const NORMAL_SPEED = 10;
const FAST_SPEED = 15;

const NUMB_ROWS = 20;
const NUMB_COLS = 50;

export default function PathfindingVisualizer() {

    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [cellTypeSelected, setCellTypeSelected] = useState(START_CELL);
    const [speed, setspeed] = useState(NORMAL_SPEED);


    useEffect(() => {
        const initialGrid = getInitialGrid();
        setGrid(initialGrid);
    }, [])


    function handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(grid, row, col, cellTypeSelected);
        setGrid(newGrid);
        setMouseIsPressed(true);
    }

    function handleMouseEnter(row, col) {
        if (!mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col, cellTypeSelected);
        setGrid(newGrid);
    }

    function handleMouseUp() {
        setMouseIsPressed(false);
    }

    function animateDijkstra(visitedCellsInOrder, cellsInShortestPathOrder) {
        for (let i = 0; i <= visitedCellsInOrder.length; i++) {
            if (i === visitedCellsInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(cellsInShortestPathOrder);
                }, speed * i);
                return;
            }
            setTimeout(() => {
                const cell = visitedCellsInOrder[i];
                document.getElementById(`cell-${cell.row}-${cell.col}`).className =
                    'cell cell-visited';
            }, speed * i);
        }
    }

    function animateMazeCells(cellsToAnimate) {
        for (let i = 0; i <= cellsToAnimate.length; i++) {
            setTimeout(() => {
                const cell = cellsToAnimate[i];
                document.getElementById(`cell-${cell.row}-${cell.col}`).className =
                    'cell cell-wall';
            }, speed * i);
        }
    }

    function animateShortestPath(cellsInShortestPathOrder) {
        for (let i = 0; i < cellsInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const cell = cellsInShortestPathOrder[i];
                document.getElementById(`cell-${cell.row}-${cell.col}`).className =
                    'cell cell-shortest-path';
            }, speed * 2 * i);
        }
    }

    function visualizeDijkstra() {
        const pastGrid = grid;
        const startCell = getCellByType(grid, START_CELL);
        const finishCell = getCellByType(grid, TARGET_CELL);
        const visitedCellsInOrder = dijkstra(pastGrid, startCell, finishCell);
        const cellsInShortestPathOrder = getCellsInShortestPathOrder(finishCell);
        animateDijkstra(visitedCellsInOrder, cellsInShortestPathOrder);
    }

    function changeCellType(type) {
        setCellTypeSelected(type);
    }

    function clearBoard() {
        const newGrid = getInitialGrid();
        setGrid(newGrid);
    }

    function getInitialGrid() {
        const grid = [];
        for (let row = 0; row < NUMB_ROWS; row++) {
            const currentRow = [];
            for (let col = 0; col < NUMB_COLS; col++) {
                currentRow.push(createCell(col, row));
                let cellElement = document.getElementById(`cell-${row}-${col}`)
                if (cellElement) cellElement.className = 'cell';
            }
            grid.push(currentRow);
        }
        return grid;
    };

    function changeSpeed(newSpeed) {
        setspeed(newSpeed);
    }

    function recursiveDivisionMazeGenerator() {
        let cellsToAnimate = [];
        recursiveDivisionMaze(grid, 0, NUMB_ROWS, 0, NUMB_COLS, "horizontal", true, "wall", cellsToAnimate);
        animateMazeCells(cellsToAnimate);
    }

    return (
        <div className="path-visualizer-container">
            <div className="hearder-options-container">
                <div Style="display:inline-block">
                    <CellTypeMenu onClick={(e, type) => changeCellType(type)}></CellTypeMenu>
                </div>
                <div Style="display:inline-block">
                    <SpeedMenu onClick={(e, type) => changeSpeed(type)}></SpeedMenu>
                </div>
                <Button variant="contained" className="green-button" onClick={() => visualizeDijkstra()}>
                    Visualize Dijkstra's
                </Button>
                <Button variant="text" onClick={() => clearBoard()}>
                    Clear Board
                </Button>
                <Button variant="text" onClick={() => recursiveDivisionMazeGenerator()}>
                    Create Maze
                </Button>


            </div>
            <div className="header-helper-container">
                <div className="cell-help">
                    <img alt="arrowDown" src={startIcon}></img>
                    <div className="cell-help-description">
                        Start Cell
                    </div>
                </div>
                <div className="cell-help">
                    <img alt="arrowDown" src={targetIcon}></img>
                    <div className="cell-help-description">
                        Target Cell
                    </div>
                </div>
                <div className="cell-help">
                    <div className="icon-cell wall-cell"></div>
                    <div className="cell-help-description">
                        Wall Cell
                    </div>
                </div>
                <div className="cell-help">
                    <div className="icon-cell visited-cell"></div>
                    <div className="cell-help-description">
                        Visited Cell
                    </div>
                </div>
                <div className="cell-help">
                    <div className="icon-cell shortest-path-cell"></div>
                    <div className="cell-help-description">
                        Shortest Path Cell
                    </div>
                </div>

            </div>
            <div className="grid-container">
                {grid.map((row, rowIdx) => {
                    return (
                        <div className="row">
                            {row.map((cell, cellIdx) => {
                                const { row, col, type } = cell;
                                return (
                                    <Cell
                                        key={rowIdx + cellIdx}
                                        col={col}
                                        type={type}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                                        onMouseUp={() => handleMouseUp()}
                                        row={row} />
                                );
                            }
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )

}



const createCell = (col, row) => {
    return {
        col: col,
        row: row,
        type: '',
        distance: Infinity,
        isVisited: false,
        previousCell: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col, type) => {
    const newGrid = grid.slice();
    const cell = newGrid[row][col];
    let newCell = { ...cell, type: cell.type === type ? '' : type }
    newGrid[row][col] = newCell;
    return newGrid;
};

const getCellByType = (grid, type) => {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col].type === type) {
                return grid[row][col];
            }
        }
    }
    return null;
}

function CellTypeMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);

    };
    const handleClose = (event, type) => {
        props.onClick(event, type);
        setAnchorEl(null);
    };


    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) => { handleClick(e) }}
            >
                Cell type
                <img className="arrow-icon" alt="arrowDown" src={arrowDown}></img>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={(e) => { handleClose(e, START_CELL) }}>Start</MenuItem>
                <MenuItem onClick={(e) => { handleClose(e, TARGET_CELL) }}>Goal</MenuItem>
                <MenuItem onClick={(e) => { handleClose(e, WALL_CELL) }}>Wall</MenuItem>
            </Menu>
        </div>
    );
}


function SpeedMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);

    };
    const handleClose = (event, type) => {
        props.onClick(event, type);
        setAnchorEl(null);
    };


    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) => { handleClick(e) }}
            >
                Speed
                <img className="arrow-icon" alt="arrowDown" src={arrowDown}></img>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={(e) => { handleClose(e, SLOW_SPEED) }}>Slow</MenuItem>
                <MenuItem onClick={(e) => { handleClose(e, NORMAL_SPEED) }}>Normal</MenuItem>
                <MenuItem onClick={(e) => { handleClose(e, FAST_SPEED) }}>Fast</MenuItem>
            </Menu>
        </div>
    );
}