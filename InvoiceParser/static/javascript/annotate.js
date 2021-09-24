const canvas2 = document.getElementById("canvas");
const context2 = canvas.getContext("2d");

const annotation = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    printCoordinates: function() {
        console.log(`X: ${this.x}px, Y: ${this.y}px, Width: ${this.w}px, Height: ${this.h}px`);
    }
};

//the array of all rectangles
let boundingBoxes = [];
let boundingButton = [];
// the actual rectangle, the one that is being drawn
let o = {};
let oButton = {};

// a variable to store the mouse position
let m = {},
    // a variable to store the point where you begin to draw the rectangle    
    start = {};
// a boolean 
let isDrawing = false;
let boundingDelete = false;
let drawed = false;
let boundingId = 0;

function handleMouseDown(e) {
    start = oMousePos(canvas2, e);
    for (var i = 0; i < boundingButton.length; i++) {
        if (start.x >= boundingButton[i]["x"] && start.x <= boundingButton[i]["x"] + 20 && start.y >= boundingButton[i]["y"] && start.y <= boundingButton[i]["y"] + 20) {
            isDrawing = false;
            boundingDelete = true;
            boundingId = i;
            return;
        }
    }
    isDrawing = true;
    //console.log(start.x, start.y);
    canvas2.style.cursor = "crosshair";
}

function handleMouseMove(e) {
    if (isDrawing) {
        m = oMousePos(canvas2, e);
        draw();
    }
}

function handleMouseUp(e) {
    canvas2.style.cursor = "default";
    isDrawing = false;
    var modal = document.getElementById("exampleModal");
    if (boundingDelete) {
        boundingBoxes.splice(boundingId, 1);
        boundingButton.splice(boundingId, 1);
        //console.log(boundingButton);
        boundingDelete = false;
        // draw();
        showdelete();
        // draw the actual rectangle
        // drawRect(o);
        // drawRectButton(oButton);
    } else {
        if (o.w > 15) {
            if (drawed) {
                const box = Object.create(annotation);
                const button = Object.create(annotation);
                if (o.w < 0) {
                    box.id = boundingButton.length
                    box.x = o.x;
                    box.y = o.y;
                    box.w = o.w;
                    box.h = Math.abs(o.h);
                    button.id = boundingButton.length
                    button.x = oButton.x;
                    button.y = oButton.y;
                    button.w = oButton.w;
                    button.h = oButton.h;
                } else {
                    box.id = boundingButton.length
                    box.x = o.x;
                    box.y = o.y;
                    box.w = o.w;
                    box.h = Math.abs(o.h);
                    button.id = boundingButton.length
                    button.x = oButton.x;
                    button.y = oButton.y;
                    button.w = oButton.w;
                    button.h = oButton.h;
                }
                boundingBoxes.push(box);
                boundingButton.push(button);

                box.printCoordinates();
                button.printCoordinates();
                //console.log(boundingBoxes);
                //console.log(boundingButton);
                drawed = false;
                modal.style.display = "block";
                $("#exampleModal").modal()
            }
        } else {
            showdelete();
            return;
        }
    }
    // alert("I am an alert box!");

    //draw();
    // boundingBoxes.splice(0, 1);
}

function draw() {
    if ((m.x - start.x) < 0) {
        o.id = boundingButton.length;
        o.x = start.x - o.w; // start position of x
        o.y = start.y; // start position of y
        o.w = Math.abs(m.x - start.x); // width
        o.h = Math.abs(m.y - start.y); // height
        oButton.id = boundingButton.length;
        oButton.x = start.x; // start position of x
        oButton.y = start.y; // start position of y
        oButton.w = 20; // width
        oButton.h = 20; // height
    } else {
        o.id = boundingButton.length;
        o.x = start.x; // start position of x
        o.y = start.y; // start position of y
        o.w = m.x - start.x; // width
        o.h = Math.abs(m.y - start.y); // height
        oButton.id = boundingButton.length;
        oButton.x = start.x + o.w; // start position of x
        oButton.y = start.y; // start position of y
        oButton.w = 20; // width
        oButton.h = 20; // height
    }

    //clearcanvas();
    context2.clearRect(0, 0, canvas2.width, canvas2.height); //////***********
    // draw all the rectangles saved in the rectsRy
    boundingBoxes.map(r => { drawRect(r) })
    boundingButton.map(rButton => { drawRectButton(rButton) })
        // draw the actual rectangle
    drawRect(o);
    drawRectButton(oButton);
    drawed = true;
}

function showdelete() {
    if ((m.x - start.x) < 0) {
        o.id = boundingButton.length
        o.x = start.x; // start position of x
        o.y = start.y; // start position of y
        o.w = Math.abs(m.x - start.x); // width
        o.h = Math.abs(m.y - start.y); // height
    } else {
        o.id = boundingButton.length
        o.x = start.x; // start position of x
        o.y = start.y; // start position of y
        o.w = m.x - start.x; // width
        o.h = Math.abs(m.y - start.y); // height
    }
    oButton.id = boundingButton.length
    oButton.x = start.x + o.w; // start position of x
    oButton.y = start.y; // start position of y
    oButton.w = 20; // width
    oButton.h = 20; // height
    //clearcanvas();
    context2.clearRect(0, 0, canvas2.width, canvas2.height); //////***********
    // draw all the rectangles saved in the rectsRy
    boundingBoxes.map(r => { drawRect(r) })
    boundingButton.map(rButton => { drawRectButton(rButton) })
        // draw the actual rectangle
        // drawRect(o);
        // drawRectButton(oButton);
}

canvas2.addEventListener("mousedown", handleMouseDown);
canvas2.addEventListener("mousemove", handleMouseMove);
canvas2.addEventListener("mouseup", handleMouseUp);

function savecanvas() {
    var savedBoxes = boundingBoxes.slice(0);
    console.log(savedBoxes); // ok
}

function resetcanvas() {
    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    boundingBoxes.length = 0;
    boundingButton.length = 0;
    //console.log(boundingBoxes); // ok
}

function drawRect(o) {
    context2.strokeStyle = "limegreen";
    context2.lineWidth = 2;
    context2.beginPath(o);
    context2.rect(o.x, o.y, o.w, o.h);
    context2.stroke();
    context2.fillStyle = "limegreen";
    // var width = context2.measureText('Big Cow').width;
    // context2.fillRect(o.x, o.y - 10, width, 10);
    // context2.fillStyle = "red";
    // context2.fillText("Big Cow", o.x, o.y);
}

function drawRectButton(oButton) {
    context2.fillStyle = "red"
    var side = 20
    context2.fillRect(oButton.x, oButton.y, side, side);
    var shift = side / 10;
    context2.beginPath(oButton);
    context2.moveTo(oButton.x + shift, oButton.y + shift);
    context2.lineTo(oButton.x + side - shift, oButton.y + side - shift);
    context2.moveTo(oButton.x + side - shift, oButton.y + shift);
    context2.lineTo(oButton.x + shift, oButton.y + side - shift);
    context2.strokeStyle = '#FFFFFF';
    context2.stroke();
}

// Function to detect the mouse position

function oMousePos(canvas2, evt) {
    let ClientRect = canvas2.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - ClientRect.left),
        y: Math.round(evt.clientY - ClientRect.top)
    }
}