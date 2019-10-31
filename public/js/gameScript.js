var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    scene: {
        preload: preload,
        create: create,
        update: update
    }

};

var game = new Phaser.Game(config);

function preload(){
    this.load.image('map', 'assets/maptest.png');

}

function create(){
    this.add.image(500,250,'map');

}

function update(){

}