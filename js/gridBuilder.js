"use strict";

class gameUI {
    constructor(totalCols) {
        this.totalCols = totalCols;
        this.totalRows = 0;
        this.groundHeight = Math.floor(Math.random() * 3) + 3;
        this.groundStartRow = undefined;
    }

    buildGrid() {
        let height = $(window).height();
        let rows = Math.floor(height / 40);

        this.totalRows = rows;
        let $mainContainer = $('.main-container');

        for (let r = 0; r < rows; r++) {            
            let rowDiv = document.createElement("div");
            rowDiv.classList.add("row")
            for (let c = 0; c < this.totalCols; c++) {
                let col = new Tile(r, c);
                rowDiv.appendChild(col.getDiv());
            }
            $mainContainer.append($(rowDiv));
        }

    }

    createTree() {
        let treeStartCol = Math.floor(Math.random() * (this.totalCols - 3));
        let tempRow = this.groundStartRow - 3;
        while (!hasGroundBelow(tempRow, treeStartCol + 1)) {
            tempRow++;
            console.log(tempRow);
        }
        let startRow = tempRow - 5;
        let startCol = treeStartCol;
        console.log("row: " + startRow + " cols: " + startCol)
        for (let r = 0; r < 6; r++) {
            if (r < 3) {
                for (let c = 0; c < 3; c++) {
                    let treeLeaf = document.getElementById(`${startRow}X${startCol}`);
                    treeLeaf.classList.add("treeLeaf")
                    startCol++;
                }
            }
            else {
                let treeTrunk = document.getElementById(`${startRow}X${startCol + 1}`);
                treeTrunk.classList.add("treeTrunk")
            }
            startCol = treeStartCol;
            startRow++;
        }
    }

    createGround() {
        this.groundStartRow = (this.totalRows - this.groundHeight);
        for (let r = this.groundStartRow; r < this.totalRows; r++) {
            for (let c = 0; c < this.totalCols; c++) {
                let groundDiv = document.getElementById(`${r}X${c}`);
                groundDiv.classList.add("ground");
                if (r == (this.totalRows - 1)) {
                    groundDiv.classList.add("lava");
                }
            }
        }
    }

    createHills() {
        let currentRow = 1;
        for (let r = (this.groundStartRow - 1); r > this.groundStartRow - 3; r--) {
            console.log(r)
            for (let c = 0; c < this.totalCols; c++) {
                let chance = Math.random();
                if ((currentRow == 1 || hasGroundBelow(r, c)) && chance > 0.5) {
                    let groundDiv = document.getElementById(`${r}X${c}`);
                    groundDiv.classList.add("hill");
                }

            }
            currentRow++;
        }
    }
}

class Tile {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    
    getDiv() {
        let colDiv = document.createElement("div");
        colDiv.classList.add("regular-div");
        colDiv.setAttribute("id", `${this.row}X${this.col}`);
        return colDiv;
    }

    
}


// let gameUI = {
//     totalRows: 0,
//     totalCols: 0,
//     groundHeight: Math.floor(Math.random() * 3) + 3,
//     groundStartRow: undefined,
// }

// gameUI.buildGrid = (cols) => {
//     gameUI.totalCols = cols;
//     let height = $(window).height();
//     let rows = Math.floor(height / 40);

//     gameUI.totalRows = rows;
//     let $mainContainer = $('.main-container');

//     for (let r = 0; r < rows; r++) {
//         let rowDiv = document.createElement("div");
//         rowDiv.classList.add("row")
//         for (let c = 0; c < cols; c++) {
//             let colDiv = document.createElement("div");
//             colDiv.classList.add("regular-div");
//             colDiv.setAttribute("id", `${r}X${c}`);
//             rowDiv.appendChild(colDiv);
//         }
//         $mainContainer.append($(rowDiv));
//     }
// }


// gameUI.createTree = () => {
//     //TODO add check to make sure the tree is just touching the ground, not above not below
//     let treeStartCol = Math.floor(Math.random() * (gameUI.totalCols - 3));
//     let tempRow = gameUI.groundStartRow - 3;
//     while (!gameUI.hasGroundBelow(tempRow, treeStartCol + 1)) {
//         tempRow++;
//         console.log(tempRow);
//     }
//     let startRow = tempRow - 5;
//     let startCol = treeStartCol;
//     console.log("row: " + startRow + " cols: " + startCol)
//     for (let r = 0; r < 6; r++) {
//         if (r < 3) {
//             for (let c = 0; c < 3; c++) {
//                 let treeLeaf = document.getElementById(`${startRow}X${startCol}`);
//                 treeLeaf.classList.add("treeLeaf")
//                 startCol++;
//             }
//         }
//         else {
//             let treeTrunk = document.getElementById(`${startRow}X${startCol + 1}`);
//             treeTrunk.classList.add("treeTrunk")
//         }
//         startCol = treeStartCol;
//         startRow++;
//     }
// }

// gameUI.createGround = () => {
//     gameUI.groundStartRow = (gameUI.totalRows - gameUI.groundHeight);
//     for (let r = gameUI.groundStartRow; r < gameUI.totalRows; r++) {
//         for (let c = 0; c < gameUI.totalCols; c++) {
//             let groundDiv = document.getElementById(`${r}X${c}`);
//             groundDiv.classList.add("ground");
//             if (r == (gameUI.totalRows - 1)) {
//                 groundDiv.classList.add("lava");
//             }
//         }
//     }
// }

// gameUI.createHills = () => {
//     let currentRow = 1;
//     for (let r = (gameUI.groundStartRow - 1); r > gameUI.groundStartRow - 3; r--) {
//         console.log(r)
//         for (let c = 0; c < gameUI.totalCols; c++) {
//             let chance = Math.random();
//             if ((currentRow == 1 || gameUI.hasGroundBelow(r, c)) && chance > 0.5) {
//                 let groundDiv = document.getElementById(`${r}X${c}`);
//                 groundDiv.classList.add("hill");
//             }

//         }
//         // console.log(chance)
//         currentRow++;
//     }
// }

let hasGroundBelow = (r, c) => {
    // let leftSide = document.getElementById(`${r}X${c == 0 ? c : c - 1}`);
    // let rightSide = document.getElementById(`${r}X${c == (gameUI.totalCols - 1) ? c : c + 1}`);
    let below = document.getElementById(`${r + 1}X${c}`);

    if (below.classList.contains("hill") || below.classList.contains("ground")) {
        return true;
    }

}

function main() {
    let newGameUI = new gameUI(40);
    newGameUI.buildGrid();
    newGameUI.createGround();
    // console.log(newGameUI.groundStartRow)
    // console.log(newGameUI.totalRows)
    newGameUI.createHills();
    newGameUI.createTree();
}

main();