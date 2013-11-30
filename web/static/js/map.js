var transform = {
    x: 226,
    y: 340
}

function locateNode(node, parent, offset_level) {
    var offset = offsets[offset_level];

    var keys = [];
    for (var key in node) {
        if (key != "properties") {
            keys.unshift(key);
        }
    }
    var key;
    var childNode;
    if (node.properties == null) {
        node.properties = {position: {x: 0, y: 0}};
    }
    if (node.properties.position == null) {
        node.properties.position = {x: 0, y: 0};
    }

    node.properties.childCount = keys.length;
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        childNode = node[key];
        if (key != "properties") {
            if (childNode.properties == null) {
                childNode.properties = {position: {x: 0, y: 0}};
            }
            if (parent != null) {
                if (childNode.properties.position == null) {
                    childNode.properties.position = {x: 0, y: 0};
                }
                childNode.properties.position.x = offset.box_dwidth;
                childNode.properties.position.y = offset.box_height * (keys.length - 1) / 2 - offset.box_height * i;
            }

            locateNode(childNode, node, offset.next_offset_level);
        }
    }
}


function renderNode(node, offset_level, outset) {
    var offset = offsets[offset_level];

    for (var key in node) {
        var childNode = node[key];
        if (key != "properties") {
            context.save();
            if (childNode.properties.color) {
                context.strokeStyle = childNode.properties.color;
            }
            var childOutset = drawNode(key, childNode.properties, offset, outset);
            renderNode(childNode, offset.next_offset_level, childOutset);
            context.restore();
        }
    }
}

function drawNode(key, properties, offset, outset) {

    if (properties.color) {
        context.strokeStyle = properties.color;
    }
    var position = properties.position;

    context.lineWidth = offset.lineWidth;
    context.font = offset.font;
    var metrics = context.measureText(key);
    var width = metrics.width;

    context.roundRect(outset.x + position.x, outset.y + position.y, width + offset.text_dwidth, offset.height, 13, false);
    context.fillText(key, outset.x + position.x + offset.text_dwidth / 2, outset.y + position.y + offset.text_dy);

    var childOutset = {x: outset.x + position.x, y: outset.y + position.y};
    return childOutset;
}

