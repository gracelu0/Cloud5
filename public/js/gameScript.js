var config = {
<<<<<<< HEAD
  type: Phaser.WEBGL,
  width: 950,
  height: 600,
  parent: 'phaser',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0},
      debug: true
=======
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
>>>>>>> 917744d1a4342774f89505d25463b182b2784e45
    }
  },
  scene: {
    key: 'main',
    preload: preload,
    create: create,
    update: update
  }
}

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
var lastBomb = 0;
var facing = 1;
<<<<<<< HEAD
var ammunition = 10;
var x;
var y;

// Parameters to control rain/drizzle
// var rainFlag = false; var isRaining = false;
// var drizzleFlag = false; var isDrizzling = false;
// var rainParticles;
// Functions to control rain/drizzle parameters
// function updateRainFlag(){
//     rainFlag = !rainFlag;
// }
// function updateIsRaining(){
//     isRaining = !isRaining;
// }
// function updateDrizzleFlag(){
//     drizzleFlag = !drizzleFlag;
// }
// function updateIsDrizzling(){
//     isDrizzling = !isDrizzling;
// }
// Update Buttons in the game and rain/drizzle status
// document.querySelector("[id='toggleRain']").addEventListener('click', function(){
//     updateRainFlag();
//     if (document.querySelector("[id='toggleRain']").innerHTML == "RAIN ON")
//         document.querySelector("[id='toggleRain']").innerHTML = "RAIN OFF";
//     else
//         document.querySelector("[id='toggleRain']").innerHTML = "RAIN ON";
// });
// document.querySelector("[id='toggleDrizzle']").addEventListener('click', function(){
//     updateDrizzleFlag();
//     if (document.querySelector("[id='toggleDrizzle']").innerHTML == "DRIZZLE ON")
//         document.querySelector("[id='toggleDrizzle']").innerHTML = "DRIZZLE OFF";
//     else
//         document.querySelector("[id='toggleDrizzle']").innerHTML = "DRIZZLE ON";
// });
// Parameters to control snow
// var snowFlag = false; var isSnowing = false;
// var snowParticles;
// // Functions to control snow parameters
// function updateSnowFlag(){
//     snowFlag = !snowFlag;
// }
// function updateIsSnowing(){
//     isSnowing = !isSnowing;
// }
// // Update Buttons in the game and snow status
// document.querySelector("[id='toggleSnow']").addEventListener('click', function(){
//     updateSnowFlag();
//     if (document.querySelector("[id='toggleSnow']").innerHTML == "SNOW ON")
//         document.querySelector("[id='toggleSnow']").innerHTML = "SNOW OFF";
//     else
//         document.querySelector("[id='toggleSnow']").innerHTML = "SNOW ON";
// });
// Parameters to control fog/mist/haze
// var fogFlag = false; var isFoggy = false;
// var mistFlag = false; var isMisty = false;
// var hazeFlag = false; var isHazy = false;
// var fog;
// Functions to control fog/mist/haze parameters
// function updateFogFlag(){
//     fogFlag = !fogFlag;
// }
// function updateIsFoggy(){
//     isFoggy = !isFoggy;
// }
// function updateMistFlag(){
//     mistFlag = !mistFlag;
// }
// function updateIsMisty(){
//     isMisty = !isMisty;
// }
// function updateHazeFlag(){
//     hazeFlag = !hazeFlag;
// }
// function updateIsHazy(){
//     isHazy = !isHazy;
// }
// Update Buttons in the game and fog/mist/haze status
// document.querySelector("[id='toggleFog']").addEventListener('click', function(){
//     updateFogFlag();
//     if (document.querySelector("[id='toggleFog']").innerHTML == "FOG ON")
//         document.querySelector("[id='toggleFog']").innerHTML = "FOG OFF";
//     else
//         document.querySelector("[id='toggleFog']").innerHTML = "FOG ON";
// });
// document.querySelector("[id='toggleMist']").addEventListener('click', function(){
//     updateMistFlag();
//     if (document.querySelector("[id='toggleMist']").innerHTML == "MIST ON")
//         document.querySelector("[id='toggleMist']").innerHTML = "MIST OFF";
//     else
//         document.querySelector("[id='toggleMist']").innerHTML = "MIST ON";
// });
// document.querySelector("[id='toggleHaze']").addEventListener('click', function(){
//     updateHazeFlag();
//     if (document.querySelector("[id='toggleHaze']").innerHTML == "HAZE ON")
//         document.querySelector("[id='toggleHaze']").innerHTML = "HAZE OFF";
//     else
//         document.querySelector("[id='toggleHaze']").innerHTML = "HAZE ON";
// });

