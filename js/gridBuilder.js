"use strict";
(() => {
    
    let gameUI = {
        totalRows: 0,
        totalCols: 0,
        groundHeight: Math.floor(Math.random() * 5) + 3,
    }
    
    gameUI.buildGrid = (cols) => {
        gameUI.totalCols = cols;
        let height = $(window).height();
        let rows = Math.floor(height / 40);

        gameUI.totalRows = rows;
        let $mainContainer = $('.main-container');

        for (let r = 0; r < rows; r++) {
            let rowDiv = document.createElement("div");
            rowDiv.classList.add("row")
            for (let c = 0; c < cols; c++) {
                let colDiv = document.createElement("div");
                colDiv.classList.add("regular-div");
                colDiv.setAttribute("id", `${r}X${c}`);
                rowDiv.appendChild(colDiv);
            }
            $mainContainer.append($(rowDiv));
        }
    }

    
    gameUI.createTree = (treeStartRow, treeStartCol) => {
        //TODO add check to make sure the tree is just touching the ground, not above not below
        
        let startRow = treeStartRow;
        let startCol = treeStartCol;
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
    
    gameUI.createGround = (groundHeight) => {
        gameUI.groundStartRow = gameUI.totalRows - groundHeight;
        for (let r = gameUI.groundStartRow; r < gameUI.totalRows; r++) {
            for (let c = 0; c < gameUI.totalCols; c++) {
                let groundDiv = document.getElementById(`${r}X${c}`);
                groundDiv.classList.add("ground");
                if (r == (gameUI.totalRows-1)) {
                    groundDiv.classList.add("lava");
                }
            }
        }
    }
    
    gameUI.buildGrid(40);
    gameUI.createTree(2, 10);
    gameUI.createGround(gameUI.groundHeight);
    console.log(gameUI.totalRows)
})(window)