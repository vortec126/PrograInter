var game = new Phaser.Game(800, 600, Phaser.AUTO, 'area', { preload: preload, create: create, update: update });
var platforms;
function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

}

function create() {
    game.physics.startSystem(Phaser.physics.arcade);
    game.add.sprite(0, 0, 'sky');
    platforms = game.add.group();
    platforms.enableBody=true;

    var ground =platforms.create(0,game.world.height - 64,'ground');
    ground.scale.setTo(2,2);
    ground.body.inmovable=true;

    var ledge =platforms.create(400,400,'ground');
    ledge.body.inmovable=true;
    ledge=plataforms.create(-150,250,'ground');
    ledge.body.inmovable=true;

}

function update() {
}
