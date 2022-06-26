export function recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, type, cellsToAnimate) {
    if (rowEnd < rowStart || colEnd < colStart) {
        return;
    }
    if (surroundingWalls) {

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                let node = grid[row][col];
                if (node.type !== "cell-start" && node.type !== "cell-target") {
                    if (node.row === 0 || node.col === 0 || node.row === rowEnd - 1 || node.col === colEnd - 1) {
                        cellsToAnimate.push(node);
                        if (type === "wall") {
                            node.type = "cell-wall";
                        }
                    }
                }
            }
        }
        colStart = 2;
        rowStart = 2;
        rowEnd = rowEnd - 3;
        colEnd = colEnd - 3;
        surroundingWalls = false;
    }
    if (orientation === "horizontal") {
        let possibleRows = [];
        for (let number = rowStart; number <= rowEnd; number += 2) {
            possibleRows.push(number);
        }
        let possibleCols = [];
        for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
            possibleCols.push(number);
        }
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let currentRow = possibleRows[randomRowIndex];
        let colRandom = possibleCols[randomColIndex];
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                let node = grid[row][col];
                if (node.row === currentRow && node.col !== colRandom && node.col >= colStart - 1 && node.col <= colEnd + 1) {
                    if (node.type !== "cell-start" && node.type !== "cell-target") {
                        cellsToAnimate.push(node);
                        if (type === "wall") {
                            node.type = "cell-wall";
                        }
                    }
                }
            }
        }
        if (currentRow - 2 - rowStart > colEnd - colStart) {
            recursiveDivisionMaze(grid, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls, type, cellsToAnimate);
        } else {
            recursiveDivisionMaze(grid, rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls, type, cellsToAnimate);
        }
        if (rowEnd - (currentRow + 2) > colEnd - colStart) {
            recursiveDivisionMaze(grid, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls, type, cellsToAnimate);
        } else {
            recursiveDivisionMaze(grid, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls, type, cellsToAnimate);
        }
    } else {
        let possibleCols = [];
        for (let number = colStart; number <= colEnd; number += 2) {
            possibleCols.push(number);
        }
        let possibleRows = [];
        for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
            possibleRows.push(number);
        }
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let currentCol = possibleCols[randomColIndex];
        let rowRandom = possibleRows[randomRowIndex];
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                let node = grid[row][col];
                if (node.col === currentCol && node.row !== rowRandom && node.row >= rowStart - 1 && node.row <= rowEnd + 1) {
                    if (node.type !== "cell-start" && node.type !== "cell-target") {
                        cellsToAnimate.push(node);
                        if (type === "wall") {
                            node.type = "cell-wall";
                        }
                    }
                }
            }
        }
        if (rowEnd - rowStart > currentCol - 2 - colStart) {
            recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls, type, cellsToAnimate);
        } else {
            recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls, type, cellsToAnimate);
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            recursiveDivisionMaze(grid, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls, type, cellsToAnimate);
        } else {
            recursiveDivisionMaze(grid, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls, type, cellsToAnimate);
        }
    }
};