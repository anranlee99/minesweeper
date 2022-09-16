/*----- constants -----*/

let xAxis = 20;
let yAxis = 9;
let tileSize = '30px 30px';
let seconds = 0;
let bombCount = 10;
let flagCount = 0;
let bombCoords = {}
let noCornerMode = false;
/*----- app's state (variables) -----*/

/*----- cached element references -----*/

const resetIconEl = document.querySelector('#resetIcon')
const resetBtnEl = document.querySelector('#resetBtn');
const boardEl = document.querySelector('#board');

/*----- event listeners -----*/

resetBtnEl.addEventListener('mousedown', function() {
    resetIconEl.src = 'assets/pressed_smiley.png'
    console.log("reset clicked")
})

resetBtnEl.addEventListener('mouseup', function() {
    resetIconEl.src = 'assets/unpressed_smiley.png'
})
   

boardEl.addEventListener('mousedown', function(evt) {
    switch (evt.which) {
        case 1:
            /* LMB DOWN CLICK */
            //If it's not a flagged tile, 
            if(!evt.target.classList.contains('flagged')){
                setImg('pressed_tile.png', evt)
            }
            break;
        case 2:
            //console.log('Middle Mouse button pressed.');
            break;
        case 3:
            /* RMB DOWN CLICK */
            
            //flag
            if(evt.target.classList.contains('flagged'))
            {
                evt.target.classList.remove('flagged')
                setImg('closed_tile.png', evt)
                flagCount--;
                setBombDisplay();
                
            } 
            //unflag
            else {
                evt.target.classList.add('flagged')
                setImg('flag_tile.png', evt)
                flagCount++;
                setBombDisplay();
            }
            
            break;
        default:
            //console.log('You have a strange Mouse!');
    }
    
})

boardEl.addEventListener('mouseup', function(evt) {
    switch (evt.which) {
        case 1:
            //if tile is covered, uncover
            //if the is tile is flagged or blank, do nothing
            //if the tile is a number, do chord click
            break;
        case 2:
            //console.log('Middle Mouse button pressed.');
            break;
        case 3:
            //right mouse button
            break;
        default:
            //console.log('You have a strange Mouse!');
    }
})

// boardEl.addEventListener('mouseleave', function(evt) {
//     console.log('mouseleave')
//     evt.target.style.background = `url('./assets/closed_tile.png')`;
//     evt.target.style.backgroundSize = tileSize;
// })

//get rid of the menu on right click
boardEl.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
  });


/*----- functions -----*/


function generateGrids(){
    for(let j=0; j<yAxis; j++){
        for (let i=0; i<xAxis; i++){
            //TODO: fix the id generation
            let tile = document.createElement('div');
            tile.classList.add('tile')
            tile.classList.add('covered')
            tile.id = `${i},${j}`
            tile.style.backgroundColor = 'pink';
            tile.style.height = '30px';
            tile.style.width = '30px';
            tile.style.background = `url('./assets/closed_tile.png')`;
            tile.style.backgroundSize = tileSize;
            document.querySelector('#board').appendChild(tile);    
            
        }
    }
    document.querySelector('#board').style.width = `${30*xAxis + 2*xAxis}px`; 
    document.querySelector('#board').style.height = `${30*yAxis + 2*yAxis}px`;
    document.querySelector('#statusBar').style.width = `${30*xAxis + 2*xAxis}px`;

    let statusBarHeight;
    if(8*yAxis >= 90){
        statusBarHeight = yAxis*8;
    }   else{
        statusBarHeight = 90;
    }
    document.querySelector('#statusBar').style.height = `${statusBarHeight}px`;

}

