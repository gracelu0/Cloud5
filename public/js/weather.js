class weather{
    constructor(game){
        this.game = game;
    }
    addRain(){
        let rain = this.game.add.bitmapData(15, 50);

        rain.ctx.rect(0, 0, 15, 50);
        rain.ctx.fillStyle = '#9cc9de';
        rain.ctx.fill();

        this.emitter = this.game.add.emitter(this.game.world.centerX, -300, 400);

        this.emitter.width = this.game.world.width;
        this.emitter.angle = 30;

        this.emitter.makeParticles(rainP);

        this.emitter.minParticleScale = 0.1;
        this.emitter.maxParticleScale = 0.3;

        this.emitter.setYSpeed(600, 1000);
        this.emitter.setXSpeed(-5, 5);

        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;

        this.emitter.start(false, 1600, 5, 0);
    }
}

export default weather;