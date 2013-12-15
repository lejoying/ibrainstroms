/*
 The Latest Common Ancestor algorithm.
 */

var uniqueID=0;

function preLCA(node) {
    if (node.properties == null) {
        node.properties = {};
    }
    if (node.properties.level == null) {
        node.properties.level = 0;//root node start with 1
    }

    for (var key in node) {
        var childNode = node[key];
        if (key == "properties" || key == "key") {
            continue;
        }
        if (childNode.properties == null) {
            childNode.properties = {};
        }

        childNode.properties.parent = node;//for lca algorithm
        childNode.properties.level = node.properties.level + 1;//for lca algorithm
        childNode.properties.key = key;//for lca algorithm

        childNode.properties.uniqueID = ++uniqueID;//for lca algorithm

        childNode.key = key;//for debug showing directly
        preLCA(childNode);
    }
}

function LCA(node1, node2) {
    var parent1;
    var parent2;
    var result;

    if (node1.properties.level == node2.properties.level) {
        parent1 = node1.properties.parent;
        parent2 = node2.properties.parent;

        if (parent1.key == parent2.key) {
            result = {
                latestCommonAncestor: parent1,
                brother1: node1,
                brother2: node2
            }
            return result;
        }
        else {
            return LCA(parent1, parent2);
        }
    }
    else {
        difference = node1.properties.level - node2.properties.level;
        parent1 = getParentNode(node1, difference);
        parent2 = getParentNode(node2, -difference);
        return LCA(parent1, parent2);
    }
}

function getParentNode(node, times) {
    var times = times || 1;
    for (var i = 0; i < times; i++) {
        node = node.properties.parent;
    }
    return node;
}


function getNodeByKey(node, key) {
    var foundNode = null;
    for (var childKey in node) {
        if (childKey == "properties" || childKey == "key") {
            continue;
        }
        var childNode = node[childKey];
        if (childKey == key) {
            return childNode;
        }
        else {
            foundNode = getNodeByKey(childNode, key);
            if (foundNode != null) {
                return foundNode;
            }
        }
    }
    return null;
}
function testGetNodeByKey() {
    var node = getNodeByKey(mapdata, "产品功能");
    console.log(node);
}

function testLCA() {
    preLCA(mapdata);
    var node1 = getNodeByKey(mapdata, "产品测试10");
    var node2 = getNodeByKey(mapdata, "产品测试4");
    var result = LCA(node2, node1);
    console.log(result);

}