//parameters to control music+sound
var bgmusic;
var shootSound;
var musicFlag = true;
var soundFlag = true;

var musicButton = document.querySelector("[id='music']");
var soundButton = document.querySelector("[id='sound']");

// parameters to control weather
var currentWeather;
var weatherFlag = false; var weatherToggle = false;
var rainParticles; var snowParticles; var fog;

// Functions to control weather parameters
function updateWeatherFlag(){
  weatherFlag = !weatherFlag;
}
function updateWeatherToggle(){
  weatherToggle = !weatherToggle;
}

// Variable for weather button
var weatherButton = document.querySelector("[id='toggleWeather']");

async function fetchWeather(){
    const ipRequest = await fetch('https://json.geoiplookup.io/');
    const ipResponse = await ipRequest.json();
    const weatherRequest = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' 
                                        + ipResponse.city + ',' + ipResponse.country_code + '&appid=fa452ec635e9759a07cab7433d42104f');
    const weatherResponse = await weatherRequest.json();

    // Control Weather button and weather status
    // based on current weather condition
    if (weatherResponse.weather[0].main == "Rain" ||
        weatherResponse.weather[0].main == "Drizzle" ||
        weatherResponse.weather[0].main == "Snow" ||
        weatherResponse.weather[0].main == "Haze" ||
        weatherResponse.weather[0].main == "Mist" ||
        weatherResponse.weather[0].main == "Fog" 
        // || weatherResponse.weather[0].main == "Clouds"
        ){
          weatherButton.removeAttribute("hidden");
          weatherButton.addEventListener('click', function(){
            updateWeatherFlag();
            if (weatherButton.innerHTML == "WEATHER ON")
              weatherButton.innerHTML = "WEATHER OFF";
            else
              weatherButton.innerHTML = "WEATHER ON";
          });
          weatherFlag = true; weatherToggle = true;
          weatherButton.innerHTML = "WEATHER OFF";
        }
    return weatherResponse;
}
=======
var ammunition = 45;
var muteSoundFlag = 0;
var bgmusic;
var shootSound;
>>>>>>> 917744d1a4342774f89505d25463b182b2784e45

function preload(){
  //map tiles
  this.load.image('overworld', 'assets/overworld.png');
  this.load.image('combinedTiles', 'assets/combinedTiles.png');
  //map in json format
  this.load.tilemapTiledJSON('map', 'assets/map.json');
    
<<<<<<< HEAD
  //sprites
  this.load.image('pinkPlayer','assets/alienPink.png');
  this.load.image('greenPlayer','assets/alienGreen.png');
  this.load.image('yellowPlayer','assets/alienYellow.png');
  this.load.image('bluePlayer','assets/alienBlue.png');
  this.load.image('beigePlayer','assets/alienBeige.png');

  this.load.image('healthbar_green', 'assets/healthbar_green.png');
  this.load.image('healthbar_red', 'assets/healthbar_red.png');

  this.load.image('bulletImg','assets/testBullet.png');
  this.load.image('bomb','assets/bomb.png');
        
  this.load.image('rain', 'assets/rain.png');
  this.load.image('snow', 'assets/snowflake-pixel.png');
  this.load.image('fog', 'assets/fog.png');

  this.load.audio('bgmusic', 'assets/audio/bgmusic.mp3');
  this.load.audio('shootSound', 'assets/audio/shoot.mp3');
=======
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
>>>>>>> 917744d1a4342774f89505d25463b182b2784e45
}

