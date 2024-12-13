const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = canvas.width;

let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let direction = { x: 0, y: 0 };
let apple = spawnApple();
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Update high score display
document.getElementById('highScore').textContent = highScore;

document.addEventListener('keydown', changeDirection);

function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        alert(`Game Over! I bet Prof. Gaskin could do better!! Your Score: ${score}`);
        resetGame();
    } else {
        if (eatApple()) {
            growSnake();
            apple = spawnApple();
            score++;
            document.getElementById('currentScore').textContent = score;
            if (score > highScore) {
                highScore = score;
                document.getElementById('highScore').textContent = highScore;
            }
        }
        drawGame();
    }
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x * gridSize, y: snake[0].y + direction.y * gridSize };
    snake.unshift(head);
    snake.pop();
}

function changeDirection(event) {
    const keyPressed = event.key;
    if (keyPressed === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    else if (keyPressed === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    else if (keyPressed === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    else if (keyPressed === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
}

function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, gridSize, gridSize);
}

function spawnApple() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

function eatApple() {
    return snake[0].x === apple.x && snake[0].y === apple.y;
}

function growSnake() {
    const tail = { ...snake[snake.length - 1] };
    snake.push(tail);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) return true;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

function resetGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    apple = spawnApple();
    score = 0;
    document.getElementById('currentScore').textContent = score;
}

setInterval(gameLoop, 100);
