﻿var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var image = new Image();
image.src = "/static/images/map.jpg";

function initialize() {
    initialize_box_2d();
    resizeWindow();
}


window.onload = initialize;
//window.onresize = resizeWindow;
function resizeWindow() {
    var h = window.innerHeight - 52 - 3;
    var w = window.innerWidth - 0 - 2;
    var canvas = document.getElementById("myCanvas");
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    context.fillStyle = "#484848";
    context.strokeStyle = "#0099cd";
    var b2Settings = Box2D.Common.b2Settings;
    b2Settings.b2_linearSlop = -0.005;
    initializeMap();
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
        , b2Settings = Box2D.Common.b2Settings
        , b2Transform = Box2D.Common.Math.b2Transform
        , b2Mat22 = Box2D.Common.Math.b2Mat22
        , b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

    world = new b2World(new b2Vec2(0, 0)    //gravity
        , true                 //allow sleep
    );
    app.world = world;

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
        b2Settings.b2_linearSlop = 0.05;
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
                var position = body.GetPosition();
                md.target.Set(position.x, position.y);
                md.collideConnected = true;
                md.maxForce = 30000.0 * body.GetMass();
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
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, w, h);

        world.Step(1 / 60, 10, 10);
        //        context.globalAlpha = 1;
        //        world.DrawDebugData();
        //        context.setTransform();
//        context.setTransform(1, 0, 0, 1, -e_scale, -f_scale);
        //        context.transform(a, 0, 0, a, 0, 0);
        //        context.transform(1, 0, 0, 1, a * e_scale, a * f_scale);

        context.translate(e_scale,f_scale);
        context.scale(a,a);
        context.translate(-e_scale,-f_scale);

        resolveConflict();
        renderNode(mapdata, null, "level0", rootOutset);

        //        context.globalAlpha = 0.2;
        //        context.drawImage(image,  100, 80, 800, 506);
        world.ClearForces();
    };

    //helpers

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

    var a = 1, b = 0, c = 0, d = 1, e = 0, f = 0;
    var e_scale = 0, f_scale = 0;
    var scaleMatrix = [a, 0, 0, d, 0, 0];
    var translateMatrix = [1, 0, 0, 1, e, f];
    $('.myCanvas').mousewheel(function (event) {

        a = a*(1+event.deltaY * 0.045);
        e_scale = (event.clientX - canvasPosition.x);
        f_scale = (event.clientY - canvasPosition.y);2
        console.log(event.deltaX, event.deltaY, event.deltaFactor, e_scale, f_scale);
    });

};

