var config = {
  type: Phaser.WEBGL,
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
var ammunition = 100;
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

function preload(){
  //map tiles
  this.load.image('overworld', 'assets/overworld.png');
  this.load.image('combinedTiles', 'assets/combinedTiles.png');
  //map in json format
  this.load.tilemapTiledJSON('map', 'assets/map.json');

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
}

class Bullet extends Phaser.Physics.Arcade.Sprite{
  constructor(scene){
    super(scene, x, y, 'bulletImg');
    scene.add.existing(this);
    scene.physics.world.enable(this);
    if(facing == 1){
      this.xSpeed = Phaser.Math.GetSpeed(0,1);
      this.ySpeed = Phaser.Math.GetSpeed(-4000,1);
    }
    else if(facing == 2){
      this.xSpeed = Phaser.Math.GetSpeed(0,1);
      this.ySpeed = Phaser.Math.GetSpeed(4000,1);
    }
    else if(facing == 3){
      this.xSpeed = Phaser.Math.GetSpeed(-4000,1);
      this.ySpeed = Phaser.Math.GetSpeed(0,1);
    }
    else if(facing == 4){
      this.xSpeed = Phaser.Math.GetSpeed(4000,1);
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
      this.x += this.xSpeed;
      this.y += this.ySpeed;
      this.setPosition(this.x, this.y);
    }

    if(this.x > this.bulletInitX + 500 || this.x < this.bulletInitX - 500 || this.x < -10 || this.x > groundLayer.width ||
      this.y > this.bulletInitY + 500 || this.y < this.bulletInitY - 500 || this.y < -10 || this.y > groundLayer.width){
      this.destroy();
    }
  }
}

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
  var sessionId;
  this.socket = io();
  this.otherPlayers = this.physics.add.group();

  //character selection
  var selected = document.getElementById('colour').innerHTML;
  console.log(selected);

  this.socket.on('connect', () => {
    sessionId = this.socket.id;
  });

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
        }
      }.bind(this));
    }.bind(this));

    this.socket.on('player-hit', function(id){
      if(id === sessionId){
        self.player.health -= 10;
      }
      else{
        self.otherPlayers.getChildren().forEach(function (otherPlayer){
          if(id === otherPlayer.playerId){
            otherPlayer.health -= 10;
          }
        })
      }
    });

    this.socket.on('bulletsUpdate', function(servBullets){
      var counter = 0;
      bullets.getChildren().forEach(child => {
        if(servBullets[counter]){
          child.x = servBullets[counter].x;
          child.y = servBullets[counter].y;
        }
        counter++;
        if(counter > servBullets.length){
          child.destroy();
        }
      })
      for(var i = counter; i < servBullets.length; i++){
        addBullets(self,servBullets[i]);
      }
    });

  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
    if (playerInfo.playerId === otherPlayer.playerId) {
      otherPlayer.setPosition(playerInfo.x, playerInfo.y);
    }
  });
});

  // When we receive a message
  // it will be like { user: 'username', message: 'text' }
  $("#messageText").keyup(function(event){
    if(event.keyCode == 90){
        $("#messageText").val($("#messageText").val()+ 'z');
    }
  });

  // $("#messageText").keyup(function(event){
  //   if(event.keyCode == 122){
  //       $("#messageText").val($("#messageText").val()+ 'z');
  //   }
  // });

  $("#messageText").keyup(function(event){
    if(event.keyCode == 32){
        $("#messageText").val($("#messageText").val()+' ');
    }
  });

  $('.chatForm').submit(function (e) {
    console.log("sent")
    // Avoid submitting it through HTTP
    e.preventDefault();
    // Retrieve the message from the user
    var message = $(e.target).find('#messageText').val();
    //var username = $(e.target).find('#nameGame').val();
    var username = document.getElementById("nameGame").value;
    console.log(message);
    console.log(username);
    // Send the message to the server
    self.socket.emit('message', {
      //user: cookie.get('user') || 'Anonymous',
      user: username,
      message: message
    });
    // Clear the input and focus it for a new message
    e.target.reset();
    $(e.target).find('input').focus();
    //$(e.target).blur()
  });

  this.socket.on('message', function (data) {
    console.log("client catched");
    //alert(data.message);
    //document.getElementById("chatSection").innerHTML = "ssdfsdf";
    console.log("data user is" + data.user);
    $('section').append(data.user + ': ' + data.message + '<br>');

  });
  //emitMsg(self);
  // When the form is submitted

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
  ammoCount = this.add.text(0, 0,"Ammunition Count:" + ammunition + "/100");
  //set bounds for camera (game world)
  camera.setBounds(0,0,map.widthInPixels, map.heightInPixels);
}

