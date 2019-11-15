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
var ammunition = 10;
var x;
var y;

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

  this.load.image('healthbar_green', 'assets/healthbar_green.png');
  this.load.image('healthbar_red', 'assets/healthbar_red.png')

  this.load.image('bulletImg','assets/testBullet.png');
  this.load.image('bomb','assets/bomb.png');
        
  this.load.image('rain', 'assets/rain.png');
  this.load.image('snow', 'assets/snowflake-pixel.png');
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

function create(){
  //add map
  map = this.add.tilemap('map');
    
  var bridgeTiles = map.addTilesetImage('overworld');
  var combinedTiles = map.addTilesetImage('combinedTiles');
  groundLayer = map.createStaticLayer('Below Player', combinedTiles, 0, 0);
  bridgeLayer = map.createStaticLayer('Overworld', bridgeTiles,0,0);
  collideLayer = map.createStaticLayer('World', combinedTiles, 0, 0);

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

  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    }.bind(this));
  }.bind(this));

  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
    if (playerInfo.playerId === otherPlayer.playerId) {
      otherPlayer.setPosition(playerInfo.x, playerInfo.y);
    }
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

  const debugGraphics = this.add.graphics().setAlpha(0.75);
  collideLayer.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
  });

  //set player movement input
  this.cursors = this.input.keyboard.createCursorKeys();
  this.bombButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

  camera = this.cameras.main;
  ammoCount = this.add.text(0,0,"Ammunition Count:" + ammunition +"/10");
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

    if (this.cursors.space.isDown && ammunition > 0 && lastFired == 0){
      var bullet = bullets.get();
    
      if(bullet){
        bullet.fire(this.player.body.position.x, this.player.body.position.y);
        lastFired = 10;
        ammunition --;
        ammoCount.setText("Ammunition Count:" + ammunition +"/10");
      }
    }
    if(lastFired > 0){
      lastFired --;
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
}

function addPlayer(self, playerInfo) {
  var selected = document.getElementById('colour').innerHTML;
  playerInfo.colour = selected;
  console.log("selected colour: ", playerInfo.colour);
  self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'pinkPlayer').setOrigin(0.5, 0.5);
  if (selected == 'pink'){
    self.player.setTexture('pinkPlayer');
  }
  else if (selected == 'yellow'){
    self.player.setTexture('yellowPlayer');
    //self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'greenPlayer').setOrigin(0.5, 0.5);
  }
  else if (selected == 'green'){
    self.player.setTexture('greenPlayer');
    //self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'greenPlayer').setOrigin(0.5, 0.5);
  }
  else if (selected == 'blue'){
    self.player.setTexture('bluePlayer');
    //self.player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'greenPlayer').setOrigin(0.5, 0.5);
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
