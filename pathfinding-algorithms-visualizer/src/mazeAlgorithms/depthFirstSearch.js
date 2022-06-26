export function depthFirstSearch(grid, startCell) {
    //debugger;
    let cellsToCheck = [startCell];
    let currentCell = startCell;
    let directionsTried = []
    //row /col
    do {
        let direction = getRandomInt(0, 3);
        let nextCell = getCellNeighbour(grid, currentCell, direction);

        if (nextCell && !nextCell.visited) {
            cellsToCheck.push(currentCell);
            currentCell.directionTaken = direction;
            nextCell.previousCell = currentCell;
            currentCell = nextCell;
            currentCell.visited = true;
            directionsTried = []
        } else {
            if (!directionsTried.find(element => element === direction)) directionsTried.push(direction);
            if (directionsTried.length === 4) {//tried all Directions
                currentCell = cellsToCheck.pop();
                directionsTried = [];
            }
        }
    } while (cellsToCheck.length !== 0);

    return grid;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getCellNeighbour(grid, currentCell, direction) {
    switch (direction) {
        case 0: //left
            if (currentCell.col - 1 >= 0) {
                return grid[currentCell.row][currentCell.col - 1];
            }
            break;
        case 1: // top
            if (currentCell.row - 1 >= 0) {
                return grid[currentCell.row - 1][currentCell.col];
            }
            break;
        case 2: // right
            if (currentCell.col + 1 < grid[0].length) {
                return grid[currentCell.row][currentCell.col + 1];
            }
            break;
        case 3: // bottom
            if (currentCell.row + 1 < grid.length) {
                return grid[currentCell.row + 1][currentCell.col];
            }
            break;

    }
    return null;
}