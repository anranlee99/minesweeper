/*----- constants -----*/
const MIN_DIM = 9;
const MAX_DIM = 50
const MIN_BOMB = 5;
const MAX_BOMB = 25;
const TILE_SIZE = '30px 30px';
let xAxis = MIN_DIM;
let yAxis = MIN_DIM;

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
const checkBoxEl = document.querySelector('#noCorners')
const settingsBtnEl = document.querySelector('#settingsBtn')
const infoMenuEl = document.querySelector('#infoMenu')
// infoMenuEl.style.backgroundImage = 'url(assets/info_icon.svg)';
const exitPopupEl = document.querySelector('#exitPopup')
/*----- event listeners -----*/

/*----- custom input btn listeners -----*/
infoMenuEl.addEventListener('mouseenter', function(){
    let menu = document.createElement('div')
    menu.style.opacity = '0.95';
    menu.style.backgroundColor = '#669999';
    
    menu.style.width = '100px'
    menu.style.height = '150px'
    menu.style.marginLeft = '60px';
    menu.style.display = 'flex';
    menu.style.alignContent = 'space-around'

    let list = document.createElement('dl')
    list.style.margin = 'auto';
    list.style.display = 'flex';
    list.style.flexDirection = 'column'
    list.style.alignContent = 'space-evenly'
    let widthText = document.createElement('dt');
    let heightText = document.createElement('dt');
    let bombText = document.createElement('dt');
    
    widthText.innerText = `Width: ${xAxis}`;
    heightText.innerText = `Height: ${yAxis}`;
    bombText.innerText = `Bombs: ${bombCount}`;

    widthText.style.margin = '10px';
    heightText.style.margin = '10px';
    bombText.style.margin = '10px';
    list.appendChild(widthText)
    list.appendChild(heightText)
    list.appendChild(bombText)
    menu.appendChild(list)

    infoMenuEl.appendChild(menu)
})

infoMenuEl.addEventListener('mouseleave', function(){
    infoMenuEl.innerHTML = ''
})
exitPopupEl.addEventListener('click', function(){
    closePopup();
})
document.querySelector('#popupScreen').addEventListener('click', function(evt){
    if(evt.target.id==='popupScreen'){
        closePopup();
    }
    
})
settingsBtnEl.addEventListener('click', function(){
   let popupScreenStyle = document.querySelector('#popupScreen').style;
   let mainDisplay = document.querySelector('#mainDisplay').style;
   mainDisplay.filter = 'blur(8px)';
   
   let popupStyle = document.querySelector('#popup').style;
   popupStyle.display = 'flex';
   popupScreenStyle.display = 'flex';
   popupStyle.zIndex = '1';
   popupScreenStyle.zIndex = '1';
   
})
checkBoxEl.addEventListener('click', function(evt){
    noCornerMode = evt.target.checked;
    init();
})
inputBtnEl.addEventListener('click', function(){
    
    getSettings();
    closePopup();
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
                if(!evt.target.classList.contains('flagged') && !evt.target.classList.contains('open')){
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
                if(evt.target.classList.contains('covered')){
                    uncover(evt.target.id);
                }
                //if the tile is a number, do chord click
                else if(evt.target.classList.contains('number')){
                    chord(evt.target.id);
                }
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
//helper function for the input menu
function getSettings(){
    const width = document.querySelector('#widthInput').value;
    const height = document.querySelector('#heightInput').value;
    const bombs = document.querySelector('#bombInput').value
    if(width){
        if(width > MAX_DIM){
            xAxis = MAX_DIM;
        }
        else if(width < MIN_DIM){
            xAxis = MIN_DIM;
        }
        else {
            xAxis = parseInt(width, 10);
        }
    }
    if(height){
        if(height > MAX_DIM){
            yAxis = MAX_DIM;
        }
        else if(height < MIN_DIM){
            yAxis = MIN_DIM;
        }
        else {
            yAxis = parseInt(height, 10);
        }
    }
    if(bombs){
        if(bombs > MAX_BOMB){
            bombPercent = MAX_BOMB;
        }
        else if(bombs < MIN_BOMB){
            bombPercent = MIN_BOMB;
        }
        else {
            let bombPercent = parseFloat(bombs);
            bombCount = Math.round(xAxis*yAxis*(bombPercent/100));
            
        }
    }
}
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
            tile.style.backgroundSize = TILE_SIZE;
            document.querySelector('#board').appendChild(tile);    
        }
    }
    //maybe move all of this to some render function
    //scale the board to fit the amount of tiles we have
    document.querySelector('#board').style.width = `${32*xAxis}px`; 
    document.querySelector('#board').style.height = `${32*yAxis}px`;

    //TODO: Figure out what to do with the status bar
    document.querySelector('#statusBar').style.width = `${32*xAxis}px`;
    document.querySelector('#toolBar').style.width = `${32*xAxis}px`;
    document.querySelector('#mainDisplay').style.width = `${32*xAxis}px`;
    document.querySelector('body').style.width = `${32*xAxis + 400}px`;
    document.querySelector('body').style.height = `${32*yAxis + 400}px`;
    document.querySelector('#mainDisplay').style.height = `${32*yAxis + 171}px`;
    document.querySelector('#popupScreen').style.width = `${32*xAxis + 400}px`;
    document.querySelector('#popupScreen').style.height = `${32*yAxis + 400}px`;
    let vw = window.innerWidth
    let vh = window.innerHeight
    if(vw > 32*xAxis + 400){
        document.querySelector('body').style.width = `${vw}px`;
    } 
    if(vh > 32*yAxis + 400){
        document.querySelector('body').style.height = `${vh}px`;
    }
    document.querySelector('#statusBar').style.height = '90px';
    document.querySelector('#toolBar').style.height = '90px';
    let panelBoxesEl = document.querySelectorAll('.panelBoxes');
    //adjust the dimensions of the panel boxes if beyond a certain size;
    if(32*xAxis*0.25 > 160){
        panelBoxesEl.forEach(function(div){
            div.style.width= '160px';
            div.style.margin = '40px';
        })
        document.querySelector('#statusBar').style.justifyContent = 'center';
    }
}
function closePopup(){ 
    let popupStyle = document.querySelector('#popup').style;
    let mainDisplay = document.querySelector('#mainDisplay').style;
    let popupScreenStyle = document.querySelector('#popupScreen').style;

    popupStyle.display = 'none';
    popupStyle.zIndex = '-1';
    popupScreenStyle.display = 'none';
    popupScreenStyle.zIndex = '-1';
    mainDisplay.filter = 'none';

    clearInputEls();
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
          if(((x+j)>=0 && (x+j)<xAxis) && !((y+i)===y && (x+j)===x)){
            arr.push(`${x+j},${y+i}`)
          }
        }
      }
    }
    return arr;
  }
