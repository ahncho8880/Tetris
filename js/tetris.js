import BLOCKS from "./blocks.js";

const playground = document.querySelector(".playground>ul");
const GAME_ROWS = 19;
const GAME_COLS = 10;
let totalScore = document.getElementsByClassName("score");
let score = 0;
let duration = 1000;
let downInterval;
let tempMovingItem;
let moveType = "top";

const movingItem = {
    type: "",
    direction: 0,
    top: 0,
    left: 3,
};

init(); 

function init(){
    totalScore[0].textContent = 0;
    tempMovingItem = {...movingItem};
    for(let i=0;i<GAME_ROWS;i++){
        prependNewLine();
    }
    generateNewBlock();
}
function randomBlock(){
    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * 7);
    movingItem.type = blockArray[randomIndex][0];
}
function prependNewLine(){
        const li = document.createElement("li");
        const ul = document.createElement("ul");
        for(let j=0;j<GAME_COLS;j++){
            const matrix = document.createElement("li");
            ul.prepend(matrix);
        }
        li.prepend(ul);
        playground.prepend(li);
}
function renderBlocks(){
    const {type, direction,top, left} = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove(type,"moving");
    });
    BLOCKS[type][direction].some(block=>{
        const x=block[0]+left;
        const y=block[1]+top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkMove(target);
        if(isAvailable){
            target.classList.add(type, "moving");
        }else{
            tempMovingItem = { ...movingItem };
            setTimeout(()=>{
                renderBlocks();
                if(moveType==="top"){
                    seizeBlock();
                }
            },0)
            return true;
        }
    });
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    });
    checkLine();
    generateNewBlock();
}
function checkLine(){
    const childNodes = playground.childNodes;
    childNodes.forEach(child=>{
        let lines =0;
        let matched = true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched = false;
            }
        });
                if(matched){
                    child.remove();
                    prependNewLine();
                    score+=10;
                }
                totalScore[0].textContent = score;
    })
}
function generateNewBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveType = "top";
        moveBlock("top",1);
    },duration);

    randomBlock();
    movingItem.direction =0;
    movingItem.left = 3;
    movingItem.top =0;
    tempMovingItem = { ...movingItem };
    renderBlocks();
}
function checkMove(target){
    if(!target || target.classList.contains("seized"))
        return false;
    return true;
}
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks();
}
function changeDirection(amount){
    tempMovingItem["direction"] = tempMovingItem["direction"] === 3 ? 0 : tempMovingItem["direction"]+1;
    renderBlocks();
}
function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock("top",1);
    },10);
}
document.addEventListener("keydown", e=>{
    switch(e.keyCode){
        case 37:
            moveType = "left";
            moveBlock(moveType,-1);
            break;
        case 38:
            changeDirection();
            break;
        case 39:
            moveType = "left";
            moveBlock(moveType,1);
            break;
        case 40:
            moveType = "top";
            moveBlock(moveType,1);
            break;
        case 32:
            moveType = "top";
            dropBlock();
            break;
        default:
            break;
    }
});