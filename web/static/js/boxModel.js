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
fixDef.isSensor = true;
var bodyDef = new b2BodyDef;
bodyDef.type = b2Body.b2_dynamicBody;
bodyDef.linearDamping = 20;
bodyDef.angularDamping = Number.POSITIVE_INFINITY;


function buildBoxModel(node, offset_level, outset) {
    var offset = offsets[offset_level];

    for (var key in node) {
        var childNode = node[key];
        if (key == "properties" || key == "key") {
            continue;
        }
        var childOutset = buildBoxModelNode(childNode, offset, outset);
        buildBoxModel(childNode, offset.next_offset_level, childOutset);
    }
}

function buildBoxModelNode(node, offset, outset) {
    var properties = node.properties;
    var position = properties.position;

    bodyDef.position.x = (outset.x + position.x + (properties.textWidth + offset.text_dwidth) / 2) / 30;
    bodyDef.position.y = (outset.y + position.y) / 30;
    var body = world.CreateBody(bodyDef);
    properties.body = body;
    body.userData = {
        key: node.key,
        node: node
    };

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox((properties.textWidth + offset.text_dwidth - 36 ) / 60, (offset.box_height - 2) / 60);
    body.CreateFixture(fixDef);
    fixDef.shape.SetAsBox((properties.textWidth + offset.text_dwidth ) / 60, (offset.box_height - 36) / 60);
    body.CreateFixture(fixDef);

    fixDef.shape = new b2CircleShape(36 / 60);
    var vertex_R_B = new b2Vec2((properties.textWidth + offset.text_dwidth - 36) / 60, (offset.box_height - 36 - 2) / 60);
    var vertex_L_B = new b2Vec2(-(properties.textWidth + offset.text_dwidth - 36) / 60, (offset.box_height - 36 - 2) / 60);
    var vertex_R_T = new b2Vec2((properties.textWidth + offset.text_dwidth - 36) / 60, -(offset.box_height - 36 - 2) / 60);
    var vertex_L_T = new b2Vec2(-(properties.textWidth + offset.text_dwidth - 36) / 60, -(offset.box_height - 36 - 2) / 60);
    fixDef.shape.SetLocalPosition(vertex_R_B);
    body.CreateFixture(fixDef);
    fixDef.shape.SetLocalPosition(vertex_L_B);
    body.CreateFixture(fixDef);
    fixDef.shape.SetLocalPosition(vertex_R_T);
    body.CreateFixture(fixDef);
    fixDef.shape.SetLocalPosition(vertex_L_T);
    body.CreateFixture(fixDef);

    var childOutset = {x: outset.x + position.x, y: outset.y + position.y};
    return childOutset;
}

//Listener
function initializeBox2DModel() {
    var contactListener = new b2ContactListener();
    contactListener.BeginContact = beginContact;
    contactListener.EndContact = endContact;
    contactListener.PreSolve = preSolve;
    contactListener.PostSolve = postSolve;
    app.world.SetContactListener(contactListener);

    app.contactCounting = 0;
    app.contactList = {};

    function beginContact(contact) {

        var box_node1 = contact.m_nodeA.other;
        var node1 = box_node1.userData.node;
        uniqueID1 = node1.properties.uniqueID;
        var box_node2 = contact.m_nodeB.other;
        var node2 = box_node2.userData.node;
        uniqueID2 = node2.properties.uniqueID;

        var contactKey;
        if (uniqueID1 > uniqueID2) {
            contactKey = uniqueID1 + "+" + uniqueID2;
        }
        else {
            contactKey = uniqueID2 + "+" + uniqueID1;
        }
        if (app.contactList[contactKey] == null) {
            var result = LCA(node1, node2);
            app.contactList[contactKey] = {
                contactTimes: 1,
                node1: node1,
                node2: node2,
                brother1: result.brother1,
                brother2: result.brother2
            };
            app.contactCounting++;
        }
        else {
            app.contactList[contactKey].contactTimes++;
        }
    };
    function endContact(contact) {

        var box_node1 = contact.m_nodeA.other;
        var node1 = box_node1.userData.node;
        uniqueID1 = node1.properties.uniqueID;
        var box_node2 = contact.m_nodeB.other;
        var node2 = box_node2.userData.node;
        uniqueID2 = node2.properties.uniqueID;

        var contactKey;
        if (uniqueID1 > uniqueID2) {
            contactKey = uniqueID1 + "+" + uniqueID2;
        }
        else {
            contactKey = uniqueID2 + "+" + uniqueID1;
        }
        if (app.contactList[contactKey] != null) {
            app.contactList[contactKey].contactTimes--;
            if (app.contactList[contactKey].contactTimes < 1) {
                delete app.contactList[contactKey];
                app.contactCounting--;
            }
        }
        else {
            console.log("contactCounting error!")
        }
    }


    function preSolve(contact) {
    };
    function postSolve(contact) {
    };
}

var step = 4;

function resolveConflict() {
    var contact;
    for (var contactKey in app.contactList) {
        contact = app.contactList[contactKey];
        seperateBrothers(contact.brother1, contact.brother2);
    }
}

function seperateBrothers(brother1, brother2) {
    if (brother1.properties.position.y > brother2.properties.position.y) {
        brother1.properties.position.y += step;
        brother2.properties.position.y -= step;
    }
    else {
        brother1.properties.position.y -= step;
        brother2.properties.position.y += step;
    }
    brother1.properties.resolving = true;
    brother2.properties.resolving = true;
}
