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

function init(data){

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
        this.load.image('beigePlayer','assets/alienBeige.png')

        this.load.image('bulletImg','assets/testBullet.png');
        
        
        this.load.image('rain', 'assets/rain.png');
        this.load.image('snow', 'assets/snowflake-pixel.png');
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

   // map.setCollisionBetween(1,999,true,collideLayer);
   collideLayer.setCollisionByExclusion([-1]);

    var self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();

    //this.physics.add.collider(collideLayer,this.players);

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
    collideLayer.setCollisionBetween(200,240);

    //this.physics.add.collider(collideLayer,player);

 
    bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 5,
        runChildUpdate: true
    }); 
    bullets.enable = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    collideLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    //set player movement input
    this.cursors = this.input.keyboard.createCursorKeys();
    
    


    camera = this.cameras.main;
    ammoCount = this.add.text(0,0,"Ammunition Count:" + ammunition +"/10");
    //set bounds for camera (game world)
    camera.setBounds(0,0,map.widthInPixels, map.heightInPixels);

}

function update(){

if(this.player){

  if (this.cursors.up.isDown){
      this.player.y -=4;
  }
  if (this.cursors.down.isDown){
      this.player.y +=4;
  }
  if (this.cursors.left.isDown){
      this.player.x -=4;
      this.player.flipX = true;
  }
  if (this.cursors.right.isDown){
      this.player.x +=4;
      this.player.flipX = false;
  }

//   this.physics.collide(this.player)

  var x = this.player.x;
  var y = this.player.y;
  if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
    this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y});
  }

  this.player.oldPosition = {
    x: this.player.x,
    y: this.player.y,
  };
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
  
  self.player.setBounce(0.2);
  self.player.setCollideWorldBounds(true);
  self.cameras.main.startFollow(self.player, true,0.5,0.5,0.5,0.5);
  self.physics.add.collider(self.player,collideLayer);

  self.physics.add.collider(self.otherPlayers,self.player);
  
  //collideLayer.setCollisionBetween(200,240);
  // collideLayer.setCollisionByProperty({collides:true});
  
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'pinkPlayer').setOrigin(0.5, 0.5);
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


// function update(time, delta){

//     if (cursors.up.isDown){
//         player.body.position.y -=4;
//         facing = 1;
//     }
//     if (cursors.down.isDown){
//         player.body.position.y +=4;
//         facing = 2;
//     }
//     if (cursors.left.isDown){
//         player.body.position.x -=4;
//         facing = 3;
//         player.flipX = true;
//     }
//     if (cursors.right.isDown){
//         player.body.position.x +=4;
//         facing = 4;
//         player.flipX = false;
//     }

//     if(player.body.position.x - 455 > 0 && player.body.position.x + 495 < groundLayer.width){
//         ammoCount.x = player.body.position.x - 455;
//     }
//     if(player.body.position.y - 265 > 0 && player.body.position.y + 335 < groundLayer.height){
//         ammoCount.y = player.body.position.y - 265;
//     }

//     if (cursors.space.isDown && time > lastFired && ammunition > 0){
//         var bullet = bullets.get();

//         if(bullet){
//             bullet.fire(player.body.position.x, player.body.position.y);

//             lastFired = time + 200;

//             ammunition --;

//             ammoCount.setText("Ammunition Count:" + ammunition +"/10");
//         }
//     }

    
//     this.physics.collide(player,collideLayer)

//     bullets.getChildren().forEach(child => {
//         if(this.physics.collide(child, player2, bulletCollision)){
//             console.log("3");
//         }
//     })

// }

bulletCollision = function(bullets,hitPlayer){
    bullets.destroy();
    hitPlayer.destroy();
}


