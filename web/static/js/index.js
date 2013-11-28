var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var image = new Image();
image.src = "/static/images/map.jpg";

function initialize() {
    initialize_box_2d();
    resizeWindow();
}
window.onload = initialize;
window.onresize = resizeWindow;
function resizeWindow() {
    var h = window.innerHeight - 52 - 3;
    var w = window.innerWidth - 0 - 2;
    var canvas = document.getElementById("myCanvas");
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    context.fillStyle = "#484848";

    //        context.drawImage(image, 300, 80, 800, 506);

    context.strokeStyle = "#0099cd";
    //    context.lineWidth = 2.5;
    //    context.roundRect(825, 380, 205, 35, 13, false);
    //    context.font = "bold 19px XX";
    //    context.fillText("让想象力自由飞翔", 847, 404);


    //    context.lineWidth =4.5;
    //    context.roundRect(322, 210, 205, 118, 13, false);
    //    context.font = "bold 24px XX";
    //    context.fillText("奇思妙想", 375, 278);
    renderMap();
}
var world;
function initialize_box_2d() {
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

    world = new b2World(new b2Vec2(0, 0)    //gravity
        , true                 //allow sleep
    );


    //Listener

    var contactListener = new b2ContactListener();
    contactListener.BeginContact = beginContact;
    contactListener.EndContact = endContact;
    contactListener.PreSolve = preSolve;
    contactListener.PostSolve = postSolve;
    world.SetContactListener(contactListener);

    var contactCounting=0;
    function beginContact(contact) {
        contactCounting++;
        console.log("beginContact",contactCounting);
    };
    function endContact(contact) {
        contactCounting++;
        console.log("endContact",contactCounting);
    };
    function preSolve(contact) {
//        contactCounting++;
//        console.log("preSolve",contactCounting);
    };
    function postSolve(contact) {
//        contactCounting++;
//        console.log("postSolve",contactCounting);
    };

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.0;
    var bodyDef = new b2BodyDef;

    //create ground
    bodyDef.type = b2Body.b2_staticBody;


    bodyDef.linearDamping = 5;

    bodyDef.angularDamping = 20;

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(2000 / 30, 2);
    bodyDef.position.Set(10, 600 / 30 + 1.8);//bottom
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(10, -1.8);//top
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    fixDef.shape.SetAsBox(2, 600 / 30);
    bodyDef.position.Set(-1.8, 13);//left
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(1500 / 30, 13);//right
    world.CreateBody(bodyDef).CreateFixture(fixDef);

//
//    //create some objects
//    bodyDef.type = b2Body.b2_dynamicBody;
//    for (var i = 0; i < 10; ++i) {
//        if (Math.random() > 0.5) {
//            fixDef.shape = new b2PolygonShape;
//            fixDef.shape.SetAsBox(Math.random() + 0.1 //half width
//                , Math.random() + 0.1 //half height
//            );
//            fixDef.isSensor = false;
//        }
//        else {
//            fixDef.shape = new b2CircleShape(Math.random() + 0.1//radius
//            );
//            fixDef.isSensor = false;
//        }
//        bodyDef.position.x = Math.random() * 10;
//        bodyDef.position.y = Math.random() * 10;
//        world.CreateBody(bodyDef).CreateFixture(fixDef);
//    }
//
//    fixDef.shape = new b2PolygonShape;
//    fixDef.shape.SetAsBox(10, 10);
//    fixDef.isSensor = true;
//    world.CreateBody(bodyDef).CreateFixture(fixDef);

    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("myCanvas").getContext("2d"));
    debugDraw.SetDrawScale(30.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

    window.setInterval(update, 1000 / 60);

    //mouse

    var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
    var canvasPosition = getElementPosition(document.getElementById("myCanvas"));

    document.addEventListener("mousedown", function (e) {
        isMouseDown = true;
        handleMouseMove(e);
        document.addEventListener("mousemove", handleMouseMove, true);
    }, true);

    document.addEventListener("mouseup", function () {
        document.removeEventListener("mousemove", handleMouseMove, true);
        isMouseDown = false;
        mouseX = undefined;
        mouseY = undefined;
    }, true);

    function handleMouseMove(e) {
        mouseX = (e.clientX - canvasPosition.x) / 30;
        mouseY = (e.clientY - canvasPosition.y) / 30;
    };

    function getBodyAtMouse() {
        mousePVec = new b2Vec2(mouseX, mouseY);
        var aabb = new b2AABB();
        aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
        aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

        // Query the world for overlapping shapes.

        selectedBody = null;
        world.QueryAABB(getBodyCB, aabb);
        return selectedBody;
    }

    function getBodyCB(fixture) {
        if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
            if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
                selectedBody = fixture.GetBody();
                return false;
            }
        }
        return true;
    }

    //update

    function update() {

        if (isMouseDown && (!mouseJoint)) {
            var body = getBodyAtMouse();
            if (body) {
                var md = new b2MouseJointDef();
                md.bodyA = world.GetGroundBody();
                md.bodyB = body;
                md.target.Set(mouseX, mouseY);
                md.collideConnected = true;
                md.maxForce = 300.0 * body.GetMass();
                mouseJoint = world.CreateJoint(md);
                body.SetAwake(true);
            }
        }

        if (mouseJoint) {
            if (isMouseDown) {
                mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
            }
            else {
                world.DestroyJoint(mouseJoint);
                mouseJoint = null;
            }
        }
        var h = window.innerHeight - 52 - 3;
        var w = window.innerWidth - 0 - 2;
        context.clearRect(0, 0, w, h);

        world.Step(1 / 60, 10, 10);
        context.globalAlpha = 1;
        renderNode1(mapdata, "level0");
//        world.DrawDebugData();
        context.globalAlpha = 0.2;
//        context.drawImage(image, 300, 80, 800, 506);
        world.ClearForces();
    };

    //helpers

    //http://js-tut.aardon.de/js-tut/tutorial/position.html
    function getElementPosition(element) {
        var elem = element, tagname = "", x = 0, y = 0;

        while ((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
            y += elem.offsetTop;
            x += elem.offsetLeft;
            tagname = elem.tagName.toUpperCase();

            if (tagname == "BODY")
                elem = 0;

            if (typeof(elem) == "object") {
                if (typeof(elem.offsetParent) == "object")
                    elem = elem.offsetParent;
            }
        }

        return {x: x, y: y};
    }


};