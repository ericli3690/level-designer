document.getElementById('inputX').value = 20;
document.getElementById('inputY').value = 20;

var maxX = 0;
var maxY = 0;
var mouseIsDown = false;
var usedButton = 0;
var toOutput = 0;
var output = [];
var currentBrush = '';
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
    var find = document.getElementById('div1');
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
    ctx.strokeStyle = 'black';
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
    output.push('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
  } else {
    var stringToLoad = document.getElementById('loadString').value;
    output = stringToLoad.split(",");
    output.push('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
    maxX = output[0];
    maxY = output[1];
    document.getElementById('canvas').width = maxX * 20;
    document.getElementById('canvas').height = maxY * 20;
    ctx.strokeStyle = 'black';

    for (var i = 0; i < maxY; i++) {
      //moving down a row
      for (var j = 0; j < maxX; j++) {
        //moving over a column
        //x, y, width, height
        ctx.strokeStyle = 'black';
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
}

function mouseDown() {
  mouseIsDown = true;
  usedButton = event.button;
  objectMousedOver();
}

function mouseUp() {
  mouseIsDown = false;
}

function objectMousedOver() {
  if (mouseIsDown == true) {
    var mouseX = event.clientX  - 10 + pageXOffset;
    var mouseY = event.clientY - 265 + pageYOffset;
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

function saveCanvas() {
  document.getElementById('output').innerHTML = output.toString();
}

document.getElementById('canvas').onmousedown = mouseDown;
document.getElementById('canvas').onmousemove = objectMousedOver;
document.getElementById('canvas').onmouseup = mouseUp;
