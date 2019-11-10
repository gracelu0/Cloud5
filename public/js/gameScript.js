var config = {
    type: Phaser.AUTO,
    width: 950,
    height: 600,
    parent: 'phaser',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload(){
    
    this.load.image('RPGpack', 'assets/RPGpack_sheet.png');
    this.load.image('overworld', 'assets/overworld.png');
    this.load.tilemapTiledJSON('map', 'assets/bbmap.json');

    
    this.load.image('testingmap', 'assets/testSheet.png');
    this.load.image('test2', 'assets/tileSheet1.png');
    this.load.image('player','assets/alienPink.png');

    this.load.image('rain', 'assets/rain.png');
}

async function create(){
    map = this.add.tilemap('map');
    var groundTiles = map.addTilesetImage('RPGpack');
    var bridgeTiles = map.addTilesetImage('overworld');
    groundLayer = map.createStaticLayer('Below Player', groundTiles, 0, 0);
    bridgeLayer = map.createStaticLayer('Below Player 2', bridgeTiles,0,0);
    collideLayer = map.createStaticLayer('World', groundTiles, 0, 0);

    //set boundaries of game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;


    player = this.physics.add.sprite(200,400,'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    collideLayer.setCollisionBetween(200,240);

    //collideLayer.setCollisionByProperty({collides:true});
    this.physics.add.collider(collideLayer,player);

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    collideLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    cursors = this.input.keyboard.createCursorKeys();
    //set bounds for camera (game world)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    //make camera follow player
    this.cameras.main.startFollow(player);

    if(navigator.onLine){
        
        const ipRequest = await fetch('https://json.geoiplookup.io/');
        const ipResponse = await ipRequest.json();

        const weatherRequest = await fetch('http://api.openweathermap.org/data/2.5/weather?q=' 
                                            + ipResponse.city + ',' + ipResponse.country_code + '&appid=fa452ec635e9759a07cab7433d42104f');
        const weatherResponse = await weatherRequest.json();

        // For debugging only
        var particles = this.add.particles('rain');
        particles.createEmitter({
            x: { min: 0, max: map.widthInPixels },
            y: { min: 0, max: map.heightInPixels },
            z: { min: 0, max: 20 },
            lifespan: 4000,
            speedX: { min: -100, max: -50 },
            speedY: { min: 300, max: 500 },
            speedZ: { min: 200, max: 400 },
            scale: { start: .8, end: 0 },
            quantity: 10,
            blendMode: 'NORMAL'
        });

        if(weatherResponse.weather[0].main == "Drizzle" || weatherResponse.weather[0].main == "Rain"){
        }
    }

}

function update(){

    if (cursors.up.isDown){
        player.y -=4;
    }
    if (cursors.down.isDown){
        player.y +=4;
    }
    if (cursors.left.isDown){
        player.x -=4;
    }
    if (cursors.right.isDown){
        player.x +=4;
    }
}
