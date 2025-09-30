// Boat control variables
const boat = document.getElementById('boat');
const boatReflection = document.getElementById('boatReflection');
const wake = document.getElementById('wake');
const scene = document.getElementById('scene');
const sun = document.getElementById('sun');
const moon = document.getElementById('moon');
const stars = document.getElementById('stars');
const modeToggle = document.getElementById('modeToggle');
const clouds = [document.getElementById('cloud1'), document.getElementById('cloud2')];
const birds = [document.getElementById('bird1'), document.getElementById('bird2'), document.getElementById('bird3')];

let boatPosition = 50; // percentage from left
let boatSpeed = 0;
let targetSpeed = 0;
let isMoving = false;
let isNightMode = false;

// Generate stars
function generateStars() {
    stars.innerHTML = '';
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 60 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
        stars.appendChild(star);
    }
}

generateStars();

// Night mode toggle
modeToggle.addEventListener('click', () => {
    isNightMode = !isNightMode;
    
    if (isNightMode) {
        scene.classList.add('night');
        sun.style.opacity = '0';
        moon.classList.add('visible');
        stars.classList.add('visible');
        modeToggle.textContent = '☀️ Day Mode';
        modeToggle.classList.add('night');
        
        // Hide birds
        birds.forEach(bird => bird.classList.add('night'));
        
        // Hide boat reflection
        boatReflection.classList.add('night');
        
        // Hide clouds completely at night
        clouds.forEach(cloud => cloud.classList.add('night'));
    } else {
        scene.classList.remove('night');
        sun.style.opacity = '1';
        moon.classList.remove('visible');
        stars.classList.remove('visible');
        modeToggle.textContent = '🌙 Night Mode';
        modeToggle.classList.remove('night');
        
        // Show birds
        birds.forEach(bird => bird.classList.remove('night'));
        
        // Show boat reflection
        boatReflection.classList.remove('night');
        
        // Show clouds
        clouds.forEach(cloud => cloud.classList.remove('night'));
    }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            boatPosition = Math.max(10, boatPosition - 3);
            updateBoatPosition();
            break;
        case 'ArrowRight':
            boatPosition = Math.min(90, boatPosition + 3);
            updateBoatPosition();
            break;
        case 'ArrowUp':
            targetSpeed = Math.min(10, targetSpeed + 2);
            updateSpeed();
            break;
        case 'ArrowDown':
            targetSpeed = Math.max(-5, targetSpeed - 2);
            updateSpeed();
            break;
    }
});

function updateBoatPosition() {
    boat.style.left = boatPosition + '%';
    boatReflection.style.left = boatPosition + '%';
    wake.style.left = boatPosition + '%';
}

function updateSpeed() {
    // Smooth speed transition
    const speedInterval = setInterval(() => {
        if (boatSpeed < targetSpeed) {
            boatSpeed += 0.5;
        } else if (boatSpeed > targetSpeed) {
            boatSpeed -= 0.5;
        }
        
        // Show wake when moving
        if (boatSpeed !== 0) {
            isMoving = true;
            wake.classList.add('active');
            createWaterParticles();
        } else {
            isMoving = false;
            wake.classList.remove('active');
        }
        
        if (boatSpeed === targetSpeed) {
            clearInterval(speedInterval);
        }
    }, 50);
}

// Create water particles behind boat
function createWaterParticles() {
    if (!isMoving) return;
    
    const particle = document.createElement('div');
    particle.className = 'water-particle';
    particle.style.left = (boatPosition + Math.random() * 4 - 2) + '%';
    particle.style.bottom = (38 + Math.random() * 2) + '%';
    
    scene.appendChild(particle);
    
    // Animate particle
    let opacity = 0.8;
    let size = 6;
    const particleInterval = setInterval(() => {
        opacity -= 0.02;
        size += 0.2;
        particle.style.opacity = opacity;
        particle.style.width = particle.style.height = size + 'px';
        particle.style.transform = `translateY(${size * 2}px)`;
        
        if (opacity <= 0) {
            clearInterval(particleInterval);
            particle.remove();
        }
    }, 50);
}

// Random wave splashes
setInterval(() => {
    if (Math.random() > 0.7) {
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight * 0.6 + Math.random() * (window.innerHeight * 0.3);
        createSplash(x, y);
    }
}, 3000);

function createSplash(x, y) {
    const splashCount = 5 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < splashCount; i++) {
        const splash = document.createElement('div');
        splash.style.position = 'absolute';
        splash.style.width = '8px';
        splash.style.height = '8px';
        splash.style.background = 'rgba(255, 255, 255, 0.9)';
        splash.style.borderRadius = '50%';
        splash.style.left = (x + Math.random() * 20 - 10) + 'px';
        splash.style.top = y + 'px';
        splash.style.transform = 'translate(-50%, -50%)';
        splash.style.pointerEvents = 'none';
        splash.style.animation = `splash ${0.8 + Math.random() * 0.4}s ease-out forwards`;
        
        document.body.appendChild(splash);
        
        setTimeout(() => {
            splash.remove();
        }, 1200);
    }
}

// Add dynamic CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes splash {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -150%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auto-move boat slightly for ambiance
setInterval(() => {
    if (!isMoving && Math.random() > 0.8) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        boatPosition = Math.max(15, Math.min(85, boatPosition + direction * 2));
        updateBoatPosition();
    }
}, 5000);

// Animate birds with different speeds
birds.forEach((bird, index) => {
    const birdSvg = bird.querySelector('.bird-svg');
    birdSvg.style.animationDuration = (20 + index * 5) + 's';
    birdSvg.style.animationDelay = (index * 8) + 's';
});