class Bullet extends Phaser.Physics.Arcade.Sprite{
  constructor(scene){
    super(scene, x, y, 'bulletImg');
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
    this.setPosition(x,y);
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

<<<<<<< HEAD
function create(){
  //add map
  map = this.add.tilemap('map');
    
  var bridgeTiles = map.addTilesetImage('overworld');
  var combinedTiles = map.addTilesetImage('combinedTiles');
  groundLayer = map.createStaticLayer('Below Player', combinedTiles, 0, 0);
  bridgeLayer = map.createStaticLayer('Overworld', bridgeTiles,0,0);
  collideLayer = map.createStaticLayer('World', combinedTiles, 0, 0);

  //music
  shootSound = this.sound.add('shootSound');
  bgmusic = this.sound.add('bgmusic');

  if(game.sound.context.state === 'suspended') {
    game.sound.context.resume();
  }

  bgmusic.play();
  bgmusic.loop = true;

  musicButton.addEventListener('click', function() {
    musicFlag = !musicFlag;
    console.log(musicFlag);
    if(musicFlag == false) {
      musicButton.innerHTML = "MUSIC ON";
      bgmusic.pause();
    }
    else {
      musicButton.innerHTML = "MUSIC OFF";
      bgmusic.resume();
    }
  })
  soundButton.addEventListener('click', function() {
    soundFlag = !soundFlag;
    console.log(soundFlag);
    if(soundFlag == false) {
      soundButton.innerHTML = "SOUND ON";
    }
    else {
      soundButton.innerHTML = "SOUND OFF";
    }
  })

  //weather 
  rainParticles = this.add.particles('rain');
  snowParticles = this.add.particles('snow');
  fog = this.add.image(1350, 1308, 'fog').setAlpha(0);
    if(navigator.onLine)
        fetchWeather()
            .then(weatherResponse => {
                currentWeather = weatherResponse.weather[0].main;
                console.log(currentWeather);                
                if(currentWeather == "Rain")
                    addRain(rainParticles, map.widthInPixels, map.heightInPixels);

                else if(currentWeather == "Drizzle")
                    addDrizzle(rainParticles, map.widthInPixels, map.heightInPixels);
                    
                else if(currentWeather == "Snow")
                    addSnow(snowParticles, map.widthInPixels, map.heightInPixels);
                    
                else if(currentWeather == "Mist")
                    changeAtmos(this, fog, "Misty");
                   
                else if(currentWeather == "Haze")
                    changeAtmos(this, fog, "Hazy");
                    
                else if(currentWeather == "Fog")
                    changeAtmos(this, fog, "foggy");
            });

  //set boundaries of game world
  this.physics.world.bounds.width = groundLayer.width;
  this.physics.world.bounds.height = groundLayer.height;

  map.setCollisionBetween(1,999,true,collideLayer);

  var self = this;
  this.socket = io();
  this.otherPlayers = this.physics.add.group();

  //character selection
  var selected = document.getElementById('colour').innerHTML;
  console.log(selected);

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);   
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });

  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  }.bind(this));

    this.socket.on('updateSprite', function (playerInfo) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerInfo.playerId === otherPlayer.playerId) {
            otherPlayer.colour = playerInfo.colour;
            }
        });
    });


    this.socket.on('disconnect', function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
=======
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

>>>>>>> 917744d1a4342774f89505d25463b182b2784e45
        }
      }.bind(this));
    }.bind(this));

  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
    if (playerInfo.playerId === otherPlayer.playerId) {
      otherPlayer.setPosition(playerInfo.x, playerInfo.y);
    }
<<<<<<< HEAD
  });
});
 
  bullets = this.physics.add.group({
    classType: Bullet,
    maxSize: 5,
    runChildUpdate: true
  }); 
  bullets.enable = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;

  traps = this.physics.add.group({
    classType: Phaser.GameObjects.Sprite
  })

