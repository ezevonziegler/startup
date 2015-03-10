var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.beginPath();
ctx.arc(95,50,40,0,2*Math.PI);
ctx.strokeStyle="blue";
ctx.stroke();

var ctx1 = c.getContext('2d');
ctx1.beginPath();
ctx1.moveTo(200,75);
ctx1.lineTo(225,50);
ctx1.lineTo(250,75);
ctx1.fillStyle = "#FF0000";
ctx1.fill();

var ctx2 = c.getContext('2d');
ctx2.fillStyle = "#FFFF00";
ctx2.fillRect(300,25,100,100);

var ctx3 = c.getContext('2d');
ctx3.fillStyle = "#FF00FF";

var requestID;

// Variables to for the drawing position and object.
var posX = 50;
var boxWidth = 200;
var pixelsPerFrame = 5; 


ctx3.fillRect(posX, 150, boxWidth, 100);

function animate() {
  requestID = requestAnimationFrame(animate);

  // If the box has not reached the end draw on the canvas.
  // Otherwise stop the animation.
  if (posX <= (c.width - boxWidth)) {
    ctx.clearRect((posX - pixelsPerFrame), 150, boxWidth, 100);
    ctx.fillRect(posX, 150, boxWidth, 100);
    posX += pixelsPerFrame;
  } else {
    cancelAnimationFrame(requestID);
  }
}

requestID = requestAnimationFrame(animate);