const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

function teleportSnake() {
    if (headX < 0) {
        headX = tileCount - 1;
    } else if (headX >= tileCount) {
        headX = 0;
    }

    if (headY < 0) {
        headY = tileCount - 1;
    } else if (headY >= tileCount) {
        headY = 0;
    }
}

function drawGame() {
    changeSnakePosition();
    let result = isGameOver();
    if (result) {
        return;
    }

    clearScreen();

    checkAppleCollision();
    drawApple();
    drawSnake();

    drawScore();

    if (score > 2) {
        speed = 11;
    }
    if (score > 5) {
        speed = 15;
    }

    setTimeout(drawGame, 1000 / speed);
}

function drawRestartButton() {
    const buttonWidth = 100;
    const buttonHeight = 30;
    const centerX = canvas.width / 2 - buttonWidth / 2;
    const centerY = canvas.height / 1.8 - buttonHeight / 2;

    ctx.fillStyle = 'red';
    ctx.fillRect(centerX, centerY, buttonWidth, buttonHeight);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '20px Verdana';
    ctx.fillText('Restart', centerX + buttonWidth / 2, centerY + buttonHeight / 2);
}

canvas.addEventListener('mousemove', function(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    const buttonWidth = 100;
    const buttonHeight = 40;
    const centerX = canvas.width / 2 - buttonWidth / 2;
    const centerY = canvas.height / 1.8 - buttonHeight / 2;

    if (mouseX > centerX && mouseX < centerX + buttonWidth &&
        mouseY > centerY && mouseY < centerY + buttonHeight) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
});

function isGameOver() {
    let gameOver = false;

    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '50px Verdana';
        ctx.fillText('Game Over!', canvas.width / 6.5, canvas.height / 2);

        drawRestartButton();

        canvas.addEventListener('click', restartGame, false);

        return true;
    }

    teleportSnake();

    return false;
}

function restartGame(event) {
    let x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    if (x > canvas.width / 2 - 50 && x < canvas.width / 2 + 50 &&
        y > canvas.height / 1.8 && y < canvas.height / 1.8 + 40) {
        document.location.reload();
    }
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    snakeParts.push(new SnakePart(headX, headY));
    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }
    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function SnakePart(x, y) {
    this.x = x;
    this.y = y;
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
    if (appleX === headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
    }
}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '10px Verdana';
    ctx.fillText('Score ' + score, canvas.width - 50, 10);
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    if (event.keyCode == 38) {
        if (yVelocity == 1)
            return;
        yVelocity = -1;
        xVelocity = 0;
    }

    if (event.keyCode == 40) {
        if (yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }

    if (event.keyCode == 37) {
        if (xVelocity == 1)
            return;
        yVelocity = 0;
        xVelocity = -1;
    }

    if (event.keyCode == 39) {
        if (xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;
    }
}

drawGame();