const canvas = document.getElementById('weather-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const weatherBox = document.getElementById('weather-box'); //!Getting the weather box element
const weatherType = weatherBox?.dataset.weather || 'Clear'; //!Getting data
const timestamp = parseInt(weatherBox?.dataset.localTime || 0); //!Getting the weather type
const hour = new Date(timestamp * 1000).getUTCHours(); //!Getting the current hour in UTC
const isNight = hour >= 18 || hour < 6; //!Determining the time

function updateBackgroundGradient(hour) {
    let gradient;
    if (hour >= 5 && hour < 8) { //!Morning gradient
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#fcb045"); //!Light orange
        gradient.addColorStop(1, "#fd1d1d"); //!Dark orange
    } else if (hour >= 8 && hour < 17) {
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#87ceeb"); //!Light blue
        gradient.addColorStop(1, "#ffffff"); //!White
    } else if (hour >= 17 && hour < 19) {
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#f2709c"); //!Pink
        gradient.addColorStop(1, "#ff9472"); //!Light pink
    } else {
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#0f2027"); //!Dark blue
        gradient.addColorStop(1, "#203a43"); //!Dark grey
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//?Sun
function drawSun(time) {
    const x = (canvas.width / 2) + Math.sin(time / 10000) * (canvas.width / 3); //!Calculating the position of the sun based on the time
    const y = canvas.height / 3 + Math.sin(time / 5000) * 20; //!Calculating the position of the sun based on the time
    ctx.beginPath(); //!Starting the path for the sun
    ctx.arc(x, y, 40, 0, Math.PI * 2); //!Creating the shape of the sun
    ctx.fillStyle = 'yellow';
    ctx.shadowBlur = 15; 
    ctx.shadowColor = 'gold'; 
    ctx.fill(); //!Drawing the sun
    ctx.shadowBlur = 0; //!Resetting the shadow to avoid affecting other drawings (ChatGPT logic)
}

//?Stars
function drawStars() {
    for (let i = 0; i < 150; i++) { //!Looping to create the stars
        ctx.fillStyle = 'white';
        ctx.beginPath(); //!Starting a path for the star
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1.2, 0, Math.PI * 2); //!Creating a circle for the star
        ctx.fill(); //!Drawing the stars
    }
}

//?Clouds
let clouds = Array.from({ length: 5 }, () => ({
    x: Math.random() * canvas.width, //!Generating the x position of the cloud
    y: Math.random() * canvas.height / 3, //!Generating the y position to be in the top third of the canvas
    speed: Math.random() * 0.5 + 0.2 //!Generating a random speed for the clouds
}));
function drawClouds() {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    clouds.forEach(c => {
        ctx.beginPath(); //!Starting the path for the cloud
        ctx.ellipse(c.x, c.y, 60, 30, 0, 0, Math.PI * 2); //!Creating the cloud shape using ellipses
        ctx.ellipse(c.x + 40, c.y + 10, 50, 25, 0, 0, Math.PI * 2); //!Creating the cloud shape using ellipses
        ctx.ellipse(c.x - 40, c.y + 10, 50, 25, 0, 0, Math.PI * 2); //!Creating the cloud shape using ellipses
        ctx.fill(); //!Drawing the cloud

        c.x += c.speed;
        if (c.x > canvas.width + 100) c.x = -100; //!Resetting the x position of the cloud if it goes off screen
    });
}

//?Rain
let drops = [];
function rain() {
    if (drops.length < 250) {
        drops.push({ x: Math.random() * canvas.width, y: 0, length: Math.random() * 20 + 10, speed: Math.random() * 4 + 4 }); //!Creating the rain drop with random values (ChatGPT Logic)
    }

    ctx.strokeStyle = 'rgba(174,194,224,0.6)';
    ctx.lineWidth = 1;
    drops.forEach(drop => {
        ctx.beginPath(); //!Starting a path for the rain drop
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length); //!Drawing the line for the rain drop
        ctx.stroke(); //!Drawing the rain drops

        drop.y += drop.speed;
        if (drop.y > canvas.height) drop.y = 0; //!Resetting the y position to the top if it gets to the bottom
    });
}

//?Snow
let flakes = []; //!Making an empty array for snowflakes
function snow() {
    if (flakes.length < 150) { //!Making sure we don't overload the screen with snowflakes
        flakes.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 + 1, d: Math.random() + 1 }); //!Creating a snowflake object with random values
    }

    ctx.fillStyle = 'white';
    flakes.forEach(f => { //!Looping through each of the snowflakes
        ctx.beginPath(); //!Starting the path for the snowflake
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); //!Creating the circle for the snowflake
        ctx.fill();

        f.y += f.d; //!Moving the snowflake
        f.x += Math.sin(f.y * 0.01); //!Adding horizontal movement to the snowflake

        if (f.y > canvas.height) { //!If the snowflake goes past the bottom of the screen
            f.y = 0; //!Resetting the y position to the top if it gets to the bottom
            f.x = Math.random() * canvas.width; //!Randomising the x position
        }
    });
}

//?Fog
let fogX = 0;
function fog() {
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; //!Colour settings
    for (let i = 0; i < 10; i++) { //!Looping through a cycle to create multiple fog circles
        ctx.beginPath(); //!Starting a new path for each of the fog circles
        ctx.arc(fogX + i * 100, 150 + Math.sin(fogX / 50 + i) * 20, 80, 0, Math.PI * 2); //!ChatGPT logic for fog circles
        ctx.fill(); //!Drawing the fog circles
    }
    fogX += 0.3;
    if (fogX > canvas.width) fogX = 0; //!Making sure the fog loops around
}

//?Lightning
let lightningTimer = 0;
function lightning() {
    if (Math.random() < 0.01 && lightningTimer === 0) lightningTimer = 5; //!Randomly triggering lightning
    if (lightningTimer > 0) { 
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height); //!Drawing the lightning effect
        lightningTimer--;
    }
}

//?Wind particles
let windParticles = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width, //!Chooses a random x position
    y: Math.random() * canvas.height, //!Chooses a random y position
    r: Math.random() * 2 + 0.5, //!Chooses a random radius for the particle
    speed: Math.random() * 1 + 0.5
}));
function wind() {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    windParticles.forEach(p => {
        ctx.beginPath(); //!Draws the particle
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); //!Creates a circle for the particle based off the values generated earlier
        ctx.fill();
        p.x += p.speed; //!Moving the particle horizontally
        p.y += Math.sin(p.x * 0.01); //!Moving the particle in a sine wave particle (ChatGPT logic)
        if (p.x > canvas.width) {
            p.x = 0; 
            p.y = Math.random() * canvas.height; //!Regenerating the particle when it gets past a position
        }
    });
}

function animate(time = 0) {
    updateBackgroundGradient(hour);

    if (weatherType === "Clear" && !isNight) drawSun(time);
    if (weatherType === "Clear" && isNight) drawStars();

    if (["Clouds", "Fog", "Rain", "Snow", "Thunderstorm"].includes(weatherType)) drawClouds();
    if (weatherType === "Rain") rain();
    if (weatherType === "Snow") snow();
    if (weatherType === "Fog") fog();
    if (weatherType === "Thunderstorm") {
        rain();
        lightning();
    }

    wind(); //!This makes sure that the wind particles are always drawn

    requestAnimationFrame(animate);
}

animate();
