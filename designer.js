//simple values for testing, making canvas invisible, saving invisible
document.getElementById('inputX').value = 20;
document.getElementById('inputY').value = 20;
document.getElementById('div0').style.display = 'none';
document.getElementById('div3').style.display = 'none';

var yOffset = 80; //the amount of pixels between the canvas and the top
var maxX = 0;
var maxY = 0;
var mouseIsDown = false;
var usedButton = 0;
var toOutput = 1;
var output = [];
var currentBrush = 'yellow';
var fillStatus = 0;
var ctx = document.getElementById('canvas').getContext('2d');

//creates each block; this allows them to each have their own event listener
class Block {
  constructor(name) {
    this.name = name;
  }
  addListener() {
    document.getElementById(this.name).addEventListener("click", function() {
      var classes = [];
      //grab the two classes, and split them into an array, with the first item being the colour
      classes = this.className.split(" ");
      //set it as the brush!
      currentBrush = classes[0];
    })
  }
}

//the blocks
var one, two, three, four, five, six, seven, eight, nine, ten;
var blocks = [one, two, three, four, five, six, seven, eight, nine, ten];
var names = ['spawn', 'win', 'overworld_material_dirt', 'overworld_material_grass', 'overworld_background', 'overworld_background_hanging_grass', 'overworld_background_hanging_grass_180', 'overworld_material_dirt_corner', 'overworld_material_dirt_corner_180', 'overworld_water'];
var colours = ['yellow', 'black', 'purple', 'green', 'pink', 'red', 'orange', 'cyan', 'blue', 'navy'];

//creates the blocks
function createBlocks() {
  //for each block, with the quantity indicated by "blocks"
  for (var i = 0; i < blocks.length; i++) {
    //create a new canvas, and peg it to div2
    var newButton = document.createElement('canvas');
    var find = document.getElementById('div01');
    find.appendChild(newButton);

    //give the canvas an id
    var id = document.createAttribute('id');
    id.value = names[i];
    newButton.setAttributeNode(id);

    //give the canvas two classes: one which shows its colour and one that indicates it is a block
    var classs = document.createAttribute('class');
    classs.value = colours[i] + ' block';
    newButton.setAttributeNode(classs);

    var title = document.createAttribute('title');
    title.value = names[i];
    newButton.setAttributeNode(title);

    //fill the canvas
    var ctxOfBlock = document.getElementById(names[i]).getContext('2d');
    ctxOfBlock.fillStyle = colours[i];
    ctxOfBlock.fillRect(0, 0, 300, 200);

    //instance a new block, give it a listener (see above)
    blocks[i] = new Block(names[i]);
    blocks[i].addListener();
  }
}

//create immediately
createBlocks();

function createCanvas() {
  if (document.getElementById('loadString').value == "") {
    maxX = document.getElementById('inputX').value;
    maxY = document.getElementById('inputY').value;
    document.getElementById('canvas').width = maxX * 20;
    document.getElementById('canvas').height = maxY * 20;
    ctx.strokeStyle = 'gainsboro';
    output.push(maxX);
    output.push(maxY);
    for (var i = 0; i < maxY; i++) {
      //moving down a row
      for (var j = 0; j < maxX; j++) {
        //moving over a column
        //x, y, width, height
        ctx.strokeRect(j * 20, i * 20, 20, 20);
        output.push(0);
      }
    }
    output.push('|END OF STRING|');
  } else {
    var stringToLoad = document.getElementById('loadString').value;
    output = stringToLoad.split(",");
    output.push('|END OF STRING|');
    maxX = output[0];
    maxY = output[1];
    document.getElementById('canvas').width = maxX * 20;
    document.getElementById('canvas').height = maxY * 20;
    ctx.strokeStyle = 'gainsboro';

    for (var i = 0; i < maxY; i++) {
      //moving down a row
      for (var j = 0; j < maxX; j++) {
        //moving over a column
        //x, y, width, height
        ctx.strokeRect(j * 20, i * 20, 20, 20);
        if (output[i * maxX + j + 2] != 0) {
          ctx.fillStyle = colours[parseInt(output[i * maxX + j + 2], 10) - 1];
          //i * maxx + j + 2 is the current tile of the string we are looking at
          //output[the above] is that tile
          //parseInt(the above, 10) takes the string output and turns it into a number, the 10 is for base 10
          // the above - 1 because the numbers are off
          //colours[the above]  to get the block with that call number
          ctx.fillRect(j * 20 + 1, i * 20 + 1, 18, 18);
        }
      }
    }
  }
  //canvas and save now viewable, create not viewable
  document.getElementById('div0').style.display = 'block';
  document.getElementById('div3').style.display = 'block';
  document.getElementById('div1').style.display = 'none';
  document.getElementById('div2').style.display = 'none';
}

