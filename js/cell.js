function basic_cell() {
    // Create a new div element that will represent a cell
    let div = document.createElement('div');

    // Set the class for the div to apply grid cell styling
    div.className = 'gridcell';
    
    // Set the cell's height and width based on predefined variables
    div.style.height = `${cell_h*zoom}px`;
    div.style.width = `${cell_w*zoom}px`;

    return div    
}


function create_empty(coords) {
    let div = basic_cell();

    // Calculate the cell color based on its index
    let cell_color = (200*(coords[0]*10+coords[1])) % 360;
    let base_hue = `hsl(${cell_color}, 76%, 90%)`;
    let highlight_hue = `hsl(${cell_color}, 56%, 85%)`;
    div.style.backgroundColor = base_hue;
    div.addEventListener('mouseenter', function() {
        div.style.backgroundColor = highlight_hue;
    });
    div.addEventListener('mouseleave', function() {
        div.style.backgroundColor = base_hue;
    });

    // Create and add a camera icon to the cell
    let camera_icon = document.createElement('img');
    camera_icon.setAttribute('src', 'img/camera.png');
    camera_icon.setAttribute('class', 'camera_icon');
    div.appendChild(camera_icon);

    // Create and add a loading gizmo (visual feedback for loading) to the cell
    let loading_gizmo = document.createElement('div');
    loading_gizmo.setAttribute('class', 'loading_gizmo');
    div.appendChild(loading_gizmo);

    // Placeholder for a camera picture
    let camera_picture;
    
    // Initialize cell state to 'empty' and handle cell state transitions on click
    div.setAttribute("state", "empty");
    div.onclick = async () => {
        if(!state.isMoving) {
            switch(div.getAttribute("state")){
                case "empty":
                    // On first click, try taking a picture and update state
                    try {
                        camera_picture = await takePicture(div);
                        div.appendChild(camera_picture);
                        div.removeChild(camera_icon);

                        div.setAttribute("state", "generating");
                        state.isTakingPicture = false;
                    } catch (error) {
                        console.error("Error taking picture:", error);
                    }
                    break;
                
                case "generating":
                    // While loading, show loading gizmo, then generate and display image
                    loading_gizmo.className = 'loading_gizmo display';
                    
                    let generated_card = await generateCard(camera_picture, coords);

                    loading_gizmo.className = 'loading_gizmo';
                    div.removeChild(camera_picture);

                    if(generated_card != null) {
                        div.appendChild(generated_card);
                        div.setAttribute("id", generated_card.id)
                        div.setAttribute("state", "media_ready");
                        add_empties();
    
                    } else {
                        div.appendChild(camera_icon);
                        div.setAttribute("state", "empty");
                    }
                    break;

                case "media_ready":
                    div.setAttribute("state", "done");

                    cells[div.getAttribute("id")] = {
                        "elem": div,
                        "x": coords[0],
                        "y": coords[1],
                        "init_x": coords[0],
                        "init_y": coords[1],
                        "id": div.getAttribute("id")
                    };

                    break;
            }
        }
    }

    return div;
}


function create_card(image, title, text, id) {
    let div = basic_cell();
    
    div.appendChild(create_card_content(image, title, text, id));
    div.setAttribute("state","card");

    return div;
}