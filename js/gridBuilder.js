(() => {
    
    let gameUI = {
        totalRows: 0,
    }
    
    gameUI.buildGrid = (cols) => {
        let height = $(window).height();
        let rows = (height / 40) - 1;
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
        
        startRow = treeStartRow;
        startCol = treeStartCol;
        for (let i = 0; i < 6; i++) {
            if (i < 3) {
                for (let z = 0; z < 3; z++) {
                    let treeLeaf = document.getElementById(`${startRow}X${startCol}`);
                    treeLeaf.classList.add("treeLeaf")
                    startCol++;
                }
            }
            else {
                let treeLeaf = document.getElementById(`${startRow}X${startCol + 1}`);
                treeLeaf.classList.add("treeTrunk")
            }
            startCol = treeStartCol;
            startRow++;
        }
    }
    
    gameUI.createGround = (groundStartRow) => {

    }
    
    gameUI.buildGrid(40);
    gameUI.createTree(2, 10);
    console.log(gameUI.totalRows)
})(window)