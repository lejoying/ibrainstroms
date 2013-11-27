function renderMap() {
    renderNode(mapdata);
}

function renderNode(node) {
    for (var key in node) {
        var childNode = node[key];
        if(key!="properties"){
            drawNode(key, childNode.properties);
            renderNode(childNode);
        }
    }
}


function drawNode(key, properties) {

    context.lineWidth = properties.lineWidth;
    context.roundRect(properties.position.x, properties.position.y, properties.size.height, properties.size.width, 13, false);
    context.font = properties.font;
    context.fillText(key, properties.position.x + 46, properties.position.y + 66);
}
