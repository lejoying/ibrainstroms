var rootOutset = {
    x: 50 + 64,
    y: 340 - 75,
    resolving: false
}

function initializeMap() {
    locateNode(mapdata, null, "level0");
    preLCA(mapdata);

    initializeBox2DModel();
    buildBoxModel(mapdata, "level0", rootOutset);
}

function locateNode(node, parent, offset_level) {//offset_level here is for node's children.
    var offset = offsets[offset_level];

    var keys = [];
    for (var key in node) {
        if (key != "properties") {
            keys.unshift(key);
        }
    }

    if (node.properties == null) {
        node.properties = {position: {x: 0, y: 0}};
        node.properties.boxWidth = 0;
    }
    if (node.properties.position == null) {
        node.properties.position = {x: 0, y: 0};
    }

    var key;
    var childNode;
    node.properties.childCount = keys.length;
    for (var i = 0; i < keys.length; i++) {//resolve childNodes
        key = keys[i];
        childNode = node[key];
        if (key == "properties" || key == "key") {
            continue;
        }
        if (childNode.properties == null) {
            childNode.properties = {position: {x: 0, y: 0}};
        }
        context.font = offset.font;//wrap conntent
        var metrics = context.measureText(key);
        childNode.properties.textWidth = metrics.width;
        childNode.properties.boxWidth = metrics.width + offset.text_dwidth;

        if (childNode.properties.position == null) {
            childNode.properties.position = {x: 0, y: 0};
        }

        childNode.properties.position.x = node.properties.boxWidth + offset.box_dwidth;
        childNode.properties.position.y = offset.box_height * (keys.length - 1) / 2 - offset.box_height * i;

        if (childNode.properties.headPoint == null) {
            childNode.properties.headPoint = {x: 0, y: 0};
        }
        childNode.properties.headPoint.x = 0;
        childNode.properties.headPoint.y = 0;

        if (childNode.properties.tailPoint == null) {
            childNode.properties.tailPoint = {x: 0, y: 0};
        }
        childNode.properties.tailPoint.x = childNode.properties.boxWidth;
        childNode.properties.tailPoint.y = 0;

        locateNode(childNode, node, offset.next_offset_level);
    }
}

function renderNode(node, parent, offset_level, outset) {
    var offset = offsets[offset_level];

    for (var key in node) {
        var childNode = node[key];
        if (key == "properties" || key == "key") {
            continue;
        }
        context.save();
        if (childNode.properties.color) {
            context.strokeStyle = childNode.properties.color;
        }

        var childOutset = resolveNode(childNode.properties, offset, outset);
        renderNode(childNode, node, offset.next_offset_level, childOutset);

        drawNode(key, childNode.properties, offset, outset);
        if (parent != null) {
            drawCurve(childNode, node, offset, outset);
        }

        context.restore();
    }
}

function drawCurve(childNode, node, offset, outset) {
    context.beginPath();
    if (childNode.properties.color) {
        context.strokeStyle = childNode.properties.color;
    }
    context.lineWidth = offset.lineWidth;

    var headPoint = childNode.properties.headPoint;
    var tailPoint = node.properties.tailPoint;
    var position = childNode.properties.position;

    x1 = outset.x + tailPoint.x;
    y1 = outset.y + tailPoint.y;
    x2 = outset.x + position.x + headPoint.x
    y2 = outset.y + position.y + headPoint.y;

    cpx1 = (x1 * 0.2 + x2 * 1.8) / 2;
    cpy1 = (y1 * 0.05 + y2 * 1.95) / 2;
    cpx2 = (x1 * 1.95 + x2 * 0.05) / 2;
    cpy2 = (y1 * 0.2 + y2 * 1.8) / 2;
    context.moveTo(x1, y1);
    //    context.quadraticCurveTo(cpx1, cpy1, x2, y2);
    context.bezierCurveTo(cpx2, cpy2, cpx1, cpy1, x2, y2)
    context.stroke();
}

function drawNode(key, properties, offset, outset) {

    if (properties.color) {
        context.strokeStyle = properties.color;
    }
    var position = properties.position;

    context.lineWidth = offset.lineWidth;
    context.font = offset.font;

    context.roundRect(outset.x + position.x, outset.y + position.y, properties.textWidth + offset.text_dwidth, offset.height, 13, false);
    context.fillText(key, outset.x + position.x + offset.text_dwidth / 2, outset.y + position.y + offset.text_dy);
    //    context.fillText(properties.uniqueID, outset.x + position.x + offset.text_dwidth / 2, outset.y + position.y + offset.text_dy);
}

function resolveNode(properties, offset, outset) {
    var position = properties.position;
    var resolving = false;
    if (properties.resolving || outset.resolving) {
        var boxPosition = new Box2D.Common.Math.b2Vec2((outset.x + position.x + (properties.textWidth + offset.text_dwidth) / 2) / 30, (outset.y + position.y) / 30);
        properties.body.SetPosition(boxPosition);
        resolving = true;
        properties.resolving = false;
    }

    var childOutset = {x: outset.x + position.x, y: outset.y + position.y, resolving: resolving};
    return childOutset;
}
