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
var ammunition = 10;

// Parameters to control rain/drizzle

var rainFlag = false; var isRaining = false;
var drizzleFlag = false; var isDrizzling = false;
var rainParticles;

// Functions to control rain/drizzle parameters

function updateRainFlag(){
  rainFlag = !rainFlag;
}
function updateIsRaining(){
  isRaining = !isRaining;
}
function updateDrizzleFlag(){
  drizzleFlag = !drizzleFlag;
}
function updateIsDrizzling(){
  isDrizzling = !isDrizzling;
}

// Update Buttons in the game and rain/drizzle status

document.querySelector("[id='toggleRain']").addEventListener('click', function(){
  updateRainFlag();
  if (document.querySelector("[id='toggleRain']").innerHTML == "RAIN ON")
      document.querySelector("[id='toggleRain']").innerHTML = "RAIN OFF";
  else
      document.querySelector("[id='toggleRain']").innerHTML = "RAIN ON";
});
document.querySelector("[id='toggleDrizzle']").addEventListener('click', function(){
  updateDrizzleFlag();
  if (document.querySelector("[id='toggleDrizzle']").innerHTML == "DRIZZLE ON")
      document.querySelector("[id='toggleDrizzle']").innerHTML = "DRIZZLE OFF";
  else
      document.querySelector("[id='toggleDrizzle']").innerHTML = "DRIZZLE ON";
});

// Parameters to control snow

var snowFlag = false; var isSnowing = false;
var snowParticles;

// Functions to control snow parameters

function updateSnowFlag(){
  snowFlag = !snowFlag;
}
function updateIsSnowing(){
  isSnowing = !isSnowing;
}

// Update Buttons in the game and snow status

document.querySelector("[id='toggleSnow']").addEventListener('click', function(){
  updateSnowFlag();
  if (document.querySelector("[id='toggleSnow']").innerHTML == "SNOW ON")
      document.querySelector("[id='toggleSnow']").innerHTML = "SNOW OFF";
  else
      document.querySelector("[id='toggleSnow']").innerHTML = "SNOW ON";
});

// Parameters to control fog/mist/haze

var fogFlag = false; var isFoggy = false;
var mistFlag = false; var isMisty = false;
var hazeFlag = false; var isHazy = false;
var fog;

// Functions to control fog/mist/haze parameters

function updateFogFlag(){
  fogFlag = !fogFlag;
}
function updateIsFoggy(){
  isFoggy = !isFoggy;
}
function updateMistFlag(){
  mistFlag = !mistFlag;
}
function updateIsMisty(){
  isMisty = !isMisty;
}
function updateHazeFlag(){
  hazeFlag = !hazeFlag;
}
function updateIsHazy(){
  isHazy = !isHazy;
}

// Update Buttons in the game and fog/mist/haze status

document.querySelector("[id='toggleFog']").addEventListener('click', function(){
  updateFogFlag();
  if (document.querySelector("[id='toggleFog']").innerHTML == "FOG ON")
      document.querySelector("[id='toggleFog']").innerHTML = "FOG OFF";
  else
      document.querySelector("[id='toggleFog']").innerHTML = "FOG ON";
});
document.querySelector("[id='toggleMist']").addEventListener('click', function(){
  updateMistFlag();
  if (document.querySelector("[id='toggleMist']").innerHTML == "MIST ON")
      document.querySelector("[id='toggleMist']").innerHTML = "MIST OFF";
  else
      document.querySelector("[id='toggleMist']").innerHTML = "MIST ON";
});
document.querySelector("[id='toggleHaze']").addEventListener('click', function(){
  updateHazeFlag();
  if (document.querySelector("[id='toggleHaze']").innerHTML == "HAZE ON")
      document.querySelector("[id='toggleHaze']").innerHTML = "HAZE OFF";
  else
      document.querySelector("[id='toggleHaze']").innerHTML = "HAZE ON";
});

async function fetchWeather(){
  const ipRequest = await fetch('https://json.geoiplookup.io/');
  const ipResponse = await ipRequest.json();

  const weatherRequest = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' 
                                      + ipResponse.city + ',' + ipResponse.country_code + '&appid=fa452ec635e9759a07cab7433d42104f');
  const weatherResponse = await weatherRequest.json();
  return weatherResponse;
}

