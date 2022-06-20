export function dijkstra(grid, startCell, finishCell) {
    const visitedCellsInOrder = [];
    startCell.distance = 0;
    const unvisitedCells = getAllCells(grid);
    while (!!unvisitedCells.length) {
        sortCellsByDistance(unvisitedCells);
        const closestCell = unvisitedCells.shift();
        if (closestCell.type === 'cell-wall') continue;
        if (closestCell.distance === Infinity) return visitedCellsInOrder;
        closestCell.isVisited = true;
        visitedCellsInOrder.push(closestCell);
        if (closestCell === finishCell) return visitedCellsInOrder;
        updateUnvisitedNeighbors(closestCell, grid);
    }
}

function sortCellsByDistance(unvisitedCells) {
    unvisitedCells.sort((CellA, CellB) => CellA.distance - CellB.distance);
}

function updateUnvisitedNeighbors(Cell, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(Cell, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = Cell.distance + 1;
        neighbor.previousCell = Cell;
    }
}

function getUnvisitedNeighbors(cell, grid) {
    const neighbors = [];
    const { col, row } = cell;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllCells(grid) {
    const cells = [];
    for (const row of grid) {
        for (const cell of row) {
            cells.push(cell);
        }
    }
    return cells;
}


export function getCellsInShortestPathOrder(finishCell) {
    const CellsInShortestPathOrder = [];
    let currentCell = finishCell;
    while (currentCell !== null) {
        CellsInShortestPathOrder.unshift(currentCell);
        currentCell = currentCell.previousCell;
    }
    return CellsInShortestPathOrder;
}