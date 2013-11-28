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

        box_dwidth: 118 + 60,
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

        box_dwidth: 50 + 20,
        box_height: 35 * 1.36,
        box_x: 280,
        box_y: 0,

        box_parent_x: 0,
        box_parent_y: 0
    },
    "levelN": {
        font: "bold 19px Arial",
        fontSize: 19,
        text_dwidth: 50,

        text_dx: -36,
        text_dy: 7,

        lineWidth: 2.5,
        next_offset_level: "levelN",
        height: 35,

        box_dwidth: 50 + 20,
        box_height: 35 * 1.36,
        box_x: 250,
        box_y: 0,

        box_parent_x: 0,
        box_parent_y: 0
    }
};

function renderMap() {
    //    renderNode(mapdata, "level0");
    boxModelNode(mapdata, "level0", 226, 269);
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
fixDef.friction = 0.2;
fixDef.restitution = 0.8;
var bodyDef = new b2BodyDef;
bodyDef.type = b2Body.b2_dynamicBody;
bodyDef.linearDamping = 20;
bodyDef.angularDamping = Number.POSITIVE_INFINITY;

function boxModelNode(node, offset_level, box_parent_x, box_parent_y) {

    var offset = offsets[offset_level];
    var keys = [];
    for (var key in node) {
        if (key != "properties") {
            keys.push(key);
        }
    }
    keys = keys.reverse();
    for (var id in keys) {
        var key = keys[id];
        var childNode = node[key];
        if (childNode) {
            if (childNode.properties == null) {
                childNode.properties = {};
            }
            buildBoxModel(key, childNode.properties, offset, box_parent_x, box_parent_y);
            boxModelNode(childNode, offset.next_offset_level, childNode.properties.box_x, childNode.properties.box_y);
        }
    }
}

function buildBoxModel(key, properties, offset, box_parent_x, box_parent_y) {


    properties.box_x = offset.box_x + box_parent_x;
    properties.box_y = offset.box_y + box_parent_y;
    bodyDef.position.x = (offset.box_x + box_parent_x) / 30;
    bodyDef.position.y = (offset.box_y + box_parent_y) / 30;
    fixDef.isSensor = false;
    var body = world.CreateBody(bodyDef);
    properties.body = body;

    fixDef.shape = new b2PolygonShape;
    context.font = offset.font;
    var metrics = context.measureText(key);
    fixDef.shape.SetAsBox((metrics.width + offset.box_dwidth - 36 ) / 60, offset.box_height / 60);
    body.CreateFixture(fixDef);
    body.userData=key;
    //    fixDef.shape.SetAsBox((metrics.width + offset.box_dwidth ) / 60, (offset.box_height - 36) / 60);
    //    body.CreateFixture(fixDef);

    //    fixDef.shape = new b2CircleShape(offset.box_height / 60);


    //    var vertex_R_B = new b2Vec2((metrics.width + offset.box_dwidth - 36) / 60, (offset.box_height - 36) / 60);
    //    var vertex_L_B = new b2Vec2(-(metrics.width + offset.box_dwidth - 36) / 60, (offset.box_height - 36) / 60);
    //    var vertex_R_T = new b2Vec2((metrics.width + offset.box_dwidth - 36) / 60, -(offset.box_height - 36) / 60);
    //    var vertex_L_T = new b2Vec2(-(metrics.width + offset.box_dwidth - 36) / 60, -(offset.box_height - 36) / 60);
    //    fixDef.shape.SetLocalPosition(vertex_R_B);
    //    body.CreateFixture(fixDef);
    //    fixDef.shape.SetLocalPosition(vertex_L_B);
    //    body.CreateFixture(fixDef);
    //    fixDef.shape.SetLocalPosition(vertex_R_T);
    //    body.CreateFixture(fixDef);
    //    fixDef.shape.SetLocalPosition(vertex_L_T);
    //    body.CreateFixture(fixDef);
}


function renderNode(node, offset_level) {
    var offset = offsets[offset_level];
    for (var key in node) {
        var childNode = node[key];
        if (key != "properties") {
            context.save();
            if (childNode.properties.color) {
                context.strokeStyle = childNode.properties.color;
            }
            drawNode(key, childNode.properties, offset);
            renderNode(childNode, offset.next_offset_level);
            context.restore();
        }
    }
}

function drawNode(key, properties, offset) {

    if (properties.color) {
        context.strokeStyle = properties.color;
    }
    var position = properties.body.GetPosition();

    context.lineWidth = offset.lineWidth;
    context.font = offset.font;
    var metrics = context.measureText(key);
    var width = metrics.width;
    context.roundRect(position.x * 30, position.y * 30, width + offset.text_dwidth, offset.height, 13, false);
    context.fillText(key, position.x * 30 - width / 2, position.y * 30 + offset.text_dy);
}

