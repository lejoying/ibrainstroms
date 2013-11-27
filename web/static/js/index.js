var h = window.innerHeight - 52 - 3;
var w = window.innerWidth - 0 - 2;
var c = document.getElementById("myCanvas");
c.setAttribute('width', w);
c.setAttribute('height', h);


var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF0000";
ctx.fillRect(0, 0, 150, 75);

var test1 = document.getElementById("test1");
c.oninput = cancasInput;
function cancasInput() {
    console.log("input");
}

c.onclick = cancasClick;
function cancasClick() {
    console.log("onclick");
}

var image = new Image();
image.src = "/static/images/map.jpg";


window.onload = resizeWindow;
window.onresize = resizeWindow;
function resizeWindow() {
    //console.log(window.innerHeight,window.innerWidth);
    var h = window.innerHeight - 52 - 3;
    var w = window.innerWidth - 0 - 2;
    var c = document.getElementById("myCanvas");
    c.setAttribute('width', w);
    c.setAttribute('height', h);
    ctx.fillStyle = "#FF0000";

    ctx.drawImage(image, 300, 80, 800, 506);


}