//   const debugGraphics = this.add.graphics().setAlpha(0.75);
//   collideLayer.renderDebug(debugGraphics, {
//     tileColor: null, // Color of non-colliding tiles
//     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
//     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
//   });

  //set player movement input
  this.cursors = this.input.keyboard.createCursorKeys();
  this.bombButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

  camera = this.cameras.main;
  ammoCount = this.add.text(0, 0,"Ammunition Count:" + ammunition + "/10");
  //set bounds for camera (game world)
  camera.setBounds(0,0,map.widthInPixels, map.heightInPixels);
}

function update(){
  if(this.player){
    if (this.cursors.up.isDown){
      this.player.body.position.y -=4;
      this.player.flipY = true;
      facing = 1;
    }
    if (this.cursors.down.isDown){
      this.player.body.position.y +=4;
      this.player.flipY = false;
      facing = 2;
=======

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
>>>>>>> 917744d1a4342774f89505d25463b182b2784e45
    }
    if (this.cursors.left.isDown){
      this.player.body.position.x -=4;
      this.player.flipX = true;
      facing = 3;
    }
    if (this.cursors.right.isDown){
      this.player.body.position.x +=4;
      this.player.flipX = false;
      facing = 4;
    }

    if (this.player.health > 0) {
      this.healthbar_green.displayWidth = (this.player.health/100)*100;
      this.healthbar_green.x = this.player.body.position.x + 12;
      this.healthbar_green.y = this.player.body.position.y - 20;
      this.healthbar_red.x = this.player.body.position.x + 12;
      this.healthbar_red.y = this.player.body.position.y - 20;
    }

<<<<<<< HEAD
    if (this.cursors.space.isDown && ammunition > 0 && lastFired == 0){
      var bullet = bullets.get();
    
      if(bullet){
        if(soundFlag == true) {
          shootSound.play();
        }
        bullet.fire(this.player.body.position.x, this.player.body.position.y);
        lastFired = 10;
        ammunition --;
        ammoCount.setText("Ammunition Count:" + ammunition +"/10");
      }
    }
    if(lastFired > 0){
      lastFired --;
=======
    if(player.body.position.x - 455 > 0 && player.body.position.x + 495 < groundLayer.width){
        ammoCount.x = player.body.position.x - 455;
        muteSound.x = player.body.position.x - 455;
        muteMusic.x = player.body.position.x - 455;
    }
    if(player.body.position.y - 265 > 0 && player.body.position.y + 335 < groundLayer.height){
        ammoCount.y = player.body.position.y - 245;
        muteSound.y = player.body.position.y - 285;
        muteMusic.y = player.body.position.y - 265;
>>>>>>> 917744d1a4342774f89505d25463b182b2784e45
    }

    if (this.bombButton.isDown && lastBomb == 0){
      var trap = traps.create(this.player.body.position.x, this.player.body.position.y, 'bomb');
      trap.body.setImmovable();
      lastBomb = 30;
    }
    if(lastBomb > 0){
      lastBomb --;
    }

    this.physics.collide(this.player,collideLayer);
    this.physics.collide(this.player,this.otherPlayers);
    bullets.getChildren().forEach(child => {
      this.physics.collide(child, this.otherPlayers, bulletCollision);
    })
    this.otherPlayers.getChildren().forEach(child => {
      child.body.immovable = true;
      if(child.health <= 0){
        playerDeath(child);
      }
    })

<<<<<<< HEAD
    x = this.player.x;
    y = this.player.y;
    if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
      this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y});
    }
