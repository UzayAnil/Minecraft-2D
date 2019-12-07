"use strict";
(() => {

    class GameGrid {
        constructor(totalCols) {
            this.totalCols = totalCols;
            this.totalRows = 0;
            this.groundHeight = Math.floor(Math.random() * 3) + 3;
            this.groundStartRow = undefined;
            this.hillHeight = 2;
            this.buildGrid();
            this.createGround();
            this.createCloud();
            this.createCloud();
            this.createCloud();
            this.createHills();
            this.createTree();
            this.createTree();
            this.createTree();
            this.createBush();
            this.createRock();
            this.createGrass();
        }

        buildGrid() {
            let height = $(window).height();
            let rows = Math.floor(height / 40);

            this.totalRows = rows;
            let $mainContainer = $('#main-container');

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

        createCloud() {
            let maxWidth = Math.floor(this.totalCols / 16);
            let startRow = 3 + Math.floor(Math.random() * 4)
            let startCol = Math.floor(Math.random() * (this.totalCols - maxWidth))
            for (let row = startRow; row < startRow + 2; row++) {
                for (let col = startCol; col < startCol + maxWidth; col++) {
                    let cloudDiv = document.getElementById(`${row}X${col}`);
                    if (Math.random() > 0.22) {
                        cloudDiv.classList.add('cloud');
                    }
                }
            }
        }

        createTree() {
            let treeStartCol = Math.floor(Math.random() * (this.totalCols - 3));
            let tempRow = this.groundStartRow - 3;
            while (!this.hasGroundBelow(tempRow, treeStartCol + 1)) {
                tempRow++;
            }
            let startRow = tempRow - 5;
            let startCol = treeStartCol;
            for (let r = 0; r < 6; r++) {
                if (r < 3) {
                    for (let c = 0; c < 3; c++) {
                        let treeLeaf = document.getElementById(`${startRow}X${startCol}`);
                        treeLeaf.classList.add("treeLeaf");
                        treeLeaf.setAttribute("tileType", "treeLeaf");
                        treeLeaf.setAttribute("action", "axe");
                        startCol++;
                    }
                }
                else {
                    let treeTrunk = document.getElementById(`${startRow}X${startCol + 1}`);
                    treeTrunk.classList.add("treeTrunk");
                    treeTrunk.setAttribute("tileType", "treeTrunk");
                    treeTrunk.setAttribute("action", "axe");
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
                    groundDiv.setAttribute("tileType", "ground");
                    groundDiv.setAttribute("action", "shovel");
                    if (r == (this.totalRows - 1)) {
                        groundDiv.classList.add("lava");
                        groundDiv.setAttribute("tileType", "lava");
                        groundDiv.setAttribute("action", "eraser");
                    }
                }
            }
        }

        createHills() {
            let currentRow = 1;
            for (let r = (this.groundStartRow - 1); r > this.groundStartRow - 3; r--) {
                for (let c = 0; c < this.totalCols; c++) {
                    let chance = Math.random() > 0.6;
                    if ((currentRow == 1 || this.hasGroundBelow(r, c)) && chance) {
                        let groundDiv = document.getElementById(`${r}X${c}`);
                        groundDiv.classList.add("ground");
                        groundDiv.setAttribute("tileType", "ground")
                        groundDiv.setAttribute("action", "shovel")
                    }

                }
                currentRow++;
            }
        }

        createRock() {
            let currentRow = 1;
            for (let r = (this.groundStartRow - 1); r > this.groundStartRow - 4; r--) {
                for (let c = 0; c < this.totalCols; c++) {
                    let chance = Math.random() > 0.7;
                    let groundDiv = document.getElementById(`${r}X${c}`);
                    if ((currentRow == 1 || this.hasGroundBelow(r, c)) && chance && groundDiv.className == "regular-div") {
                        groundDiv.classList.add("rock");
                        groundDiv.setAttribute("tileType", "rock");
                        groundDiv.setAttribute("action", "pickaxe");
                    }

                }
                currentRow++;
            }
        }

        createBush() {
            let currentRow = 1;
            for (let r = (this.groundStartRow - 1); r > this.groundStartRow - 3; r--) {
                for (let c = 0; c < this.totalCols; c++) {
                    let chance = Math.random() > 0.5;
                    let groundDiv = document.getElementById(`${r}X${c}`);
                    if ((currentRow == 1 || this.hasGroundBelow(r, c)) && chance && groundDiv.className == "regular-div") {
                        groundDiv.classList.add("treeLeaf");
                        groundDiv.setAttribute("tileType", "treeLeaf");
                        groundDiv.setAttribute("action", "axe");
                    }

                }
                currentRow++;
            }
        }

        createGrass() {
            let startRow = this.groundStartRow - this.hillHeight;
            for (let row = startRow; row < startRow + this.hillHeight + 1; row++) {
                for (let col = 0; col < this.totalCols; col++) {
                    let colChecked = document.getElementById(`${row}X${col}`);
                    if (colChecked.getAttribute('tiletype') == 'ground' && !this.hasGroundOnTop(row, col)) {
                        colChecked.classList.add('grass');
                        colChecked.setAttribute("tiletype", "grass");
                        colChecked.classList.remove('ground');
                    };
                }
            }

        }

        hasGroundBelow(r, c) {
            let below = document.getElementById(`${r + 1}X${c}`);
            return (below.classList.contains("ground") || below.classList.contains("grass") || below.classList.contains("rock"))
        }

        hasGroundOnTop(r, c) {
            let top = document.getElementById(`${r + -1}X${c}`);
            return (top.classList.contains("ground") || top.classList.contains("grass"));
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

    const gameUI = {
        currentAction: null,
        currentTile: null,
        minedTiles: {},
        tileTypes: ['lava', 'ground', 'grass', 'treeTrunk', 'treeLeaf', 'rock'],
        gameGrid: undefined,
    };


    gameUI.handleAction = (e) => {
        if (e.target.classList == "regular-div" && gameUI.currentAction == null && gameUI.currentTile != null) {
            console.log("Nothing in this div but sky");
            e.target.classList.add(gameUI.currentTile);
            e.target.setAttribute("tiletype", gameUI.currentTile);
            let actionAtt;
            switch (gameUI.currentTile) {
                case "treeTrunk":
                    actionAtt = "axe";
                    break;
                case "treeLeaf":
                    actionAtt = "axe";
                    break;
                case "rock":
                    actionAtt = "pickaxe";
                    break;
                case "ground":
                    actionAtt = "shovel"
                    break;
                case "grass":
                    actionAtt = "shovel"
                    break;
            }
            e.target.setAttribute("action", actionAtt);
            gameUI.minedTiles[gameUI.currentTile]--;
            gameUI.updateMinedTiles();
            return;
        }
        let minedTile = e.target.getAttribute("tileType");
        if (minedTile == null) {
            gameUI.bzzz(e);
            return
        }

        if ((gameUI.currentAction == "eraser" || e.target.getAttribute("action") == gameUI.currentAction) && gameUI.currentAction != null) {
            gameUI.minedTiles[minedTile] ? gameUI.minedTiles[minedTile]++ : gameUI.minedTiles[minedTile] = 1;
            console.log(gameUI.minedTiles)
            e.target.removeAttribute("tiletype");
            e.target.classList = "regular-div";
            gameUI.updateMinedTiles();
        } else {
            gameUI.bzzz(e);
            return
        }
    };

    gameUI.bzzz = (e) => {
        e.target.classList.add("bzzz");
        setTimeout(() => { e.target.classList.remove("bzzz") }, 500);
    }

    gameUI.createSideBar = () => {

        let sidebar = document.createElement('div');
        sidebar.setAttribute('id', 'sidebar');
        document.body.prepend(sidebar);

        let tools = ["axe", "shovel", "pickaxe", "eraser"]
        let toolbar = document.createElement('div');
        toolbar.setAttribute('id', 'toolbar');
        for (let i = 0; i < 4; i++) {
            toolbar.append(document.createElement('div'));
            toolbar.getElementsByTagName('div')[i].setAttribute('class', 'tool');
            toolbar.getElementsByTagName('div')[i].setAttribute('id', tools[i]);
            toolbar.getElementsByTagName('div')[i].addEventListener('click', () => {
                gameUI.currentTile = null;
                gameUI.currentAction = event.target.id;
                document.getElementById('main-container').className = '';
                document.getElementById('main-container').classList.add(tools[i]);
                for (let i = 0; i < document.getElementsByClassName('tool').length; i++) {
                    document.getElementsByClassName('tool')[i].classList.remove('selected')
                }
                event.target.classList.add('selected');
            })
        };
        document.getElementById('sidebar').append(toolbar);

    }

    gameUI.createMinedTiles = () => {

        let minedTilesDiv = document.createElement('div');
        minedTilesDiv.setAttribute('id', 'minedTilesDiv');
        document.getElementById('sidebar').append(minedTilesDiv);

        minedTilesDiv = document.getElementById('minedTilesDiv');
        for (let i in gameUI.tileTypes) {
            let minedDiv = document.createElement('div');
            minedTilesDiv.append(minedDiv);
            minedDiv.classList.add('minedTileDiv');
            minedDiv.classList.add('d-none');
            minedDiv.setAttribute('id', gameUI.tileTypes[i]);
            minedDiv.addEventListener("click", function () {
                gameUI.currentAction = null;
                gameUI.currentTile = this.id;
                document.getElementById("main-container").className = this.id;

                console.log(this.id)
            })
        }


    }

    gameUI.updateMinedTiles = () => {
        for (let tileType of gameUI.tileTypes) {
            let tile = document.getElementById(tileType);
            if (gameUI.minedTiles[tileType] && gameUI.minedTiles[tileType] != 0) {
                tile.classList.remove("d-none");
                tile.innerText = gameUI.minedTiles[tileType];
            } else if (gameUI.minedTiles[tileType] == 0 && tileType == gameUI.currentTile) {
                console.log("else if")
                tile.classList.add("d-none");
                gameUI.currentTile = "null";
                document.getElementById("main-container").className = "";
            }
        }
    }

    gameUI.modalFunctions = () => {
        let splash = document.getElementById('splash');
        let btnsArr = splash.getElementsByClassName('btn');
        for (let btn of btnsArr) {
            btn.addEventListener('click', function () {
                gameUI.gameGrid = new GameGrid(this.value);
                splash.style.display = 'none';
                gameUI.createSideBar();
                gameUI.createMinedTiles();
            })
        }
    }

    gameUI.restart = () => {
        let resetBtn = document.getElementById("reset");
        resetBtn.addEventListener("click", function () {
            $('#main-container').empty();
            $('#sidebar').remove();
            let splash = document.getElementById('splash');
            splash.style.display = 'block';
        });
    }

    function main() {
        gameUI.modalFunctions();
        gameUI.restart();
    }

    main();

})(window)