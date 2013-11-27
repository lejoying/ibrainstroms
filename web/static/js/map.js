var offsets = {
    "level0": {
        font: "bold 24px XX",
        fontSize: 22,
        text_dwidth: 118,

        text_dx: 50,
        text_dy: 10,

        lineWidth: 4.5,
        next_offset_level: "level1",
        height: 118
    },
    "level1": {
        font: "bold 22px XX",
        fontSize: 22,
        text_dwidth: 50,

        text_dx: 24,
        text_dy: 9,

        lineWidth: 2.5,
        next_offset_level: "levelN",
        height: 35
    },
    "levelN": {
        font: "bold 19px XX",
        fontSize: 19,
        text_dwidth: 50,

        text_dx: 24,
        text_dy: 7,

        lineWidth: 2.5,
        next_offset_level: "levelN",
        height: 35
    },
    caculateTextWidth: function (key, fontSize, text_dwidth) {
        var width = key.length * fontSize + text_dwidth;
        return width;
    }
};

function renderMap() {
    renderNode(mapdata, "level0");
}

function renderNode(node, offset_level) {
    var offset = offsets[offset_level];
    for (var key in node) {
        var childNode = node[key];
        if (key != "properties") {
            drawNode(key, childNode.properties, offset);
            renderNode(childNode, offset.next_offset_level);
        }
    }
}


function drawNode(key, properties, offset) {

    if(properties.color){
        context.strokeStyle = properties.color;
    }


    context.lineWidth = offset.lineWidth;
    context.font = offset.font;
    var width = offsets.caculateTextWidth(key, offset.fontSize, offset.text_dwidth);
    context.roundRect(properties.position.x, properties.position.y, width, offset.height, 13, false);
    context.fillText(key, properties.position.x + offset.text_dx, properties.position.y + offset.text_dy);
}
