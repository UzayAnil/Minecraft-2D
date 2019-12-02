"use strict";
(() => {

    class GameGrid {
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
                    col.bind
                }
                $mainContainer.append($(rowDiv));
            }

        }

        createTree() {
            let treeStartCol = Math.floor(Math.random() * (this.totalCols - 3));
            let tempRow = this.groundStartRow - 3;
            while (!this.hasGroundBelow(tempRow, treeStartCol + 1)) {
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
                    if (r == (this.totalRows - 1)) {
                        groundDiv.classList.add("lava");
                    }
                    groundDiv.classList.add("ground");
                }
            }
        }

        createHills() {
            let currentRow = 1;
            for (let r = (this.groundStartRow - 1); r > this.groundStartRow - 3; r--) {
                console.log(r)
                for (let c = 0; c < this.totalCols; c++) {
                    let chance = Math.random();
                    if ((currentRow == 1 || this.hasGroundBelow(r, c)) && chance > 0.5) {
                        let groundDiv = document.getElementById(`${r}X${c}`);
                        groundDiv.classList.add("hill");
                    }

                }
                currentRow++;
            }
        }

        hasGroundBelow(r, c) {
            let below = document.getElementById(`${r + 1}X${c}`);

            if (below.classList.contains("hill") || below.classList.contains("ground")) {
                return true;
            } else {
                return false;
            }
        }

        createToolBar() {
            console.log("Tool bar not implemented yet")
            //Need to implement the tool bar with 4 tools here
            //Each one needs an onclick which changes gameUI.currentAction = chosenAction which is one of: 
            // 1. "axe"
            // 2. "shovel"
            // 3. "pickaxe"
            // 4. "eraser"
        }

        showMinedTiles() {
            console.log("not implemented yet")
            //Need to implement here a way to show the mined tiles save in gameUI.minedTiles object.
            //The minedTiles object is build in a way of key : value. where key is the class of the mined tile and value is the amount
        }
    }

    class Tile {
        constructor(row, col) {
            this.row = row;
            this.col = col;
            this.div = undefined;
        }

        getDiv() {
            this.div = document.createElement("div");
            this.div.classList.add("regular-div");
            this.div.setAttribute("id", `${this.row}X${this.col}`);
            this.div.addEventListener("click", function (e) { gameUI.handleAction(e) })
            return this.div;
        }
    }

    let gameUI = {
        currentAction: "eraser",
        minedTiles: {},
    };



    gameUI.handleAction = (e) => {
        console.log(gameUI.currentAction + " " + e.target.classList)
        if (e.target.classList == "regular-div") {
            console.log("Nothing in this div but sky");
            return;
        }
        let minedTile;
        switch (gameUI.currentAction) {
            case "axe":

                break;
            case "shovel":
                break;
            case "pickaxe":
                break;
            case "eraser":
                minedTile = e.target.classList[1];
                console.log("Mined tile: " + minedTile);
                if (gameUI.minedTiles[minedTile]) {
                    gameUI.minedTiles[minedTile]++;
                } else {
                    gameUI.minedTiles[minedTile] = 1;
                }
                console.log(gameUI.minedTiles);
                e.target.classList = "regular-div";
                break;
        }
    };

    function main() {
        let newGameUI = new GameGrid(40);
        newGameUI.buildGrid();
        newGameUI.createGround();
        // console.log(newGameUI.groundStartRow)
        // console.log(newGameUI.totalRows)
        newGameUI.createHills();
        newGameUI.createTree();
    }

    main();
})(window)