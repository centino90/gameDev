ZenvaRunner.Game = function() {
    this.playerMinAngle = -20; //minimum player rotation
    this.playerMaxAngle = 20; //maximum player rotation

    this.coinRate = 1000; //generate coins every 1000ms
    this.coinTimer = 0; //create a coin every game loop

    this.enemyRate = 500;
    this.enemyTimer = 0;

    this.score = 0;
};
ZenvaRunner.Game.prototype = { //extend the Game method prototype
    create: function() {
        //show the same animation when user tap the screen
        this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
        this.background.autoScroll(-100, 0);
        this.foreground = this.game.add.tileSprite(0,470,this.game.width,this.game.height - 533, 'foreground');
        this.foreground.autoScroll(-100,0); 
        this.ground = this.game.add.tileSprite(0,this.game.height-73,this.game.width,73,'ground');
        this.ground.autoScroll(-400,0); 
        this.player = this.add.sprite(200,this.game.height/2,'player');
        this.player.anchor.setTo(0.5); 
        this.player.scale.setTo(0.3); 

        this.player.animations.add('fly', [0,1,2,3,2,1]); 
        this.player.animations.play('fly',8,true); 

        //this will enable physics to our game
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //using the arcade physics system, we are setting the gravity in the horizontal direction of 400, the higher the value the more gravity.
        this.game.physics.arcade.gravity.y = 400;

        this.game.physics.arcade.enableBody(this.ground); //add gravity to our ground (remember the ground key value we set in preload.js?)
        this.ground.body.allowGravity = false; //we dont want our ground affeced by gravity
        this.ground.body.immovable = true; //this will keep the ground stay in place

        this.game.physics.arcade.enableBody(this.player); //apply physics to our player
        this.player.body.collideWorldBounds = true; //mahulog ang player(mawala sa screen) kung dili i-enable
        this.player.body.bounce.set(0.25); //we want our player to bounce when it runs
        
        this.coins = this.game.add.group(); //
        this.enemies = this.game.add.group(); //

        // add text to upper left with font details
        this.scoreText = this.game.add.bitmapText(10,10,'minecraftia','Score: 0',24);
        
    },
    update: function() {
        if(this.game.input.activePointer.isDown) { //active pointer can be a mouse or touch movement
            this.player.body.velocity.y -= 25; // this will move our player to the upward motion
        }

        if(this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown) { // change player angle if we are trying to move it up
            if(this.player.angle > 0) {
                this.player.angle = 0; //reset angle
            }
            if(this.player.angle > this.playerMinAngle) {
                this.player.angle -= 0.5; //lean backward
            }

        } else if(this.player.body.velocity.y >= 0 && !this.game.input.activePointer.idDown) { 
            if(this.player.angle < this.playerMaxAngle) {
                this.player.angle += 0.5; //lean forward
            }
        }

        if(this.coinTimer < this.game.time.now) {
            this.createCoin(); //create a coin
            this.coinTimer = this.game.time.now + this.coinRate; //increment the coin
        }
        if(this.enemyTimer < this.game.time.now) {
            this.createEnemy(); //create an enemy
            this.enemyTimer = this.game.time.now + this.enemyRate; //increment the enemy
        }
        
        // we are tellin to the arcade phsics to check for collision and apply appropriate physics
        this.game.physics.arcade.collide(this.player,this.ground,this.groundHit,null,this);

        // this will check when player and coins overlap, refer to coinHit function below
        this.game.physics.arcade.overlap(this.player,this.coins,this.coinHit,null,this);

        // this will check when player and enemy overlap, refer to enemyhit function below
        this.game.physics.arcade.overlap(this.player,this.enemies,this.enemyHit,null,this);

    },
    shutdown: function() {

    },

    // recycle coin and add to coin group
    createCoin: function() {
        var x = this.game.width; //x position
        //random coin y position, relative to the height of the ground
        var y = this.game.rnd.integerInRange(50, this.game.world.height -192);

        var coin = this.coins.getFirstExists(false);
        if(!coin) {
            coin = new Coin(this.game, 0,0); //x,y
            this.coins.add(coin); //add coin if not exist
        }

        coin.reset(x,y) //set sprite
        coin.revive();
    },
    createEnemy: function() {
        var x = this.game.width; //x position
        var y = this.game.rnd.integerInRange(50, this.game.world.height -192);

        var enemy = this.enemies.getFirstExists(false);
        if(!enemy) {
            enemy = new Enemy(this.game, 0,0); //x,y
            this.enemies.add(enemy); //add coin if not exist
        }

        enemy.reset(x,y) //set sprite
        enemy.revive();
    },
    groundHit: function(player,ground) {
        player.body.velocity.y = -200; //bounce the player when hit the ground
    },
    coinHit: function(player,coin) {
        this.score = this.score + 3000; //increase our score
        coin.kill(); // will hide the coin
        this.scoreText.text = 'Score: ' + this.score // will update the score coin
    },
    enemyHit: function(player,enemy) {
        player.kill(); //will kill the player
        enemy.kill(); // will kill the enemy

        this.ground.stopScroll(); // will stop ground from scrolling
        this.background.stopScroll(); // will stop background from scrolling
        this.foreground.stopScroll();    // will stop foreground from scrolling

        this.enemies.setAll('body.velocity.x', 0); //we stop enemies from moving forward
        this.coins.setAll('body.velocity.x', 0); //the same with coins

        this.enemyTimer = Number.MAX_VALUE; //stop generating enemy
        this.coinTimer = Number.MAX_VALUE; //

        var scoreboard = new Scoreboard(this.game);
        scoreboard.show(this.score);
    }
};