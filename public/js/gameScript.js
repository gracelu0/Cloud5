var config = {
    type: Phaser.AUTO,
    width: 950,
    height: 600,
    parent: 'phaser',
    physics: {
        default: 'arcade'
    }

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
    this.load.tilemapTiledJSON('map', 'assets/bbmap.json');

    this.load.image('testingmap', 'assets/testSheet.png' );
    this.load.image('test2', 'assets/tileSheet1.png');
    this.load.image('player','assets/alienPink.png');

}

function create(){
    map = this.add.tilemap('map');
    var groundTiles = map.addTilesetImage('RPGpack');

    groundLayer = map.createStaticLayer('Below Player', groundTiles, 0, 0);
    collideLayer = map.createStaticLayer('World', groundTiles, 0, 0);

    player = this.add.sprite(200,400,'player');
    
    cursors = this.input.keyboard.createCursorKeys();
    //set bounds for camera (game world)
    this.cameras.main.setBounds(0,0,map.widthInPixels, map.heightInPixels);
    //make camera follow player
    this.cameras.main.startFollow(player);


    

    

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