var fill1 = 0;
var fill2 = 0;
var fill3 = 0;
var fill4 = 0;

function fill() {
  if (fillStatus == 0 && output.length > 0) {
    fillStatus = 1;
    document.getElementById('fill').innerHTML = 'x, y - x, y';
  }
}

function mouseDown() {
  if (fillStatus == 0) {
    //filling is not happening
    mouseIsDown = true;
    usedButton = event.button;
    objectMousedOver();
  } else if (fillStatus == 1) {
    //fill, first one clicked, save the first block and set the colour to fill with
    usedButton = event.button;
    var mouseX = event.clientX - 10 + pageXOffset;
    var mouseY = event.clientY - yOffset + pageYOffset;
    fill1 = Math.floor(mouseX / 20);
    fill2 = Math.floor(mouseY / 20);
    if (usedButton == 2) {
      ctx.fillStyle = 'white';
      toOutput = 0;
    } else {
      ctx.fillStyle = currentBrush;
      toOutput = colours.indexOf(currentBrush) + 1;
    }
    fillStatus = 2;
    document.getElementById('fill').innerHTML = fill1 + ', ' + fill2 + ' - x, y';
  } else if (fillStatus == 2) {
    //fill, second one clicked, save it
    usedButton = event.button;
    var mouseX = event.clientX - 10 + pageXOffset;
    var mouseY = event.clientY - yOffset + pageYOffset;
    fill3 = Math.floor(mouseX / 20);
    fill4 = Math.floor(mouseY / 20);
    //the math and actual filling
    //the plus 1 is because i < a bigger number than the number to stop at; counting from 0 reasons
    for (var i = 0; i < (fill4 - fill2 + 1); i++) {
      for (var j = 0; j < (fill3 - fill1 + 1); j++) {
        //filling everything, but starting from the initial selection
        ctx.fillRect((fill1 + j) * 20 + 1, (fill2 + i) * 20 + 1, 18, 18);
        output[(fill2 + i) * maxX + (fill1 + j) + 2] = toOutput;
      }
    }
    //set fill back to 0
    fillStatus = 0;
    document.getElementById('fill').innerHTML = 'Fill';
  }
}

function mouseUp() {
  mouseIsDown = false;
}

function objectMousedOver() {
  if (mouseIsDown == true) {
    var mouseX = event.clientX - 10 + pageXOffset;
    var mouseY = event.clientY - yOffset + pageYOffset;
    var targetX = Math.floor(mouseX / 20);
    var targetY = Math.floor(mouseY / 20);
    if (usedButton == 2) {
      ctx.fillStyle = 'white';
      toOutput = 0;
    } else {
      ctx.fillStyle = currentBrush;
      toOutput = colours.indexOf(currentBrush) + 1;
    }
    ctx.fillRect(targetX * 20 + 1, targetY * 20 + 1, 18, 18);
    output[targetY * maxX + targetX + 2] = toOutput;
  }
}

function keyPressed(event) {
  if (event.keyCode == 70) {
    //press F to fill
    fill();
  }
}

function saveCanvas() {
  document.getElementById('output').innerHTML = output.toString();
}

document.addEventListener('keydown', keyPressed);
document.getElementById('canvas').onmousedown = mouseDown;
document.getElementById('canvas').onmousemove = objectMousedOver;
document.getElementById('canvas').onmouseup = mouseUp;
