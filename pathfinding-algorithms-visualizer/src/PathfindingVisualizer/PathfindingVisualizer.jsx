import React from "react";
import './PathfindingVisualizer.scss';
import Cell from './Cell/Cell';
import { dijkstra, getCellsInShortestPathOrder } from '../Algorithms/dijkstra';

export default class PathfindingVisualizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
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
        const startCell = grid[10][5];
        const finishCell = grid[15][20];
        const visitedCellsInOrder = dijkstra(grid, startCell, finishCell);
        const cellsInShortestPathOrder = getCellsInShortestPathOrder(finishCell);
        this.animateDijkstra(visitedCellsInOrder, cellsInShortestPathOrder);
    }

    render() {
        const { grid, mouseIsPressed } = this.state;
        return (
            <div>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visualize Dijkstra's Algorithm
                </button>
                {grid.map((row, rowIdx) => {
                    return (
                        <div className="row">
                            {row.map((cell, cellIdx) => {
                                const { row, col, isFinish, isStart, isWall } = cell;
                                return (
                                    <Cell
                                        key={rowIdx + cellIdx}
                                        col={col}
                                        isFinish={isFinish}
                                        isStart={isStart}
                                        isWall={isWall}
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
        isStart: row === 10 && col === 5,
        isFinish: row === 15 && col === 20,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousCell: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const cell = newGrid[row][col];
    const newNode = {
        ...cell,
        isWall: !cell.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};