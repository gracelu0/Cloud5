function addRain(rainParticles, gameWidth, gameHeight){
    rainParticles.createEmitter({
        x: { min: -100, max: map.widthInPixels },
        y: -100,
        z: { min: 0, max: 20 },
        lifespan: 20000,
        speedX: { min: -50, max: 0 },
        speedY: { min: 300, max: 500 },
        speedZ: { min: 200, max: 400 },
        scale: { start: .8, end: 0 },
        quantity: 10,
        blendMode: 'NORMAL'
    });
}

function addRain(rainParticles, gameWidth, gameHeight){
    rainParticles.createEmitter({
        x: { min: -100, max: map.widthInPixels },
        y: -100,
        z: { min: 0, max: 20 },
        lifespan: 20000,
        speedX: { min: -50, max: 0 },
        speedY: { min: 800, max: 1000 },
        speedZ: { min: 200, max: 400 },
        scale: { start: .4, end: 0 },
        quantity: 20,
        blendMode: 'NORMAL'
    });
}

function addSnow(snowParticles){
    snowParticles.createEmitter({
        x: { min: -100, max: map.widthInPixels },
        y: -100,
        z: { min: 0, max: 20 },
        lifespan: 20000,
        speedX: { min: -100, max: 5 },
        speedY: { min: 100, max: 300 },
        speedZ: { min: 100, max: 200 },
        scale: { start: .5, end: 0 },
        quantity: 5,
        blendMode: 'NORMAL'
    });
}