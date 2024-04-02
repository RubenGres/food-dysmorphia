document.addEventListener('DOMContentLoaded', function() {
    var zoomSlider = document.getElementById('zoomSlider');
    zoomSlider.oninput = function() {
        zoom = this.value;
        updateDivPositions();
    };

    var customButton = document.getElementById('customButton');
    var xLabelInput = document.getElementById('xLabelInput');
    var yLabelInput = document.getElementById('yLabelInput');

    customButton.onclick = function() {
        const apiUrl = `${SD_API_URL}sort?x=${encodeURIComponent(xLabelInput.value)}&y=${encodeURIComponent(yLabelInput.value)}`;

        fetch(apiUrl)
            .then(response => response.json()) // Assuming the response is in JSON format
            .then(data => {
                remove_empties();

                const scale = Math.ceil(Math.sqrt(cells.length));
                
                cells.forEach(cell => {
                    cell.elem.classList.add('cell-sorting');

                    if(data[cell.id]) {
                        cell.x = data[cell.id].x * scale;
                        cell.y = data[cell.id].y * scale;
                    }

                    setTimeout(() => {
                    cell.elem.classList.remove('cell-sorting');
                    }, 10);

                });



                updateDivPositions();
            })
            .catch(error => {
                console.error('Error:', error); // Handle any errors
            });
    }

    var gridButton = document.getElementById('gridButton');
    gridButton.onclick = function() {
        remove_all();
        add_empties();
        add_cards();
    }
});