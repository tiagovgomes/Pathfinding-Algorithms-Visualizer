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


/* Maze DFS(int width, int height, Cell startCell)
{
  Maze maze(width, height);
  Stack pathStack(startCell);

    // While there is node to be handled in the stack
    while (!pathStack.empty()) {
    // Handle the cell at the top of the stack:
    // Get available neighbors from bottom, left, right, top and unvisited
    Cell cell = pathStack.pop();
    auto neighbors = GetAvailableneighbors(maze, cell);

        // If there is available node to process (loop to backtrack - 'pop' otherwise)
        if (!neighbors.empty()) {
      // Randomly select a node to be processed
      auto randIdx = Random() % neighbors.size();

            // For each available node: connect to the cell, mark it as visited
            // and push it into the stack.
            for (auto i = 0; i < neighbors.size(); ++i)
            {
                cell -> Connect(Cell:: Visite(neighbors[i]));

                // Only the chosen item should be add to the top following a DFS strategy
                if (i != randIdx) pathStack.push(neighbors[i]);
            }

            // Add the chosen node as the next one to be processed
            pathStack.push(neighbors[randIdx]);
        }
    }

    return maze;
}  */