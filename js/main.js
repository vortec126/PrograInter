var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

// Called first
function preload() {
    game.load.tilemap('map', 'assets/tilemaps/maps/features_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.audio('sfx', 'assets/audio/SoundEffects/fx_mixdown.mp3');
    game.load.audio('boden', 'assets/audio/bodenstaendig_2000_in_rock_4bit.mp3');
    game.load.audio('unavidamenos','assets/audio/Error.mp3');
    game.load.spritesheet('enemigo','assets/baddie.png',32,24);
    game.load.image('vida','assets/firstaid.png');
}
var player;
var enemigo;
var enemigo2;
var map;
var layer;
var tileSprite;
var cursors;
var stars;
var score = 0;
var scoreVida = 5;
var scoreText;
var vidasText;
var finaltext;
var fx;
var music;
var vidas;
var unamenos;

function create() {

    tileSprite = game.add.tileSprite(0,0,1600,1200,'sky');

    map = game.add.tilemap('map');

    map.addTilesetImage('ground');
    map.setCollisionBetween(1,12);
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.add.sprite(0, 0, 'star');
    //	Here we set-up our audio sprite
    music = game.add.audio('boden')
    fx = game.add.audio('sfx');
    fx.allowMultiple = true;
    fx.addMarker('meow', 8, 0.5);
    fx.addMarker('ping', 10, 1.0);

    unamenos=game.add.audio('unavidamenos');

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    enemigo= game.add.sprite(200, game.world.height - 150,'enemigo');
    enemigo2= game.add.sprite(700, game.world.height - 150,'enemigo');
    vidas=game.add.sprite(32,game.world.height-550,'vida');
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(enemigo);
    game.physics.arcade.enable(enemigo2);
    game.physics.arcade.enable(vidas);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Player physics properties. Give the little guy a slight bounce.
    enemigo.body.bounce.y = 0.2;
    enemigo.body.gravity.y = 300;
    enemigo.body.collideWorldBounds = true;

    enemigo2.body.bounce.y = 0.2;
    enemigo2.body.gravity.y = 300;
    enemigo2.body.collideWorldBounds = true;

    //  Player physics properties. Give the little guy a slight bounce.
    vidas.body.bounce.y = 0.2;
    vidas.body.gravity.y = 0;
    vidas.body.collideWorldBounds = true;
    //  Our two animations, walking left and right.


    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    enemigo.animations.add('left',[0, 1, 2, 3], 10, true);
    enemigo.animations.add('right',[0, 1, 2, 3], 10, true);
    enemigo2.animations.add('left',[0, 1, 2, 3], 10, true);
    enemigo2.animations.add('right',[0, 1, 2, 3], 10, true);
    player.body.angularDrag = 50;
    enemigo.body.angularDrag=50;
    enemigo2.body.angularDrag=50;

    game.camera.follow(player);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 19 of them evenly spaced apart
    for (var i = 0; i < 19; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score


    scoreText = game.add.text(20, 25, 'score: 0', { fontSize: '50px', fill: '#000' });
    vidasText = game.add.text(69, 50, '5', { fontSize: '50px', fill: '#000' });
    finaltext = game.add.text(400, 300, '', { fontSize: '300px', fill: '#000' });

    map.createFromObjects('Object Layer 1',24,'star',0,true,false,stars);

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

}

// Called once every frame, ideally 60 times per second
function update() {
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(stars, layer);
    game.physics.arcade.collide(vidas,layer);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player,enemigo,dead,null,this);
    game.physics.arcade.overlap(player,enemigo2,dead,null,this);


    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    enemigo.body.velocity.x = 10;
    enemigo2.body.velocity.x=10;
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        scoreText.x -= 2;
        player.animations.play('left');
        enemigo.body.velocity.x = 250;
        enemigo.animations.play('right');
        enemigo2.body.velocity.x = 350;
        enemigo2.animations.play('right');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
        scoreText.x += 2;
        player.animations.play('right');
        enemigo.body.velocity.x = -250;
        enemigo.animations.play('left');
        enemigo2.body.velocity.x = -350;
        enemigo2.animations.play('left');

    }
    else
    {
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }




    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.velocity.y = -350;
        fx.play('ping');
        enemigo.body.velocity.y = -650;
        enemigo2.body.velocity.y= -850;
    }
    if(music.isPlaying == false)
    {
        music.override = true;
        music.play();
    }
}

function collectStar (player, star) {

    // Removes the star from the screen
    fx.play('meow');
    star.kill();
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
    if (score == 190)
    {
        finaltext.text = 'YOU WIN';
    }
}
function dead (pj, enemigo) {

    // Removes the star from the screen
   unamenos.play();

  player.kill();
    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;


    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    player.body.angularDrag = 50;

    game.camera.follow(player);
    //  Add and update the score
    scoreVida =scoreVida-1;
    vidasText.text = '' + scoreVida;
    if (scoreVida === 0)
    {
        finaltext.text='YOU LOSE';
        player.kill();

    }
}

