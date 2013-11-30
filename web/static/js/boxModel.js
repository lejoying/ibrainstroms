function buildBoxModel(node, offset_level, outset) {
    var offset = offsets[offset_level];

    for (var key in node) {
        var childNode = node[key];
        if (key != "properties") {

            var childOutset = buildBoxModelNode(key, childNode.properties, offset, outset);
            buildBoxModel(childNode, offset.next_offset_level, childOutset);
        }
    }
}

function buildBoxModelNode(key, properties, offset, outset) {

    height = childCount * offset.box_height;

}