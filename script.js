const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;

let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];

let dx = gridSize;
let dy = 0;

let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameOver = false;
let paused = false;

let food;


// High score
document.getElementById("highScore").textContent = highScore;


// Create food
function createFood() {

    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };

    for (let part of snake) {

        if (food.x === part.x && food.y === part.y) {
            createFood();
            return;
        }
    }
}


// Draw snake
function drawSnake() {

    snake.forEach((part, index) => {

        ctx.fillStyle = index === 0 ? "#39ff14" : "#16a34a";

        ctx.beginPath();

        ctx.roundRect(
            part.x + 1,
            part.y + 1,
            gridSize - 2,
            gridSize - 2,
            5
        );

        ctx.fill();

        // Eyes
        if (index === 0) {

            ctx.fillStyle = "white";

            ctx.beginPath();
            ctx.arc(part.x + 6, part.y + 6, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(part.x + 14, part.y + 6, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "black";

            ctx.beginPath();
            ctx.arc(part.x + 6, part.y + 6, 1, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(part.x + 14, part.y + 6, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}


// Draw food
function drawFood() {

    ctx.fillStyle = "#ff3030";

    ctx.beginPath();

    ctx.arc(
        food.x + 10,
        food.y + 11,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#39ff14";

    ctx.beginPath();

    ctx.ellipse(
        food.x + 14,
        food.y + 3,
        4,
        2,
        -0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// Move snake
function moveSnake() {

    if (gameOver) return;

    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };


    // Edge wrapping
    if (head.x < 0) {
        head.x = canvas.width - gridSize;
    }

    if (head.x >= canvas.width) {
        head.x = 0;
    }

    if (head.y < 0) {
        head.y = canvas.height - gridSize;
    }

    if (head.y >= canvas.height) {
        head.y = 0;
    }


    // Self collision
    for (let i = 0; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {
            endGame();
            return;
        }
    }


    snake.unshift(head);


    // Food
    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score += 10;

        document.getElementById("score").textContent = score;

        createFood();

    } else {

        snake.pop();
    }
}


// Controls
document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    if (key === "arrowup" || key === "w") {

        if (dy === 0) {
            dx = 0;
            dy = -gridSize;
        }
    }

    if (key === "arrowdown" || key === "s") {

        if (dy === 0) {
            dx = 0;
            dy = gridSize;
        }
    }

    if (key === "arrowleft" || key === "a") {

        if (dx === 0) {
            dx = -gridSize;
            dy = 0;
        }
    }

    if (key === "arrowright" || key === "d") {

        if (dx === 0) {
            dx = gridSize;
            dy = 0;
        }
    }
});


// Game over
function endGame() {

    gameOver = true;

    if (score > highScore) {

        highScore = score;

        localStorage.setItem("snakeHighScore", highScore);

        document.getElementById("highScore").textContent = highScore;
    }

    document.getElementById("finalScore").textContent = score;

    document.getElementById("gameOver").classList.remove("hidden");
}


// Restart
document.getElementById("restartBtn").addEventListener("click", function() {

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    dx = gridSize;
    dy = 0;

    score = 0;
    gameOver = false;

    document.getElementById("score").textContent = score;

    document.getElementById("gameOver").classList.add("hidden");

    createFood();
});


// Game loop
function gameLoop() {

    ctx.fillStyle = "#050505";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!paused) {
        moveSnake();
    }

    drawFood();
    drawSnake();
}


// Start
createFood();

setInterval(gameLoop, 150);

// Pause button
document.getElementById("pauseBtn").addEventListener("click", function() {

    if (gameOver) {
        return;
    }

    paused = !paused;

    if (paused) {
        this.textContent = "▶️ RESUME";
    } else {
        this.textContent = "⏸️ PAUSE";
    }
});