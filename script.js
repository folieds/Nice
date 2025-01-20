// Canvas setup
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game objects
const bike = { x: 100, y: canvas.height / 2, width: 50, height: 50 };
const cars = [];
let gameOver = false;
let score = 0;
let level = 1;
let carFrequency = 0.02;
let carSpeedMultiplier = 1;

// Load images
const bikeImg = new Image();
bikeImg.src = 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Motorcycle_Icon.png'; // Bike image URL

const carImg = new Image();
carImg.src = 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Car-Icon.png'; // Car image URL

// Load bike sound
const bikeSound = new Audio('https://www.soundjay.com/transportation/sounds/motorcycle-ride-1.mp3');
bikeSound.volume = 0.3;

// Generate random cars
function createCar() {
    const car = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 50),
        width: 70,
        height: 50,
        speed: (Math.random() * 5 + 2) * carSpeedMultiplier // Cars get faster with level
    };
    cars.push(car);
}

// Move bike
function moveBike(event) {
    if (event.key === 'ArrowUp' && bike.y > 0) {
        bike.y -= 20;
        playBikeSound();
    }
    if (event.key === 'ArrowDown' && bike.y < canvas.height - bike.height) {
        bike.y += 20;
        playBikeSound();
    }
    if (event.key === 'ArrowLeft' && bike.x > 0) {
        bike.x -= 20;
        playBikeSound();
    }
    if (event.key === 'ArrowRight' && bike.x < canvas.width - bike.width) {
        bike.x += 20;
        playBikeSound();
    }
}

// Play bike sound
function playBikeSound() {
    bikeSound.currentTime = 0; // Reset sound to start
    bikeSound.play();
}

window.addEventListener('keydown', moveBike);

// Collision detection
function checkCollision(bike, car) {
    return (
        bike.x < car.x + car.width &&
        bike.x + bike.width > car.x &&
        bike.y < car.y + car.height &&
        bike.y + bike.height > car.y
    );
}

// Level up function
function levelUp() {
    if (score % 50 === 0) { // Level up every 50 points
        level++;
        carFrequency += 0.005; // Increase car frequency
        carSpeedMultiplier += 0.2; // Increase car speed
        alert(`Level Up! Welcome to Level ${level}`);
    }
}

// Game loop
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bike
    ctx.drawImage(bikeImg, bike.x, bike.y, bike.width, bike.height);

    // Update and draw cars
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        car.x -= car.speed;
        if (car.x + car.width < 0) {
            cars.splice(i, 1);
            score += 10;
            levelUp();
        }
        ctx.drawImage(carImg, car.x, car.y, car.width, car.height);

        if (checkCollision(bike, car)) {
            gameOver = true;
            alert(`Game Over! Your score: ${score}`);
        }
    }

    // Generate new cars
    if (Math.random() < carFrequency) {
        createCar();
    }

    // Display score and level
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Level: ${level}`, 20, 60);

    requestAnimationFrame(updateGame);
}

updateGame();
