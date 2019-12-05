"use strict";
(() => {

    class GameGrid {
        constructor(totalCols) {
            this.totalCols = totalCols;
            this.totalRows = 0;
            this.groundHeight = Math.floor(Math.random() * 3) + 3;
            this.groundStartRow = undefined;
            this.hillHeight = 2;
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
                //console.log(tempRow);
            }
            let startRow = tempRow - 5;
            let startCol = treeStartCol;
            //console.log("row: " + startRow + " cols: " + startCol)
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
                    if (r == (this.totalRows - 1)) {
                        groundDiv.classList.add("lava");
                        groundDiv.setAttribute("tileType", "lava");
                        groundDiv.setAttribute("action", "eraser");
                    }
                    groundDiv.classList.add("ground");
                    groundDiv.setAttribute("tileType", "ground");
                    groundDiv.setAttribute("action", "shovel");
                }
            }
        }

        createHills() {
            let currentRow = 1;
            for (let r = (this.groundStartRow - 1); r > this.groundStartRow - 3; r--) {
                //console.log(r)
                for (let c = 0; c < this.totalCols; c++) {
                    let chance = Math.random() > 0.5;
                    if ((currentRow == 1 || this.hasGroundBelow(r, c)) && chance) {
                        let groundDiv = document.getElementById(`${r}X${c}`);
                        groundDiv.classList.add("hill");
                        groundDiv.setAttribute("tileType", "hill")
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
                    let chance = Math.random() > 0.5;
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

        createGrass(){
            let startRow = this.groundStartRow - this.hillHeight;
            for (let row = startRow ; row < startRow + this.hillHeight +1 ; row++){
                for (let col = 0 ; col < this.totalCols ; col++){
                    let colChecked = document.getElementById(`${row}X${col}`);
                    if ((colChecked.getAttribute('tiletype') == 'hill' || colChecked.getAttribute('tiletype') == 'ground') && this.hasNoGroundOnTop(row , col) == false){
                        colChecked.classList.add('grass');
                    };
                }
            } 
            
        }
    


    hasGroundBelow(r, c) {
        let below = document.getElementById(`${r + 1}X${c}`);

        if (below.classList.contains("hill") || below.classList.contains("ground") || below.classList.contains("rock")) {
            return true;
        } else {
            return false;
        }
    }

    hasNoGroundOnTop(r, c) {
        let top = document.getElementById(`${r + -1}X${c}`);

        if (top.classList.contains("hill") || top.classList.contains("ground")) {
            return true;
        } else {
            return false;
        }
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
        this.div.setAttribute("tileType", "sky");
        this.div.setAttribute("id", `${this.row}X${this.col}`);
        this.div.addEventListener("click", function (e) { gameUI.handleAction(e) })
        return this.div;
    }
}

let gameUI = {
    currentAction: null,
    currentTile: null,
    minedTiles: {},
};



gameUI.handleAction = (e) => {
    //console.log(gameUI.currentAction)
    //console.log(gameUI.currentAction + " " + e.target.classList)
    let minedTile;
    if (e.target.classList == "regular-div" && gameUI.currentAction == null) {
        console.log("Nothing in this div but sky");
        e.target.classList.add(gameUI.currentTile);
        return;
    }
    else if (gameUI.currentAction == "eraser" || e.target.getAttribute("action") == gameUI.currentAction) {
        minedTile = e.target.getAttribute("tileType");
        //console.log("Mined tile: " + minedTile);            
        gameUI.minedTiles[minedTile] ? gameUI.minedTiles[minedTile]++ : gameUI.minedTiles[minedTile] = 1;
        e.target.classList = "regular-div";
        gameUI.showMinedTiles();
        
    }
    else{
        let currentTile = event.target;
        currentTile.classList.add('bzzz');
        setTimeout(() => {
            currentTile.classList.remove('bzzz')
        }, 700);
    }
    
};

gameUI.falling = (currentTile) =>{
    let row = currentTile.id.split('X')[0];
    let col = currentTile.id.split('X')[1];
    let currentFallingTile  = document.getElementById(`${parseInt(row)-1}X${col}`);
    let fallingTo = document.getElementById(`${parseInt(row)+1}X${col}`);
    let gap = document.getElementById(`${row}X${col}`);
    console.log(fallingTo.getAttribute('tiletype'))
    if(fallingTo.getAttribute('tiletype') == 'ske'){
        console.log('falling')
    }
    // if(currentFallingTile.classList.contains('ground') || currentFallingTile.classList.contains('rock') || currentFallingTile.classList.contains('treeTrunk') || currentFallingTile.classList.contains('treeLeaf') || currentFallingTile.classList.contains('lava') || currentFallingTile.classList.contains('grass')){
    //     currentFallingTile.classList.remove('ground');
    //     gap.classList.add('ground');
    //     gameUI.falling(currentFallingTile)
    // }
    else{
        
    }
}

gameUI.createSideBar = () => {

    //TODO - Zohar
    //Need to implement the tool bar with 4 tools here
    //Each one needs an onclick which changes gameUI.currentAction = chosenAction which is one of: 
    // on click make gameUI.currentTile = null 
    // 1. "axe"
    // 2. "shovel"
    // 3. "pickaxe"
    // 4. "eraser"
    let sidebar = document.createElement('div');
    sidebar.setAttribute('id', 'sidebar');
    document.body.prepend(sidebar);

    let tools = ["axe", "shovel", "pickaxe", "eraser"]
    let toolbar = document.createElement('div');
    let minedTilesDiv = document.createElement('div');
    toolbar.setAttribute('id', 'toolbar');
    minedTilesDiv.setAttribute('id', 'minedTilesDiv');
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
            event.target.classList.add('selected')
        })
    };
    document.getElementById('sidebar').append(toolbar);
    document.getElementById('sidebar').append(minedTilesDiv);

    ///////////////////////////// 

    let tileTypes = ['lava', 'ground', 'grass', 'treeTrunk', 'treeLeaf', 'rock']
    minedTilesDiv = document.getElementById('minedTilesDiv');
    for (let i in tileTypes) {
        minedTilesDiv.append(document.createElement('div'));
        minedTilesDiv.getElementsByTagName('div')[i].classList.add('minedTileDiv');
        minedTilesDiv.getElementsByTagName('div')[i].setAttribute('id', tileTypes[i]);
        
        //minedTilesDiv.getElementsByTagName('div')[i].append(document.createElement('div'))
    }




}

gameUI.showMinedTiles = () => {

    

    let tilesArr = [];
    tilesArr.push(Object.keys(gameUI.minedTiles));
    //console.log(tilesArr[0])
    for (let minedTile of tilesArr[0]){
        console.log(minedTile)
    }


    // for (let tile of Object.keys(gameUI.minedTiles)){

    //     minedTilesDiv.append(document.createElement('div'));
    // }


    //TODO - Zohar
    //Need to implement here a way to show the mined tiles save in gameUI.minedTiles object.
    //The minedTiles object is build in a way of key : value. where key is the class of the mined tile and value is the amount
    //on click on mined tile - change gameUI.action to class of the tile
    //  on click gameUI.currentAction = null;

}

function main() {
    let newGameUI = new GameGrid(40);
    newGameUI.buildGrid();
    newGameUI.createGround();
    // console.log(newGameUI.groundStartRow)
    // console.log(newGameUI.totalRows)
    newGameUI.createHills();
    newGameUI.createTree();
    newGameUI.createRock();
    newGameUI.createGrass();
    //newGameUI.createRocks();
    gameUI.createSideBar();
}

main();
}) (window)