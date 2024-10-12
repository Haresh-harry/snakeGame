const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 10;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 0;

let score = 0;

let appleX = 5;
let appleY = 5;

let xVel = 0;
let yVel = 0;
let blockKeys = false;

const foodSound = new Audio("apple.mp3");
const crashSound = new Audio("crash.mp3");

// Game Loop.
function drawGame() {
    if(blockKeys) {
        return;
    }
    changeSnakePosition();
    let result = isGameOver();
    if(result){
        crashSound.play();
        setTimeout(()=> location.reload(),1500);
        startTimer();
        return;
    }

    clearScreen();
    drawSnake();
    drawApple();
    checkAppleCollision();
    drawScore();

}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawSnake() {

    ctx.fillStyle = "green";
    for(let i=0;i<snakeParts.length;i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x*tileCount,part.y*tileCount,tileSize,tileSize);              
    }

    snakeParts.push(new SnakePart(headX,headY));
    if(snakeParts.length > tailLength) {
        snakeParts.shift();
    }
    
    ctx.fillStyle = "red";
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize); 
}

function changeSnakePosition() {
    headX = headX + xVel;
    headY = headY + yVel;
}

function drawApple() {
    ctx.fillStyle = "blue";
    ctx.fillRect(appleX*tileCount, appleY*tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
    if(appleX == headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        foodSound.currentTime = 0;
        foodSound.play();
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px roboto";
    ctx.fillText("Score: "+score, canvas.width-50,15);
}

function isGameOver() {
    let gameOver = false;

    if(yVel === 0 && xVel === 0){
        return false;
    }

    //walls
    if(headX < 0){
        gameOver = true;
    }
    else if(headX === tileCount){
        gameOver = true;
    }
    else if(headY === tileCount){
        gameOver = true;
    }
    else if(headY < 0){
        gameOver = true;
    }

    //body
    for(let i=0; i<snakeParts.length;i++){
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY){
            gameOver = true;
            break;
        }
    }

    if(gameOver) {
        ctx.fontStyle = "white";
        ctx.font = "50px algerian";
        let display = ctx.createLinearGradient(0,0,canvas.width, canvas.height);
        display.addColorStop(0, "blue");
        display.addColorStop(0.25, "red");
        display.addColorStop(0.5, "orange");
        display.addColorStop(0.75, "purple");
        display.addColorStop(1.0, "green");
        ctx.fillStyle = display;
        ctx.fillText("Game Over!!", canvas.width/6.5, canvas.height/1.5);
        ctx.font = "30px algerian";
        ctx.fillText("Score: "+score, canvas.width/3.5, canvas.height/2);
    }

    return gameOver;
}

function startTimer() {
    blockKeys = true;  // Start blocking keys

    setTimeout(() => {
        blockKeys = false;  // Stop blocking after 5 seconds
    }, 1500);
}

document.body.addEventListener('keydown', keyDown);

    if (blockKeys) {
        event.preventDefault();  // Block key press
    }

function keyDown(event) {
    //up
    if(event.keyCode == 38) {
        if(yVel == 1) {
            return;
        }
        yVel = -1;
        xVel = 0;
    }
    //down
    if(event.keyCode == 40) {
        if(yVel == -1) {
            return;
        }
        yVel = 1;
        xVel = 0;
    }
    //left
    if(event.keyCode == 37) {
        if(xVel == 1) {
            return;
        }
        yVel = 0;
        xVel = -1;
    }
    //right
    if(event.keyCode == 39) {
        if(xVel == -1) {
            return;
        }
        yVel = 0;
        xVel = 1;
    }
}

drawGame();
setInterval(drawGame, 1000/ speed);