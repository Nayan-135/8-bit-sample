// Select the canvas and set its dimensions
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 480;
canvas.height = 320;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Player properties
const player = {
  x: 50,
  y: 250,
  width: 16,
  height: 16,
  color: "blue",
  speed: 2,
  dx: 0,
  dy: 0,
  gravity: 0.5,
  jumpPower: -7,
  onGround: false,
};

const platforms = [
  { x: 100, y: 280, width: 80, height: 10 },
  { x: 200, y: 220, width: 80, height: 10 },
  { x: 300, y: 180, width: 80, height: 10 }
];

const enemy = { x: 300, y: 250, width: 16, height: 16, color: "red", dx: 1 };
let score = 0;

function keyDownHandler(e) {
  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === "ArrowUp" && player.onGround) {
    player.dy = player.jumpPower;
    player.onGround = false;
  }
}

function keyUpHandler(e) {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") player.dx = 0;
}

function update() {
  player.x += player.dx;
  player.y += player.dy;
  player.dy += player.gravity;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  
  checkCollision();
  moveEnemy();
  checkEnemyCollision();
  updateScore();
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = "brown";
  platforms.forEach((platform) => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

function drawEnemy() {
  ctx.fillStyle = enemy.color;
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function checkCollision() {
  player.onGround = false;
  platforms.forEach((platform) => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height > platform.y &&
      player.y + player.height < platform.y + 10
    ) {
      player.y = platform.y - player.height;
      player.dy = 0;
      player.onGround = true;
    }
  });
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.onGround = true;
  }
}

function moveEnemy() {
  enemy.x += enemy.dx;
  if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
    enemy.dx *= -1;
  }
}

function checkEnemyCollision() {
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    alert("Game Over! Your score: " + score);
    document.location.reload();
  }
}

function updateScore() {
  score++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlatforms();
  drawPlayer();
  drawEnemy();
  drawScore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
