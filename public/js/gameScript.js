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


    this.load.image('testingmap', 'assets/testSheet.png' );
    this.load.image('test2', 'assets/tileSheet1.png');
    this.load.image('player','assets/alienPink.png');

}

function create(){

    map = this.add.tilemap('map');
    var groundTiles = map.addTilesetImage('RPGpack');
    var bridgeTiles = map.addTilesetImage('overworld');
    groundLayer = map.createStaticLayer('Below Player', groundTiles, 0, 0);
    bridgeLayer = map.createStaticLayer('Below Player 2', bridgeTiles,0,0);
    collideLayer = map.createStaticLayer('World', groundTiles, 0, 0);

    //set boundaries of game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    var self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
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
    });
    this.socket.on('disconnect', function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
    });
    this.socket.on('playerMoved', function (playerInfo) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
    }
  });
});
    collideLayer.setCollisionBetween(200,240);

    //collideLayer.setCollisionByProperty({collides:true});
    //this.physics.add.collider(collideLayer,player);

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    collideLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    //set bounds for camera (game world)
    this.cameras.main.setBounds(0,0,map.widthInPixels, map.heightInPixels);
    //make camera follow player
    //this.cameras.main.startFollow(self.player);
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
  }
  if (this.cursors.right.isDown){
      this.player.x +=4;
  }

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
  self.player = self.physics.add.image(playerInfo.x, playerInfo.y, 'player').setOrigin(0.5, 0.5);
  self.player.setDrag(100);
  self.player.setAngularDrag(100);
  self.player.setBounce(0.2);
  self.player.setCollideWorldBounds(true);
  collideLayer.setCollisionBetween(200,240);

  // collideLayer.setCollisionByProperty({collides:true});
  // this.physics.add.collider(collideLayer,self.player);
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'player').setOrigin(0.5, 0.5);
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}
