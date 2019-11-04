var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    zoom: 2,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }

};

var game = new Phaser.Game(config);

function preload(){
    // this.load.image('map', 'assets/maptest.png');
    this.load.image("tiles", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/tilesets/super-mario-tiles.png");
}

function create(){
    // this.add.image(500,250,'map');
    const level = [
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
        [  0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0 ],
        [  0,  5,  6,  7,  0,  0,  0,  5,  6,  7,  0 ],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
        [  0,  0,  0, 14, 13, 14,  0,  0,  0,  0,  0 ],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
        [  0,  0, 14, 14, 14, 14, 14,  0,  0,  0, 15 ],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0, 15, 15 ],
        [ 35, 36, 37,  0,  0,  0,  0,  0, 15, 15, 15 ],
        [ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ]
      ];
    
      // When loading from an array, make sure to specify the tileWidth and tileHeight
      const map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
      const tiles = map.addTilesetImage("tiles");
      const layer = map.createStaticLayer(0, tiles, 0, 0);

}

function update(){

}