function preload(){
  this.load.image('RPGpack', 'assets/RPGpack_sheet.png');
  this.load.image('overworld', 'assets/overworld.png');
  this.load.image('combinedTiles', 'assets/combinedTiles.png');
  this.load.tilemapTiledJSON('map', 'assets/map.json');

  
  this.load.image('testingmap', 'assets/testSheet.png');
  this.load.image('player','assets/alienPink.png');
  this.load.image('bulletImg','assets/testBullet.png');
  
  
  this.load.image('rain', 'assets/rain.png');
  this.load.image('snow', 'assets/snowflake-pixel.png');
  this.load.image('fog', 'assets/fog.png');
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

function create(){
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

  player2 = this.physics.add.sprite(400,400,'player');
  player2.setBounce(0.2);

  bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 5,
      runChildUpdate: true
  }); 
  bullets.enable = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;

  //set collisions between player and world
  player.setCollideWorldBounds(true);
  map.setCollisionBetween(1, 999, true, collideLayer);

  // const debugGraphics = this.add.graphics().setAlpha(0.75);
  // collideLayer.renderDebug(debugGraphics, {
  //     tileColor: null, // Color of non-colliding tiles
  //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
  //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
  // });

  //set player movement input
  cursors = this.input.keyboard.createCursorKeys();
  
  camera = this.cameras.main;


  ammoCount = this.add.text(0,0,"Ammunition Count:" + ammunition + "/10");

  //set bounds for camera (game world)
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  //camera.setZoom(1.2);
  //make camera follow player
  camera.startFollow(player);

  rainParticles = this.add.particles('rain');
  snowParticles = this.add.particles('snow');
  fog = this.add.image(1350, 1308, 'fog').setAlpha(0);

  if(navigator.onLine)
      fetchWeather()
          .then(weatherResponse => {
              console.log(weatherResponse.weather[0].main);
              if(weatherResponse.weather[0].main == "Rain"){
                  addRain(rainParticles, map.widthInPixels, map.heightInPixels);
                  rainFlag = true; isRaining = true;
                  document.querySelector("[id='toggleRain']").innerHTML = "RAIN OFF";
              }

              else if(weatherResponse.weather[0].main == "Drizzle"){
                  addDrizzle(rainParticles, map.widthInPixels, map.heightInPixels);
                  drizzleFlag = true; isDrizzling = true;
                  document.querySelector("[id='toggleDrizzle']").innerHTML = "DRIZZLE OFF";
              }

              else if(weatherResponse.weather[0].main == "Snow"){
                  addSnow(snowParticles, map.widthInPixels, map.heightInPixels);
                  snowFlag = true; isSnowing = true;
                  document.querySelector("[id='toggleSnow']").innerHTML = "SNOW OFF";
              }

              else if(weatherResponse.weather[0].main == "Mist"){
                  changeAtmos(this, fog, "Misty");
                  mistFlag = true; isMisty = true;
                  document.querySelector("[id='toggleMist']").innerHTML = "MIST OFF";
              }

              else if(weatherResponse.weather[0].main == "Haze"){
                  changeAtmos(this, fog, "Hazy");
                  hazeFlag = true; isHazy = true;
                  document.querySelector("[id='toggleHaze']").innerHTML = "HAZE OFF";

              }
              
              else if(weatherResponse.weather[0].main == "Fog"){
                  changeAtmos(this, fog, "foggy");
                  fogFlag = true; isFoggy = true;
                  document.querySelector("[id='toggleFog']").innerHTML = "FOG OFF";
              }
          });

}

function update(time, delta){

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
  }
  if(player.body.position.y - 265 > 0 && player.body.position.y + 335 < groundLayer.height){
      ammoCount.y = player.body.position.y - 265;
  }

  if (cursors.space.isDown && time > lastFired && ammunition > 0){
      var bullet = bullets.get();

      if(bullet){
          bullet.fire(player.body.position.x, player.body.position.y);

          lastFired = time + 200;

          ammunition --;

          ammoCount.setText("Ammunition Count:" + ammunition + "/10");
      }
  }

  
  this.physics.collide(player,collideLayer)

  bullets.getChildren().forEach(child => {
      if(this.physics.collide(child, player2, bulletCollision)){
          console.log("3");
      }
  })

  if (rainFlag && !isRaining){
      addRain(rainParticles, map.widthInPixels, map.heightInPixels);
      updateIsRaining();
  }

  if (!rainFlag && isRaining){
      removeRain();
      updateIsRaining();
  }

  if (drizzleFlag && !isDrizzling){
      addDrizzle(rainParticles, map.widthInPixels, map.heightInPixels);
      updateIsDrizzling();
  }

  if (!drizzleFlag && isDrizzling){
      removeDrizzle();
      updateIsDrizzling();
  }

  if (snowFlag && !isSnowing){
      addSnow(snowParticles, map.widthInPixels, map.heightInPixels);
      updateIsSnowing();
  }

  if (!snowFlag && isSnowing){
      removeSnow();
      updateIsSnowing();
  }

  if (mistFlag && !isMisty){
      changeAtmos(this, fog, "Misty");
      updateIsMisty();
  }

  if (!mistFlag && isMisty){
      changeAtmos(this, fog, "Clear");
      updateIsMisty();
  }

  if (hazeFlag && !isHazy){
      changeAtmos(this, fog, "Hazy");
      updateIsHazy();
  }

  if (!hazeFlag && isHazy){
      changeAtmos(this, fog, "Clear");
      updateIsHazy();
  }

  if (fogFlag && !isFoggy){
      changeAtmos(this, fog, "foggy");
      updateIsFoggy();
  }

  if (!fogFlag && isFoggy){
      changeAtmos(this, fog, "Clear");
      updateIsFoggy();
  }
}

bulletCollision = function(bullets, hitPlayer){
  bullets.destroy();
  hitPlayer.destroy();
}