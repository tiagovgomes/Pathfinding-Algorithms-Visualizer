import React from "react";
import './PathfindingVisualizer.scss';
import Cell from './Cell/Cell';
import { dijkstra, getCellsInShortestPathOrder } from '../Algorithms/dijkstra';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


const START_CELL = 'cell-start';
const END_CELL = 'cell-finish';
const WALL_CELL = 'cell-wall';

export default class PathfindingVisualizer extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
            cellTypeSelected: START_CELL
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
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
        for (let i = 0; i <= visitedCellsInOrder.length; i++) {
            if (i === visitedCellsInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(cellsInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const cell = visitedCellsInOrder[i];
                document.getElementById(`cell-${cell.row}-${cell.col}`).className =
                    'cell cell-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(cellsInShortestPathOrder) {
        for (let i = 0; i < cellsInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const cell = cellsInShortestPathOrder[i];
                document.getElementById(`cell-${cell.row}-${cell.col}`).className =
                    'cell cell-shortest-path';
            }, 50 * i);
        }
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
        console.log(type);
        this.setState({ cellTypeSelected: type });
    }

    render() {
        const { grid, mouseIsPressed } = this.state;
        return (
            <div className="path-visualizer-container">
                <div className="hearder-options-container">
                    <button onClick={() => this.visualizeDijkstra()}>
                        Visualize Dijkstra's Algorithm
                    </button>
                    <button onClick={() => this.changeCellType(START_CELL)}>
                        START
                    </button>
                    <button onClick={() => this.changeCellType(END_CELL)}>
                        END
                    </button>
                    <button onClick={() => this.changeCellType(WALL_CELL)}>
                        WALL
                    </button>

                    <div Style="display:inline-block">
                        <BasicMenu onClick={(e, type) => this.changeCellType(type)}></BasicMenu>
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

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 30; col++) {
            currentRow.push(createCell(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

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

function BasicMenu(props) {
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
                <MenuItem onClick={(e) => { handleClose(e, START_CELL) }}>START</MenuItem>
                <MenuItem onClick={(e) => { handleClose(e, END_CELL) }}>GOAL</MenuItem>
                <MenuItem onClick={(e) => { handleClose(e, WALL_CELL) }}>WALL</MenuItem>
            </Menu>
        </div>
    );
}