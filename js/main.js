/*----- constants -----*/
const MIN_DIM = 9;
const MAX_DIM = 50
const MIN_BOMB = 5;
const MAX_BOMB = 25;
let xAxis = MIN_DIM;
let yAxis = MIN_DIM;
let tileSize = '30px 30px';
let seconds = 0;
let bombCount = 10;
let flagCount = 0;
let bombCoords = [];
let noCornerMode = false;
let refreshIntervalId = null;
let gameOver = false;



/*----- app's state (variables) -----*/

/*----- cached element references -----*/

const resetIconEl = document.querySelector('#resetIcon')
const resetBtnEl = document.querySelector('#resetBtn');
const boardEl = document.querySelector('#board');
const inputBtnEl = document.querySelector('#customSettingsBtn')
/*----- event listeners -----*/

/*----- custom input btn listeners -----*/
inputBtnEl.addEventListener('click', function(){
    const width = document.querySelector('#widthInput').value;
    const height = document.querySelector('#heightInput').value;
    const bombs = document.querySelector('#bombInput').value
    if(width && height && bombs){
        xAxis = parseInt(width, 10);
        yAxis = parseInt(height, 10);
        let bombPercent = parseInt(bombs, 10);
        //use a floor here to get an int back
        bombCount = Math.floor(xAxis*yAxis*(bombPercent/100));
        noCornerMode = document.querySelector('#noCorners').checked;
    } else {
        xAxis = MIN_DIM;
        yAxis = MIN_DIM;
        bombCount = 10;
        noCornerMode = document.querySelector('#noCorners').checked;
    }
    
    
    init();
})
/*----- custom input btn listeners -----*/
/*----- reset button listeners -----*/
resetBtnEl.addEventListener('mousedown', function() {
    resetIconEl.src = 'assets/pressed_smiley.png';

    //stop the clock
    clearInterval(refreshIntervalId);
    //change clock images
    seconds = 0;
    document.querySelector('#time1s').src = `./assets/d0.svg`;
    document.querySelector('#time10s').src = `./assets/d0.svg`;
    document.querySelector('#time100s').src = `./assets/d0.svg`;
    
    
})
resetBtnEl.addEventListener('mouseup', function() {
    resetIconEl.src = 'assets/unpressed_smiley.png';
    init();
    
})
/*----- reset button listeners -----*/

/*----- board listeners -----*/
boardEl.addEventListener('mousedown', function(evt) {
    if(!gameOver){
        switch (evt.which) {
            case 1:
                /* LMB DOWN CLICK */
                //If it's not a flagged tile, 
                if(!evt.target.classList.contains('flagged')){
                    setEvtImg('pressed_tile.png', evt)
                }
                break;
            case 2:
                //console.log('Middle Mouse button pressed.');
                break;
            case 3:
                /* RMB DOWN CLICK */
                //flag
                if(!evt.target.classList.contains('open')){
                    if(evt.target.classList.contains('flagged'))
                    {
                        evt.target.classList.remove('flagged')
                        setEvtImg('closed_tile.png', evt)
                        flagCount--;
                        setBombDisplay();
                    } 
                    //unflag
                    else {
                        evt.target.classList.add('flagged')
                        setEvtImg('flag_tile.png', evt)
                        flagCount++;
                        setBombDisplay();
                    }
                }

                
                break;
            default:
                //console.log('You have a strange Mouse!');
        }
    }
  
})
boardEl.addEventListener('mouseup', function(evt) {
    if(!gameOver){
        switch (evt.which) {
            case 1:
                //if tile is covered, uncover
                //if the is tile is flagged or blank, do nothing
                uncover(evt);
                //if the tile is a number, do chord click
                //chord();
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
    }
})
boardEl.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
  });

//get rid of the menu on right click
/*----- board listeners -----*


/*----- functions -----*/