//perform the chording function on a tile
function chord(tileID){
    let adjArr = adjacentTiles(tileID);
    let tile = document.getElementById(`${tileID}`);
    let adjFlagCount = 0;
    let adjBombCount = 0

    adjArr.forEach(function(coord){
        if(bombCoords.includes(coord)){
            adjBombCount++;
        }
        if(document.getElementById(coord).classList.contains('flagged')){
            adjFlagCount++;
        }
    })
    if(adjBombCount === adjFlagCount){
        
        adjArr.forEach(function(coord){
            tile = document.getElementById(coord);
            if(tile.classList.contains('covered') && !tile.classList.contains('flagged')){
                uncover(coord);
            }
        })
    }
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
function uncover(tileID){
    let tile = document.getElementById(tileID);
    if(bombCoords.includes(tileID)){
        tile.classList.add('killer');
        gameLost();
        gameOver = true;
    } else {
        tile.classList.add('open');
        tile.classList.remove('covered');
        //do some sort of calculation for the numbers underneath
        renderNumbers(tileID);
        let tilesRemaining = document.querySelectorAll('.covered');
        if(tilesRemaining.length===bombCount){
            gameWon();
             gameOver = true;
             flagCount = bombCount;
             setBombDisplay();
        }
    }
}
function renderNumbers(tileID){
    let adjArr = adjacentTiles(tileID);
    let tile = document.getElementById(`${tileID}`);
    tile.classList.add('open');
    tile.classList.remove('covered');
    let adjBombCount = 0;
    let toResolve = [];
    adjArr.forEach(function(coord){
        if(bombCoords.includes(coord)){
            adjBombCount++;
        }
    })

    setElImg(`open${adjBombCount}.svg`, tile);

    if(adjBombCount){
        tile.classList.add('number');
    } else{
        tile.classList.add('clear');
        adjArr.forEach(function(coord){
            tile = document.getElementById(`${coord}`);
            if(tile.classList.contains('covered')){
                renderNumbers(coord);
            }
            
        })
    }
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
    document.querySelector('#resetIcon').src = './assets/lose_smiley.png';
}

function gameWon(){
    bombCoords.forEach(function(coord){
        let tile = document.getElementById(coord)
        if(!tile.classList.contains('flagged')){
            setElImg('flag_tile.png', tile)
        }
    })
    clearInterval(refreshIntervalId);
    document.querySelector('#resetIcon').src = './assets/win_smiley.svg';
}
//generates the coordinates of bombs based on bombCount
//pushes the coordinates as strings in the form of 'x,y' to the global bombCoords array
function generateBombs(){
    //playing with bombs in corners
    if(!noCornerMode){
        while(bombCoords.length<bombCount){
            let rand1 = Math.floor(Math.random() * (xAxis))
            let rand2 = Math.floor(Math.random() * (yAxis))
            if(!bombCoords.includes(`${rand1},${rand2}`)){
                bombCoords.push(`${rand1},${rand2}`);
            } 
        }
    } else{
        //playing without bombs in corners
        while(bombCoords.length<bombCount){
            let rand1 = Math.floor(Math.random() * (xAxis))
            let rand2 = Math.floor(Math.random() * (yAxis))
            if((rand1!==0 && rand1!==xAxis-1) && rand2!==0 && rand2!==yAxis-1){
                if(!bombCoords.includes(`${rand1},${rand2}`)){
                    bombCoords.push(`${rand1},${rand2}`);
                }
            }
        }
    }
}
//helper functions
//helper function to change the image given a string for the image and an event object
function setEvtImg(img, evt){
    evt.target.style.background = `url('./assets/${img}')`;
    evt.target.style.backgroundSize = TILE_SIZE;
}
function setElImg(img, el){
    
    el.style.background = `url('./assets/${img}')`;
    el.style.backgroundSize = TILE_SIZE;
}
//clear the input boxes
function clearInputEls(){
    document.querySelector('#widthInput').value = '';
    document.querySelector('#heightInput').value = '';
    document.querySelector('#bombInput').value = '';
    document.querySelector('#noCorners').checked = false;
}
function reset(){
    clearInterval(refreshIntervalId);
    //wow this is a neat way to remove all children tags
    document.querySelector('#board').innerHTML = '';
    bombCoords = [];
    seconds = 0;
    gameOver = false;
    flagCount = 0;
}
function init(){

    reset();

    generateGrids();
    generateBombs();
    setBombDisplay();
    refreshIntervalId = setInterval(clock, 1000);
}
//GAME START
init();
