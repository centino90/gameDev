ZenvaRunner.MainMenu = function() {};

ZenvaRunner.MainMenu.prototype = {
    create: function() {

        // Moving Background: our asset key for this are 'background' 'foreground', and ground
        this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
        this.background.autoScroll(-100, 0); //this will move the backround to the left

        this.foreground = this.game.add.tileSprite(0,470,this.game.width,this.game.height - 533, 'foreground');
        this.foreground.autoScroll(-100,0); // this will move the foreground to the left

        this.ground = this.game.add.tileSprite(0,this.game.height-73,this.game.width,73,'ground');
        this.ground.autoScroll(-400,0); //this will move the ground faster than the foreground and background assets

        // Adding the player
        this.player = this.add.sprite(200,this.game.height/2,'player');
        this.player.anchor.setTo(0.5); //this will position our player at the vertical center
        this.player.scale.setTo(0.3); //this will resize the size of our asset player, try to play around this value to see how it works

        this.player.animations.add('fly', [0,1,2,3,2,1]); //[0,1,2,3] are image frames found in our asset player,
        this.player.animations.play('fly',8,true); //this line will play our animation in 8fps and will loop th animaton(true)

        //to make our character more interesting, tween is added.
        this.game.add.tween(this.player).to({y:this.player.y-16}, 500,Phaser.Easing.Linear.NONE, true,0,Infinity,true);

        // adding our logo at the first part of our game
        this.splash = this.add.sprite(this.game.world.centerX,this.game.world.centerY,'logo');
        this.splash.anchor.setTo(0.5);

        // adding our text menu: position, asset key, text to show, pixel size
        this.startText = this.game.add.bitmapText(0,0, 'minecraftia','tap to start',32);

        // calculating the text positioning
        this.startText.x = this.game.width / 2-this.startText.textWidth/2;
        this.startText.y = this.game.height /2 + this.splash.height / 2;
    },
    update: function() {
        if(this.game.input.activePointer.justPressed()){ //this line is the trigger, 'activePointer' in phaser can be the mouse or touch depends on the device
            this.game.state.start('Game'); //call the start state when the condition above is met
        }
    }

};
