import React from "react";
import './PathfindingVisualizer.scss';
import Cell from './Cell/Cell';
import { dijkstra, getCellsInShortestPathOrder } from '../pathfindingAlgorithms/dijkstra';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { depthFirstSearch } from '../mazeAlgorithms/depthFirstSearch';
import arrowDown from '../styling/arrow-down.svg';


const START_CELL = 'cell-start';
const END_CELL = 'cell-finish';
const WALL_CELL = 'cell-wall';

const SLOW_SPEED = 5;
const NORMAL_SPEED = 10;
const FAST_SPEED = 15;

const NUMB_ROWS = 20;
const NUMB_COLS = 50;

export default class PathfindingVisualizer extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            cellTypeSelected: START_CELL,
            speed : NORMAL_SPEED
        };
    }

    componentDidMount() {
        const grid = this.getInitialGrid();
        this.setState({ grid });
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, this.state.cellTypeSelected);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col, this.state.cellTypeSelected);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }

    animateDijkstra(visitedCellsInOrder, cellsInShortestPathOrder) {
        let speed = this.state.speed;
        console.log(speed);
        for (let i = 0; i <= visitedCellsInOrder.length; i++) {
            if (i === visitedCellsInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(cellsInShortestPathOrder);
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

    animateShortestPath(cellsInShortestPathOrder) {
        let speed = this.state.speed;
        for (let i = 0; i < cellsInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const cell = cellsInShortestPathOrder[i];
                document.getElementById(`cell-${cell.row}-${cell.col}`).className =
                    'cell cell-shortest-path';
            }, speed * 2 * i);
        }
    }

    test() {
        let grid = this.state.grid;
        const startCell = getCellByType(grid, START_CELL);
        let test = depthFirstSearch(grid.slice(), startCell);
        console.log(test);
    }

    visualizeDijkstra() {
        const { grid } = this.state;
        const startCell = getCellByType(this.state.grid, START_CELL);
        const finishCell = getCellByType(this.state.grid, END_CELL);
        const visitedCellsInOrder = dijkstra(grid, startCell, finishCell);
        const cellsInShortestPathOrder = getCellsInShortestPathOrder(finishCell);
        this.animateDijkstra(visitedCellsInOrder, cellsInShortestPathOrder);
    }

    changeCellType(type) {
        this.setState({ cellTypeSelected: type });
    }

    clearBoard() {
        const grid = this.getInitialGrid();
        this.setState({ grid });
    }

    getInitialGrid() {
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

    changeSpeed(newSpeed){
        this.setState({ speed: newSpeed });
    }

    render() {
        const { grid, mouseIsPressed } = this.state;
        return (
            <div className="path-visualizer-container">
                <div className="hearder-options-container">
                    <div Style="display:inline-block">
                        <CellTypeMenu onClick={(e, type) => this.changeCellType(type)}></CellTypeMenu>
                    </div>
                    <div Style="display:inline-block">
                        <SpeedMenu onClick={(e, type) => this.changeSpeed(type)}></SpeedMenu>
                    </div>
                    <Button variant="contained" className="green-button" onClick={() => this.visualizeDijkstra()}>
                        Visualize Dijkstra's
                    </Button>
                    <Button variant="text" onClick={() => this.clearBoard()}>
                        Clear Board
                    </Button>


                </div>
                <div className="header-helper-container">
                    <img alt="arrowDown" src={arrowDown}></img>
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
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            onMouseUp={() => this.handleMouseUp()}
                                            row={row}>
                                        </Cell>
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
                <MenuItem onClick={(e) => { handleClose(e, END_CELL) }}>Goal</MenuItem>
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