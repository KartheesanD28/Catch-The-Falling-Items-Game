const basket = document.getElementById('basket');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
let score = 0;
let lives = 3;  // Start with 3 lives
let basketPosition = 150;
let fallingItems = [];
let gameInterval;
let fallingInterval;

function updateScore() {
    scoreDisplay.innerText = `Score: ${score}`;
}

function updateLives() {
    // Update the lives display by hiding hearts based on remaining lives
    const hearts = livesDisplay.querySelectorAll('.heart');
    for (let i = 0; i < hearts.length; i++) {
        if (i < lives) {
            hearts[i].style.visibility = 'visible'; // Show the heart
        } else {
            hearts[i].style.visibility = 'hidden'; // Hide the heart
        }
    }
}

function moveBasket(e) {
    if (e.key === 'ArrowLeft' && basketPosition > 0) {
        basketPosition -= 10;
    }
    if (e.key === 'ArrowRight' && basketPosition < gameArea.clientWidth - basket.clientWidth) {
        basketPosition += 10;
    }
    basket.style.left = basketPosition + 'px';
}

function spawnFallingItem() {
    const item = document.createElement('div');
    item.classList.add('falling-item');
    item.style.left = Math.random() * (gameArea.clientWidth - 30) + 'px';
    gameArea.appendChild(item);
    fallingItems.push(item);
}

function moveFallingItems() {
    for (let i = 0; i < fallingItems.length; i++) {
        const item = fallingItems[i];
        let itemTop = parseInt(item.style.top) || 0;
        itemTop += 5;
        item.style.top = itemTop + 'px';

        if (itemTop > gameArea.clientHeight) {
            // Item missed, lose a life
            gameArea.removeChild(item);
            fallingItems.splice(i, 1);
            i--;
            lives--;  // Decrease a life
            updateLives();
            
            if (lives <= 0) {
                endGame();
            }
        } else if (
            itemTop > gameArea.clientHeight - basket.clientHeight &&
            item.offsetLeft + item.clientWidth > basketPosition &&
            item.offsetLeft < basketPosition + basket.clientWidth
        ) {
            // Item caught
            gameArea.removeChild(item);
            fallingItems.splice(i, 1);
            i--;
            score++;
            updateScore();
        }
    }
}

function startGame() {
    score = 0;
    lives = 3;
    updateScore();
    updateLives();
    fallingItems = [];
    gameInterval = setInterval(moveFallingItems, 50);
    fallingInterval = setInterval(spawnFallingItem, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(fallingInterval);
    alert(`Game Over! Your final score is ${score}`);
    score = 0;
    lives = 3;
    updateScore();
    updateLives();
    fallingItems.forEach(item => gameArea.removeChild(item));
    fallingItems = [];
}

// Start the game on key press
document.addEventListener('keydown', moveBasket);

// Start the game immediately
startGame();
