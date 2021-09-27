const canvas2 = document.getElementById("canvas");
const context2 = canvas.getContext("2d");
// const label=document.getElementById('exampleFormControlInput1')




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
    // var label=document.getElementById('exampleFormControlInput1')
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
                    box.label="";
                    button.id = boundingButton.length
                    button.x = oButton.x;
                    button.y = oButton.y;
                    button.w = oButton.w;
                    button.h = oButton.h;
                    button.label="";
                } else {
                    box.id = boundingButton.length
                    box.x = o.x;
                    box.y = o.y;
                    box.w = o.w;
                    box.h = Math.abs(o.h);
                    box.label="";
                    button.id = boundingButton.length
                    button.x = oButton.x;
                    button.y = oButton.y;
                    button.w = oButton.w;
                    button.h = oButton.h;
                    button.label="";
                }
                boundingBoxes.push(box);
                boundingButton.push(button);

                box.printCoordinates();
                button.printCoordinates();
                //console.log(boundingBoxes);
                //console.log(boundingButton);
                drawed = false;
                modal.style.display = "block";
                $("#exampleModal").modal();

            }
        } else {
            showdelete();
            return;
        }
    }
    // alert("I am an alert box!");

    //draw();
    // boundingBoxes.splice(0, 1);
    console.log('Annotation  Saved');
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


$('#save_label_btn').on('click',function(e){
    
    var label=$('#exampleFormControlInput1');
    var index=(boundingBoxes.length)-1;
    boundingBoxes[index]['label']=label.val();
    boundingButton[index]['label']=label.val();
    label.val("");
    $('#close_label_btn').click();
    
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const image_canvas=document.getElementById('canvas2')


function redirect_to_main()
{
    window.location.replace("/");
}

$('#ExportAnnotations_id').on('click',function(e){
    e.preventDefault();
    if(boundingBoxes.length==0)
    {
        alert('Kindly Annotate First');
        return;
    }
    var coordinates=JSON.stringify(boundingBoxes);
    var img64=image_canvas.toDataURL();
    var url=$('#fileUpload').attr('data-url');
    const csrftoken = getCookie('csrftoken');
    
    $.ajax({
        type:'POST',
        data:{
            json_coord:coordinates,
            img64:img64
        },
        url:url,
        headers: { "X-CSRFToken":csrftoken },
        success:function(response)
        {
            // $('#success_message').html('Congrats! '+response.Model_id+' Model was Created.. You will be redirected Shortly.')
            // $('#success_message').css('display','block');
            redirect_to_main();
            // window.setTimeout(redirect_to_main,3000);
        },
        error: function (response)
        {
            alert(response);
        }
    });

});


