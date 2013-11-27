var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var image = new Image();
image.src = "/static/images/map.jpg";


window.onload = resizeWindow;
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