=======
        if(bullet){
            if(muteSoundFlag == 0) {
                shootSound.play();
            }
            bullet.fire(player.body.position.x, player.body.position.y);
>>>>>>> 917744d1a4342774f89505d25463b182b2784e45

    this.player.oldPosition = {
      x: this.player.x,
      y: this.player.y,
    }
  }

    if (weatherFlag && !weatherToggle){
      updateWeatherToggle();
      if (currentWeather == "Rain")
        addRain(rainParticles, map.widthInPixels, map.heightInPixels);
  
      else if (currentWeather == "Drizzle")
        addDrizzle(rainParticles, map.widthInPixels, map.heightInPixels);

<<<<<<< HEAD
      else if(currentWeather == "Snow")
        addSnow(snowParticles, map.widthInPixels, map.heightInPixels);
        
      else if(currentWeather == "Mist")
        changeAtmos(this, fog, "Misty");
       
      else if(currentWeather == "Haze")
        changeAtmos(this, fog, "Hazy");
        
      else if(currentWeather == "Fog")
        changeAtmos(this, fog, "foggy"); 
=======
            ammoCount.setText("Ammunition Count:" + ammunition +"/45");
        }
>>>>>>> 917744d1a4342774f89505d25463b182b2784e45
    }

    else if (!weatherFlag && weatherToggle){
      updateWeatherToggle();
      if (currentWeather == "Rain")
        removeRain();
  
      else if (currentWeather == "Drizzle")
        removeDrizzle();

      else if(currentWeather == "Snow")
        removeSnow();
        
      else if(currentWeather == "Mist" ||
              currentWeather == "Haze" ||
              currentWeather == "Fog")
        changeAtmos(this, fog, "Clear");
    }

    if(player2.health <= 0){
        playerDeath(player2);
    }

}

<<<<<<< HEAD
function addPlayer(self, playerInfo) {
  var selected = document.getElementById('colour').innerHTML;
  playerInfo.colour = selected;
  console.log("selected colour: ", playerInfo.colour);
  self.socket.emit('updateColour', { colour: playerInfo.colour});


  self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'pinkPlayer').setOrigin(0.5, 0.5);
  if (selected == 'pink'){
    self.player.setTexture('pinkPlayer');
  }
  else if (selected == 'yellow'){
    self.player.setTexture('yellowPlayer');
  }
  else if (selected == 'green'){
    self.player.setTexture('greenPlayer');
  }
  else if (selected == 'blue'){
    self.player.setTexture('bluePlayer');
  }
  else if (selected == 'beige'){
    self.player.setTexture('beigePlayer');
  }
  self.player.setCollideWorldBounds(true);
  self.player.health = 100;
  self.healthbar_red = self.physics.add.sprite(self.player.body.position.x, self.player.body.position.y, 'healthbar_red');
  self.healthbar_green = self.physics.add.sprite(self.player.body.position.x, self.player.body.position.y, 'healthbar_green');
  self.healthbar_green.setScale(.4);
  self.healthbar_red.setScale(.4);
  self.healthbar_red.displayWidth = (self.player.health/100) * 100;
  self.cameras.main.startFollow(self.player, true,0.5,0.5,0.5,0.5);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'pinkPlayer').setOrigin(0.5, 0.5);
  otherPlayer.health = 100;
  if (playerInfo.colour == "pink"){
     otherPlayer.setTexture('pinkPlayer'); 
  }
  else if (playerInfo.colour == "green"){
    otherPlayer.setTexture('greenPlayer'); 
  }
  else if (playerInfo.colour == "blue"){
    otherPlayer.setTexture('bluePlayer'); 
  }
  else if (playerInfo.colour == "yellow"){
    otherPlayer.setTexture('yellowPlayer'); 
  }
  else if (playerInfo.colour== 'beige'){
    otherPlayer.setTexture('beigePlayer');
  }
  
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}   



bulletCollision = function(bullets,hitPlayer){
  bullets.destroy();
  hitPlayer.health -= 10;
}

playerDeath = function(deadPlayer){
  deadPlayer.destroy();
  //healthbar_red.destroy();
  //healthbar_green.destroy();
}
=======
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
>>>>>>> 917744d1a4342774f89505d25463b182b2784e45
