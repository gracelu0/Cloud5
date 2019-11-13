function addRain(rainParticles, gameWidth){
    rainParticles.createEmitter({
        x: { min: 0, max: gameWidth },
        y: 0,
        lifespan: 4500,
        speedX: { min: -50, max: 0 },
        speedY: { min: 300, max: 500 },
        scale: 1,
        quantity: 10,
        blendMode: 'NORMAL',
    });
}

function addDrizzle(rainParticles, gameWidth){
    rainParticles.createEmitter({
        x: { min: 0, max: gameWidth },
        y: 0,
        lifespan: 2000,
        speedX: { min: -50, max: 0 },
        speedY: { min: 800, max: 1000 },
        scale: .5,
        quantity: 20,
        blendMode: 'NORMAL'
    });
}

function addSnow(snowParticles, gameWidth){
    snowParticles.createEmitter({
        x: { min: 0, max: gameWidth },
        y: 0,
        lifespan: 7000,
        speedX: { min: -100, max: 5 },
        speedY: { min: 100, max: 300 },
        scale: .5,
        quantity: 5,
        blendMode: 'NORMAL'
    });
}

function changeAtmos(gameObj, fog, atmosMode){
    if (atmosMode == "foggy")
        alphaMax=.6;
    if (atmosMode == "Misty")
        alphaMax=.4;
    if (atmosMode == "Hazy")
        alphaMax=.2;
    
    gameObj.tweens.add({
        targets: fog,
        alpha: { value: alphaMax, duration: 5000, ease: 'Power1' },
        repeat: 0,
    });

    gameObj.tweens.add({
        targets: fog,
        x: 1400,
        ease: 'linear',
        duration: 2000,
        delay: 0,
        repeat: Infinity,
        yoyo: true
    });
}