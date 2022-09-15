/*----- constants -----*/

let xAxis = 21;
let yAxis = 10;
let tileSize = '30px 30px';
let seconds = 0;

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
    evt.target.style.background = `url('assets/pressed_tile.png')`;
    evt.target.style.backgroundSize = '30px 30px';
    console.log("board clicked")
})

boardEl.addEventListener('mouseup', function(evt) {
    evt.target.style.background = `url('./assets/closed_tile.png')`;
    evt.target.style.backgroundSize = '30px 30px';
})

boardEl.addEventListener('mouseleave', function(evt) {
    evt.target.style.background = `url('./assets/closed_tile.png')`;
    evt.target.style.backgroundSize = '30px 30px';
})

boardEl.addEventListener('contextmenu', function(evt) {
    evt.target.style.background = `url('./assets/flag_tile.png')`;
    evt.target.style.backgroundSize = '30px 30px';
    evt.preventDefault();
  }, false);

if (boardEl.addEventListener) {

    boardEl.addEventListener('contextmenu', function(evt) {

        evt.target.style.background = `url('./assets/flag_tile.png')`;
        evt.target.style.backgroundSize = '30px 30px';
        evt.preventDefault();

    }, false);

} else {
    boardEl.attachEvent('oncontextmenu', function() {
        window.event.returnValue = false;
    });
}

/*----- functions -----*/

function generateGrids(){
    for(let j=0; j<yAxis; j++){
        for (let i=0; i<xAxis; i++){
            //TODO: fix the id generation
            let tile = document.createElement('div');
            tile.classList.add('tile')
            console.log('i: ', i, 'j: ', j, `${i}${j}`)
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
    document.querySelector('#statusBar').style.width = `${30*xAxis + 2*xAxis}px`

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
//GAME START
generateGrids();

//setInterval(clock, 1000);


