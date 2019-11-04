var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    parent: 'phaser',

    scene: {
        preload: preload,
        create: create,
        update: update
    }

};

var game = new Phaser.Game(config);

function preload(){
    this.load.image('map', 'assets/maptest.png');
    this.load.image('testingmap', 'assets/testSheet.png' );
    this.load.image('test2', 'assets/tileSheet1.png');

}

function create(){
    this.add.image(500,250,'map');

    //Load a map from a 2D array of tile indices
    const level = [
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   1,   2,   3,   0,   0,   0,   1,   2,   3,   0 ],
        [  0,   5,   6,   7,   0,   0,   0,   5,   6,   7,   0 ],
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,  14,  13,  14,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,  14,  14,  14,  14,  14,   0,   0,   0,  15 ],
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,  15,  15 ],
        [ 35,  36,  37,   0,   0,   0,   0,   0,  15,  15,  15 ],
        [ 39,  39,  39,  39,  39,  39,  39,  39,  39,  39,  39 ]
      ];

    const level1 = [
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   1,   2,   3,   0,   0,   0,   1,   2,   3,   0 ],
        [  0,   5,   6,   7,   0,   0,   0,   5,   6,   7,   0 ],
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,  14,  13,  14,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,  14,  14,  14,  14,  14,   0,   0,   0,  15 ],
    ];

    const map = this.make.tilemap({data: level1, tileWidth:64, tileHeight:64});
    const tiles = map.addTilesetImage("test2");
    const layer = map.createStaticLayer(0,tiles,0,0);

    

    

}

function update(){


}