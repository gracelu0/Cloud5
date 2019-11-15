var config = {
    type: Phaser.WEBGL,
    width: 950,
    height: 600,
    parent: 'phaser',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var map;
var collideLayer;
var groundLayer;
var bridgeLayer;
var player;
var bullets;
var bulletInitX;
var bulletInitY;
var shootButton;
var lastFired = 0;
var facing = 1;
var ammunition = 45;
var muteSoundFlag = 0;
var bgmusic;
var shootSound;

function preload(){
    
    this.load.image('RPGpack', 'assets/RPGpack_sheet.png');
    this.load.image('overworld', 'assets/overworld.png');
    this.load.image('combinedTiles', 'assets/combinedTiles.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    
    this.load.image('testingmap', 'assets/testSheet.png');
    this.load.image('test2', 'assets/tileSheet1.png');
    this.load.image('player','assets/alienPink.png');
    this.load.image('bulletImg','assets/testBullet.png');

    this.load.image('healthbar_green', 'assets/healthbar_green.png');
    this.load.image('healthbar_red', 'assets/healthbar_red.png')
    
    this.load.image('rain', 'assets/rain.png');
    this.load.image('snow', 'assets/snowflake-pixel.png');

    this.load.audio('bgmusic', 'assets/audio/bgmusic.mp3');
    this.load.audio('shootSound', 'assets/audio/shoot.mp3');
}

class Bullet extends Phaser.Physics.Arcade.Sprite{
    constructor(scene){
        super(scene, player.x, player.y, 'bulletImg');
        scene.add.existing(this);
        scene.physics.world.enable(this);
        if(facing == 1){
            this.xSpeed = Phaser.Math.GetSpeed(0,1);
            this.ySpeed = Phaser.Math.GetSpeed(-400,1);
        } 
        else if(facing == 2){
            this.xSpeed = Phaser.Math.GetSpeed(0,1);
            this.ySpeed = Phaser.Math.GetSpeed(400,1);
        }
        else if(facing == 3){
            this.xSpeed = Phaser.Math.GetSpeed(-400,1);
            this.ySpeed = Phaser.Math.GetSpeed(0,1);
        }
        else if(facing == 4){
            this.xSpeed = Phaser.Math.GetSpeed(400,1);
            this.ySpeed = Phaser.Math.GetSpeed(0,1);
        }
    }
    fire(x,y){
        this.setPosition(x,y + 30);
        this.bulletInitX = x;
        this.bulletInitY = y;
        this.setActive(true);
        this.setVisible(true);
    }
    update(time, delta){
        if(this){
            this.x += this.xSpeed * delta;
            this.y += this.ySpeed * delta;
            this.setPosition(this.x, this.y);
        }


        if(this.x > this.bulletInitX + 500 || this.x < this.bulletInitX - 500 || this.y > this.bulletInitY + 500 || this.y < this.bulletInitY - 500){
            this.destroy();
        }
    }

}

async function create(){
    map = this.add.tilemap('map');
    var groundTiles = map.addTilesetImage('RPGpack');
    var bridgeTiles = map.addTilesetImage('overworld');
    var combinedTiles = map.addTilesetImage('combinedTiles');
    groundLayer = map.createStaticLayer('Below Player', combinedTiles, 0, 0);
    bridgeLayer = map.createStaticLayer('Overworld', bridgeTiles,0,0);
    collideLayer = map.createStaticLayer('World', combinedTiles, 0, 0);

    //set boundaries of game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    //collideLayer.setCollisionByProperty({collides:true});
    //this.physics.add.collider(player,collideLayer);
    //map.setCollisionByExclusion([],true,collideLayer);

    //set boundaries of game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    //add player
    player = this.physics.add.sprite(100,300,'player');
    player.setBounce(0.2);
    player.health = 100;

    healthbar_red = this.physics.add.sprite(player.body.position.x, player.body.position.y, 'healthbar_red');
    healthbar_green = this.physics.add.sprite(player.body.position.x, player.body.position.y, 'healthbar_green');
    healthbar_green.setScale(.4);
    healthbar_red.setScale(.4);
    healthbar_red.displayWidth = (player.health/100) * 100;

    player2 = this.physics.add.sprite(400,400,'player');
    player2.health = 100;
    player2.setBounce(0.2);

    healthbar2_red = this.physics.add.sprite(player2.body.position.x, player2.body.position.y, 'healthbar_red');
    healthbar2_green = this.physics.add.sprite(player2.body.position.x, player.body.position.y, 'healthbar_green');
    healthbar2_green.setScale(.4);
    healthbar2_red.setScale(.4);
    healthbar2_red.displayWidth = (player.health/100) * 100;

    bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 5,
        runChildUpdate: true
    }); 
    bullets.enable = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    //set collisions between player and world
    player.setCollideWorldBounds(true);
    map.setCollisionBetween(1,999,true,collideLayer);

    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // collideLayer.renderDebug(debugGraphics, {
    //     tileColor: null, // Color of non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    //set player movement input
    cursors = this.input.keyboard.createCursorKeys();
    
    camera = this.cameras.main;

    
    muteMusic = this.add.text(0, 0, 'Music', {fill: '#ffffff'});
    muteMusic.setInteractive();
    muteSound = this.add.text(0, 0, 'Sound', {fill: '#ffffff'});
    muteSound.setInteractive();
    

    ammoCount = this.add.text(0,0,"Ammunition Count:" + ammunition +"/45");

    //set bounds for camera (game world)
    camera.setBounds(0,0,map.widthInPixels, map.heightInPixels);
    //camera.setZoom(1.2);
    //make camera follow player
    camera.startFollow(player);

    if(navigator.onLine){
        
        const ipRequest = await fetch('https://json.geoiplookup.io/');
        const ipResponse = await ipRequest.json();

        const weatherRequest = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' 
                                            + ipResponse.city + ',' + ipResponse.country_code + '&appid=fa452ec635e9759a07cab7433d42104f');
        const weatherResponse = await weatherRequest.json();

        // For debugging only - will move inside if statement when it works!
        //var rainParticles = this.add.particles('rain');
        // addRain(rainParticles, map.widthInPixels, map.heightInPixels);
        // addDrizzle(rainParticles, map.widthInPixels, map.heightInPixels);

        // var snowParticles = this.add.particles('snow');
        // addSnow(snowParticles, map.widthInPixels, map.heightInPixels);

        if(weatherResponse.weather[0].main == "Rain"){

        }

        else if(weatherResponse.weather[0].main == "Drizzle"){

        }

        else if(weatherResponse.weather[0].main == "Snow"){
            
        }
    }

    shootSound = this.sound.add('shootSound');
    bgmusic = this.sound.add('bgmusic');

    muteSound.on('pointerdown', () => {
        if(muteSoundFlag == 0) {
            muteSoundFlag = 1;
        }
        else {
            muteSoundFlag = 0;
        }
    });

    muteMusic.on('pointerdown', () => {
        if(bgmusic.isPaused) { 
            bgmusic.resume();
        }
        else {
            bgmusic.pause();
        }
    })

    bgmusic.play();
    bgmusic.loop = true;

}

