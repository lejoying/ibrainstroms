var offsets = {
    "level0": {
        font: "bold 24px XX",
        fontSize: 22,
        text_dwidth: 118,

        text_dx: -50,
        text_dy: 10,

        lineWidth: 4.5,
        next_offset_level: "level1",
        height: 118,

        box_width: 206,
        box_height: 118 * 1.5,
        box_x: 0,
        box_y: 0,

        box_parent_x: 0,
        box_parent_y: 0
    },
    "level1": {
        font: "bold 22px XX",
        fontSize: 22,
        text_dwidth: 50,

        text_dx: -40,
        text_dy: 9,

        lineWidth: 2.5,
        next_offset_level: "levelN",
        height: 35,

        box_width: 150,
        box_height: 35 * 1.5,
        box_x: 250,
        box_y: 0,

        box_parent_x: 0,
        box_parent_y: 0
    },
    "levelN": {
        font: "bold 19px XX",
        fontSize: 19,
        text_dwidth: 50,

        text_dx: -36,
        text_dy: 7,

        lineWidth: 2.5,
        next_offset_level: "levelN",
        height: 35,

        box_width: 150,
        box_height: 35 * 1.5,
        box_x: 200,
        box_y: 0,

        box_parent_x: 0,
        box_parent_y: 0
    },
    caculateTextWidth: function (key, fontSize, text_dwidth) {
        var width = key.length * fontSize + text_dwidth;
        return width;
    },
    caculatePositionAndSize: function (key, fontSize, text_dwidth) {
        var width = key.length * fontSize + text_dwidth;
        return width;
    }


};

function renderMap() {
    //    renderNode(mapdata, "level0");
    boxModelNode(mapdata, "level0", 426, 269);
}


var b2Vec2 = Box2D.Common.Math.b2Vec2
    , b2AABB = Box2D.Collision.b2AABB
    , b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2Fixture = Box2D.Dynamics.b2Fixture
    , b2World = Box2D.Dynamics.b2World
    , b2MassData = Box2D.Collision.Shapes.b2MassData
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    , b2ContactListener = Box2D.Dynamics.b2ContactListener
    , b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
var fixDef = new b2FixtureDef;
fixDef.density = 0;
fixDef.friction = 0.5;
fixDef.restitution = 0.8;
var bodyDef = new b2BodyDef;
bodyDef.type = b2Body.b2_dynamicBody;
bodyDef.linearDamping = 20;
bodyDef.angularDamping = Number.POSITIVE_INFINITY;

function boxModelNode(node, offset_level, box_parent_x, box_parent_y) {

    var offset = offsets[offset_level];
    for (var key in node) {
        var childNode = node[key];
        if (key != "properties") {
            buildBoxModel(key, childNode.properties, offset, box_parent_x, box_parent_y);
            boxModelNode(childNode, offset.next_offset_level, childNode.properties.box_x, childNode.properties.box_y);
        }
    }
}

function buildBoxModel(key, properties, offset, box_parent_x, box_parent_y) {
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(offset.box_width / 60, offset.box_height / 60);
    properties.box_x = offset.box_x + box_parent_x;
    properties.box_y = offset.box_y + box_parent_y;
    bodyDef.position.x = (offset.box_x + box_parent_x) / 30;
    bodyDef.position.y = (offset.box_y + box_parent_y) / 30;
    fixDef.isSensor = false;
    var body = world.CreateBody(bodyDef);
    properties.body = body;
    var fixture = body.CreateFixture(fixDef);
    properties.fixture = fixture;
}


function caculatePositionAndSize(node, offset_level) {
    var properties = node.properties;
    var childrenCount = 0;
    for (var key in node) {
        if (key != "properties") {
            childrenCount++;
        }
    }
    properties.childrenCount = childrenCount;
}

function caculatedrawNode(key, properties, offset) {

    context.font = offset.font;
    var width = offsets.caculateTextWidth(key, offset.fontSize, offset.text_dwidth);
    context.roundRect(properties.position.x, properties.position.y, width, offset.height, 13, false);
    context.fillText(key, properties.position.x + offset.text_dx, properties.position.y + offset.text_dy);
}

function renderNode1(node, offset_level) {
    var offset = offsets[offset_level];
    for (var key in node) {
        var childNode = node[key];
        if (key != "properties") {
            drawNode1(key, childNode.properties, offset);
            renderNode1(childNode, offset.next_offset_level);
        }
    }
}

function drawNode1(key, properties, offset) {

    if (properties.color) {
        context.strokeStyle = properties.color;
    }
    var position = properties.body.GetPosition();

    context.lineWidth = offset.lineWidth;
    context.font = offset.font;
    var width = offsets.caculateTextWidth(key, offset.fontSize, offset.text_dwidth);
    context.roundRect(position.x * 30, position.y * 30, width, offset.height, 13, false);
    context.fillText(key, position.x * 30 + offset.text_dx, position.y * 30 + offset.text_dy);
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

    if (properties.color) {
        context.strokeStyle = properties.color;
    }


    context.lineWidth = offset.lineWidth;
    context.font = offset.font;
    var width = offsets.caculateTextWidth(key, offset.fontSize, offset.text_dwidth);
    context.roundRect(properties.position.x, properties.position.y, width, offset.height, 13, false);
    context.fillText(key, properties.position.x + offset.text_dx, properties.position.y + offset.text_dy);
}
