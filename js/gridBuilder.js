(() => {    
    
    function buildGrid() {
        let width = $(window).width();
        let height = $(window).height();
        let rows = width / 22;
        let cols = height / 22;
        let $mainContainer = $('.main-container');
        for (let i = 0; i < rows; i++) {
            let rowDiv = document.createElement("div");
            for (let x = 0; x < cols; x++) {
                let colDiv = document.createElement("div");
                colDiv.classList.add("regular-div");
                rowDiv.appendChild(colDiv);
            }
            $mainContainer.append($(rowDiv));
        }
    }

    buildGrid();
})(window)