//create the actual divs and images for the game
function generateGrids(){
    for(let j=0; j<yAxis; j++){
        for (let i=0; i<xAxis; i++){
            let tile = document.createElement('div');
            tile.classList.add('tile')
            tile.classList.add('covered')
            tile.id = `${i},${j}`
            tile.style.backgroundColor = 'pink';
            tile.style.height = '30px';
            tile.style.width = '30px';
            //helper function doesn't work here because it expects an event
            tile.style.background = `url('./assets/closed_tile.png')`;
            tile.style.backgroundSize = tileSize;
            document.querySelector('#board').appendChild(tile);    
        }
    }
    //scale the board to fit the amount of tiles we have
    document.querySelector('#board').style.width = `${32*xAxis}px`; 
    document.querySelector('#board').style.height = `${32*yAxis}px`;

    //TODO: Figure out what to do with the status bar
    document.querySelector('#statusBar').style.width = `${32*xAxis}px`;

    let statusBarHeight;
    if(8*yAxis >= 90){
        statusBarHeight = yAxis*8;
    }   else{
        statusBarHeight = 90;
    }
    document.querySelector('#statusBar').style.height = `${statusBarHeight}px`;
}
//calculate the adjacentTiles and return an array of strings in the form of 'x,y'
function adjacentTiles(coord){
    let arr = []
    let temp = coord.split(',')
    let x = parseInt(temp[0], 10);
    let y = parseInt(temp[1], 10);
  
    for(let i=-1; i<2; i++){
      if(((y+i)>=0) && (y+i)<yAxis){
        for(let j=-1; j<2; j++){
          //console.log("j, i", j, i)
          if(((x+j)>=0 && (x+j)<xAxis) && !((y+i)===y && (x+j)===x)){
            //console.log('pushed')
            arr.push(`${x+j},${y+i}`)
          }
        }
      }
    }
    return arr;
  }
//calculate the time to display and change out the images
//note: requires help of setInterval()
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
//calculates the amount of bombs that are not flagged and change out the images
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
//resolves opening a tile
function uncover(evt){
    if(bombCoords.includes(evt.target.id)){
        evt.target.classList.add('killer');
        gameLost();
        gameOver = true;
    } else {
        evt.target.classList.add('open');
        evt.target.classList.remove('covered');
        //do some sort of calculation for the numbers underneath
        renderNumbers(evt);
    }
    
}
function renderNumbers(evt){
    let adjArr = adjacentTiles(evt.target.id);
    let adjBombCount = 0;
    adjArr.forEach(function(coord){
        if(bombCoords.includes(coord)){
            adjBombCount++;
        }
    })
    if(adjBombCount){
        evt.target.classList.add('number');
        
    } else{
        evt.target.classList.add('clear');
    }
    setEvtImg(`open${adjBombCount}.svg`, evt);
    //TODO: resolve all of the empty tiles
    // if(evt.target.classList.includes('clear')){
    //     adjArr.forEach(function(coord){
    //     })
    // }
}

function gameLost(){
    bombCoords.forEach(function(coord){
        let tile = document.getElementById(coord)
        if(tile.classList.contains('killer')){
            setElImg('mine_incorrect.svg', tile)
        } else if(!tile.classList.contains('flagged')){
            setElImg('mine_correct.svg', tile);
        }
    })
    //call some kind of game over function
    clearInterval(refreshIntervalId);
    
}
//generates the coordinates of bombs based on bombCount
//pushes the coordinates as strings in the form of 'x,y' to the global bombCoords array
function generateBombs(){
    //playing with bombs in corners
    if(!noCornerMode){
        console.log('with corners')
        while(bombCoords.length<bombCount){
            let rand1 = Math.floor(Math.random() * (xAxis))
            let rand2 = Math.floor(Math.random() * (yAxis))
            bombCoords.push(`${rand1},${rand2}`);
        }
    } else{
        console.log('without corners')
        //playing without bombs in corners
        while(bombCoords.length<bombCount){
            let rand1 = Math.floor(Math.random() * (xAxis))
            let rand2 = Math.floor(Math.random() * (yAxis))
            if((rand1!==0 && rand1!==xAxis-1) && rand2!==0 && rand2!==yAxis-1){
                bombCoords.push(`${rand1},${rand2}`);
            }
        }
    }
}
//helper functions
//helper function to change the image given a string for the image and an event object
function setEvtImg(img, evt){
    evt.target.style.background = `url('./assets/${img}')`;
    evt.target.style.backgroundSize = tileSize;
}
function setElImg(img, el){
    
    el.style.background = `url('./assets/${img}')`;
    el.style.backgroundSize = tileSize;
}
//clear the input boxes
function clearInputEls(){
    document.querySelector('#widthInput').value = '';
    document.querySelector('#heightInput').value = '';
    document.querySelector('#bombInput').value = '';
    document.querySelector('#noCorners').checked = false;
}
function reset(){
    // console.log('INIT CALLED')
    clearInterval(refreshIntervalId);
    //wow this is a neat way to remove all children tags
    document.querySelector('#board').innerHTML = '';
    seconds = 0;
    gameOver = false;
}
function init(){

    reset();

    generateGrids();
    generateBombs();
    setBombDisplay();
    clearInputEls();
    refreshIntervalId = setInterval(clock, 1000);
}
//GAME START
init();