function adjacentTiles(coord){
    //calculate the adjacent coordinates and return an array of the strings?
    let arr = []
    let temp = coord.split(',')
    let x = parseInt(temp[0], 10);
    let y = parseInt(temp[1], 10);

    //if the coord is a corner
    if((!x || x === xAxis-1) && (!y || y===yAxis-1)){

      //top left corner
      if(!x && !y){
        arr.push(`${x+1},${y}`)       
        arr.push(`${x},${y+1}`)
        arr.push(`${x+1},${y+1}`)
      }
      //top right corner
      else if(x===xAxis-1 && !y){
        arr.push(`${x-1},${y}`)
        arr.push(`${x-1},${y+1}`)
        arr.push(`${x},${y+1}`)
        
      }
      //bottom left corner
      else if(!x && y===yAxis-1){
        
        arr.push(`${x},${y-1}`)
        arr.push(`${x+1},${y-1}`)
        arr.push(`${x+1},${y}`)
        
      }
      //bottom right
      //(x===xAxis-1 && y===yAxis-1)
      else{
        arr.push(`${x-1},${y-1}`)
        arr.push(`${x},${y-1}`)
        arr.push(`${x-1},${y}`)
      }
      
    }
    //if the coord is an edge and not a corner
    else if((!x && y && y<yAxis-1) || (x===xAxis-1 && y && y<yAxis-1) || (!y && x && x<xAxis-1) || (y===yAxis-1 && x && x<xAxis-1)){
      //top edge
      if(!y && x && x<xAxis-1){
        
        arr.push(`${x-1},${y}`)
        arr.push(`${x+1},${y}`)
        
        arr.push(`${x-1},${y+1}`)        
        arr.push(`${x},${y+1}`)
        arr.push(`${x+1},${y+1}`)
      }
      //bottom edge
      else if(y===yAxis-1 && x && x<xAxis-1){
        arr.push(`${x-1},${y-1}`)
        arr.push(`${x},${y-1}`)
        arr.push(`${x+1},${y-1}`)
        arr.push(`${x-1},${y}`)
        arr.push(`${x+1},${y}`)
      }
      //left edge
      else if(!x && y && y<yAxis-1){
        arr.push(`${x},${y-1}`)
        arr.push(`${x+1},${y-1}`)
        arr.push(`${x+1},${y}`)
        arr.push(`${x},${y+1}`)
        arr.push(`${x+1},${y+1}`)
      }
      //right edge
      //x===xAxis-1 && y && y<yAxis-1
      else{
        arr.push(`${x-1},${y-1}`)
        arr.push(`${x},${y-1}`)
        arr.push(`${x-1},${y}`)
        arr.push(`${x-1},${y+1}`)
        arr.push(`${x},${y+1}`)
      }
    }
    //coord is not an edge
    else{
      //the 3 above
      arr.push(`${x-1},${y-1}`)
      arr.push(`${x},${y-1}`)
      arr.push(`${x+1},${y-1}`)
      //the 2 beside
      arr.push(`${x-1},${y}`)
      arr.push(`${x+1},${y}`)
      //the 3 below
      arr.push(`${x-1},${y+1}`)
      arr.push(`${x},${y+1}`)
      arr.push(`${x+1},${y+1}`)
    }
  return arr;
}

function clock(){

    if(seconds<1000)
    {
        seconds++;
    }
    let ones = Math.floor(seconds % 10)
    let tens = Math.floor(seconds/10 % 10)
    let hundreds = Math.floor(seconds/100 % 10)

    let onesEl = document.querySelector('#time1s');
    let tensEl = document.querySelector('#time10s');
    let hundsEl = document.querySelector('#time100s');

    onesEl.src = `./assets/d${ones}.svg`
    tensEl.src = `./assets/d${tens}.svg`
    hundsEl.src = `./assets/d${hundreds}.svg`

}

function setBombDisplay(){
    //don't use actual bomb count here, don't want to mess with calculations
    let displayBombs = bombCount - flagCount
    if(displayBombs<0)
    {
        displayBombs = 0;
    }
    let ones = Math.floor(displayBombs % 10)
    let tens = Math.floor(displayBombs/10 % 10)
    let hundreds = Math.floor(displayBombs/100 % 10)

    let onesEl = document.querySelector('#bomb1s');
    let tensEl = document.querySelector('#bomb10s');
    let hundsEl = document.querySelector('#bomb100s');

    onesEl.src = `./assets/d${ones}.svg`
    tensEl.src = `./assets/d${tens}.svg`
    hundsEl.src = `./assets/d${hundreds}.svg`
}

//helper function
function setImg(img, evt){
    evt.target.style.background = `url('./assets/${img}')`;
    evt.target.style.backgroundSize = tileSize;
}
function generateBombs(){
    //playing with bombs in corners
    if(!noCornerMode){
        while(Object.keys(bombCoords).length<bombCount){
            let rand1 = Math.floor(Math.random() * (xAxis))
            let rand2 = Math.floor(Math.random() * (yAxis))
            
            bombCoords[`${rand1},${rand2}`] = true
        }
    }

    //playing without bombs in corners
    while(Object.keys(bombCoords).length<bombCount){
        let rand1 = Math.floor(Math.random() * (xAxis))
        let rand2 = Math.floor(Math.random() * (yAxis))

    if((rand1!==0 && rand1!==xAxis-1) && rand2!==0 && rand2!==yAxis-1)
        bombCoords[`${rand1},${rand2}`] = true
    }
}
//GAME START
generateGrids();

let refreshIntervalId = setInterval(clock, 1000);
//clearInterval(refreshIntervalId);