function update(time, delta){

    if(player.health > 0) {
        healthbar_green.displayWidth = (player.health/100)*100;
        healthbar_green.x = player.body.position.x + 12;
        healthbar_green.y = player.body.position.y - 20;
        healthbar_red.x = player.body.position.x + 12;
        healthbar_red.y = player.body.position.y - 20;
    }

    if(player2.health > 0) {
        healthbar2_green.displayWidth = (player2.health/100)*100;
        healthbar2_green.x = player2.body.position.x + 12;
        healthbar2_green.y = player2.body.position.y - 20;
        healthbar2_red.x = player2.body.position.x + 12;
        healthbar2_red.y = player2.body.position.y - 20;
    }

    if (cursors.up.isDown){
        player.body.position.y -=4;
        facing = 1;
    }
    if (cursors.down.isDown){
        player.body.position.y +=4;
        facing = 2;
    }
    if (cursors.left.isDown){
        player.body.position.x -=4;
        facing = 3;
    }
    if (cursors.right.isDown){
        player.body.position.x +=4;
        facing = 4;
    }

    if(player.body.position.x - 455 > 0 && player.body.position.x + 495 < groundLayer.width){
        ammoCount.x = player.body.position.x - 455;
        muteSound.x = player.body.position.x - 455;
        muteMusic.x = player.body.position.x - 455;
    }
    if(player.body.position.y - 265 > 0 && player.body.position.y + 335 < groundLayer.height){
        ammoCount.y = player.body.position.y - 245;
        muteSound.y = player.body.position.y - 285;
        muteMusic.y = player.body.position.y - 265;
    }

    if (cursors.space.isDown && time > lastFired && ammunition > 0){
        var bullet = bullets.get();

        if(bullet){
            if(muteSoundFlag == 0) {
                shootSound.play();
            }
            bullet.fire(player.body.position.x, player.body.position.y);

            lastFired = time + 200;

            ammunition --;

            ammoCount.setText("Ammunition Count:" + ammunition +"/45");
        }
    }

    
    this.physics.collide(player,collideLayer)

    bullets.getChildren().forEach(child => {
        if(this.physics.collide(child, player2, bulletCollision)){
            console.log("3");
        }
    })

    if(player2.health <= 0){
        playerDeath(player2);
    }

}

bulletCollision = function(bullets, hitPlayer){
    bullets.destroy();
    hitPlayer.health -= 10;
    console.log(hitPlayer.health);
}

playerDeath = function(deadPlayer){
    deadPlayer.destroy();
    healthbar2_red.destroy();
    healthbar2_green.destroy();
}

// function decrease(player, amount) {
//     player.health -= amount;
// }