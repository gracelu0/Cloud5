function addRain(rainParticles, mapWidth, mapHeight){
    var maxSpeedY = 500;
    var maxLifeSpan = mapHeight/maxSpeedY * 1000; 
    rainParticles.createEmitter({
        x: { min: 0, max: mapWidth },
        y: 0,
        lifespan: maxLifeSpan,
        cycle: true,
        speedX: { min: -50, max: 0 },
        speedY: { min: 300, max: maxSpeedY },
        scale: 1,
        quantity: 20,
        blendMode: 'NORMAL',
    });
}

function addDrizzle(rainParticles, mapWidth, mapHeight){
    var maxSpeedY = 1000;
    var maxLifeSpan = mapHeight/maxSpeedY * 1000;
    rainParticles.createEmitter({
        x: { min: 0, max: mapWidth },
        y: 0,
        lifespan: maxLifeSpan,
        speedX: { min: -50, max: 0 },
        speedY: { min: 800, max: mapHeight },
        scale: .5,
        quantity: 30,
        blendMode: 'NORMAL'
    });
}

function addSnow(snowParticles, mapWidth, mapHeight){
    var maxSpeedY = 300;
    var maxLifeSpan = mapHeight/maxSpeedY * 1000;
    snowParticles.createEmitter({
        x: { min: 0, max: mapWidth },
        y: 0,
        lifespan: maxLifeSpan,
        speedX: { min: -100, max: 5 },
        speedY: { min: 100, max: maxSpeedY },
        scale: .5,
        quantity: 5,
        blendMode: 'NORMAL'
    });
}

function changeAtmos(gameObj, fog, atmosMode){
    var alphaMax;
    if (atmosMode == "foggy")
        alphaMax=.5;
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