function update(){
  if(this.player){
    if(this.player.health > 0){
      if (this.cursors.up.isDown){
        this.player.body.position.y -=4;
        this.player.flipY = true;
        facing = 1;
      }
      if (this.cursors.down.isDown){
        this.player.body.position.y +=4;
        this.player.flipY = false;
        facing = 2;
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

      if(this.player.body.position.x - 455 > 0 && this.player.body.position.x + 495 < groundLayer.width){
        ammoCount.x = this.player.body.position.x - 455;
      }
      if(this.player.body.position.y - 285 > 0 && this.player.body.position.y + 335 < groundLayer.height){
        ammoCount.y = this.player.body.position.y - 285;
      }

      if (this.player.health > 0) {
        this.healthbar_green.displayWidth = (this.player.health/100)*100;
        this.healthbar_green.x = this.player.body.position.x + 12;
        this.healthbar_green.y = this.player.body.position.y - 20;
        this.healthbar_red.x = this.player.body.position.x + 12;
        this.healthbar_red.y = this.player.body.position.y - 20;
      }

      if (this.cursors.space.isDown && ammunition > 0 && lastFired == 0 && document.activeElement !== messageText){
        var bullet = bullets.get();

        if(bullet){
          if(soundFlag == true) {
            shootSound.play();
          }
          bullet.fire(this.player.body.position.x, this.player.body.position.y);
          lastFired = 10;
          ammunition --;
          ammoCount.setText("Ammunition Count:" + ammunition +"/100");
          this.socket.emit('bulletFire', { x: this.player.body.position.x, y: this.player.body.position.y, xSpeed:bullet.xSpeed, ySpeed:bullet.ySpeed});
          }
      }
      if(lastFired > 0){
        lastFired --;
      }

      if (this.bombButton.isDown && lastBomb == 0 &&  document.activeElement !== messageText){
        var trap = traps.create(this.player.body.position.x, this.player.body.position.y, 'bomb');
        trap.body.setImmovable();
        lastBomb = 30;
      }
      if(lastBomb > 0){
        lastBomb --;
      }

      this.physics.collide(this.player,collideLayer);
      this.physics.collide(this.player,this.otherPlayers);

      this.otherPlayers.getChildren().forEach(child => {
        child.body.immovable = true;
        if(child.health <= 0){
          this.socket.emit('playerDied', {id:child.playerId});
          playerDeath(child);
        }
      })

      x = this.player.x;
      y = this.player.y;
      if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
        this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y});
      }

      this.player.oldPosition = {
        x: this.player.x,
        y: this.player.y,
      }
    }
    else{
      this.socket.emit('playerDied', {id: this.player.playerId});
      playerDeath(this.player);
      this.healthbar_green.destroy();
      this.healthbar_red.destroy();
    }
  }

    if (weatherFlag && !weatherToggle){
      updateWeatherToggle();
      if (currentWeather == "Rain")
        addRain(rainParticles, map.widthInPixels, map.heightInPixels);

      else if (currentWeather == "Drizzle")
        addDrizzle(rainParticles, map.widthInPixels, map.heightInPixels);

      else if(currentWeather == "Snow")
        addSnow(snowParticles, map.widthInPixels, map.heightInPixels);

      else if(currentWeather == "Mist")
        changeAtmos(this, fog, "Misty");

      else if(currentWeather == "Haze")
        changeAtmos(this, fog, "Hazy");

      else if(currentWeather == "Fog")
        changeAtmos(this, fog, "foggy");
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

}


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

function addBullets(self, bulletInfo){
  const nBullet = self.add.sprite(bulletInfo.x, bulletInfo.y, 'bulletImg');
  bullets.add(nBullet);
}

bulletCollision = function(bullets,hitPlayer){
    bullets.destroy();
    hitPlayer.destroy();
}

playerDeath = function(deadPlayer){
  deadPlayer.destroy();
  deadPlayer = null;
  //healthbar_red.destroy();
  //healthbar_green.destroy();
}




// var socket = io();
