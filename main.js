//Initialize Phaser at 400x490
var game = new Phaser.Game(400, 490)
//create state for game variables
var mainState = {
  preload: function(){
    //load bird sprite
    game.load.image('bird', 'assets/bird.png');
    //load pipe sprite
    game.load.image('pipe', 'assets/pipe.png');
    //load sound
    game.load.audio('jump', 'assets/jump.wav');
  },
  create: function(){
    if(game.device.desktop === false){
      //set scale to SHOW_ALL
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      //set min and max game size
      game.scale.setMinMax(game.width/2, game.height/2,
        game.width, game.height);
      //center the game
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
    }
    //set background color for game
    game.stage.backgroundColor = '#71c5cf';
    //set physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //set bird start position at x=100, y=245
    this.bird = game.add.sprite(100, 245, 'bird');
    //enable physics for bird
    game.physics.arcade.enable(this.bird);
    //add gravity to bird to make it fall
    this.bird.body.gravity.y = 1000;
    //set anchor for bird to left and down
    this.bird.anchor.setTo(-0.2, 0.5);
    //call jump() when space key pressed
    var spaceKey = game.input.keyboard.addKey(
      Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);
    //also call jump() on screen tap/click
    game.input.onDown.add(this.jump, this);
    //create empty pipe group
    this.pipes = game.add.group();
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0",
      {font: "30px Arial", fill:"#ffffff"});
    //jump sound
    this.jumpSound = game.add.audio('jump');
  },
  update: function(){
    //animate bird
    if (this.bird.angle < 20)
      this.bird.angle += 1;
    //If bird goes too high/low call restart()
    if(this.bird.y < 0 || this.bird.y > 490)
      this.restartGame();
    game.physics.arcade.overlap(this.bird,
      this.pipes, this.hitPipe, null, this);
  },
  //make bird jump
  jump: function(){
    if(this.bird.alive === false)
      return;
    //set a vertical velocity for bird
    this.bird.body.velocity.y = -350;
    //animate bird
    game.add.tween(this.bird).to({angle: -20}, 100).start();
    this.jumpSound.play();
  },
  hitPipe: function(){
    //if bird has hit pipe do nothing
    if(this.bird.alive === false)
      return;
    //set alive to false
    this.bird.alive = false;
    //stop pipes from appearing
    game.time.events.remove(this.timer);
    //stop all pipes from moving
    this.pipes.forEach(function(p){
      p.body.velocity.x = 0;
    }, this);
  },
  //restart game
  restartGame: function(){
    //starts main state, restarts game
    game.state.start('main');
  },
  addOnePipe: function(x, y){
    //create pipe at position x, y
    var pipe = game.add.sprite(x, y, 'pipe');
    //add pipe to group
    this.pipes.add(pipe);
    //enable physics
    game.physics.arcade.enable(pipe);
    //add velocity
    pipe.body.velocity.x = -200;
    //destroy pipe if out of bounds
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },
  addRowOfPipes: function(){
    //Random num between 1 and 5 is hole position
    var hole = Math.floor(Math.random() * 5) + 1;
    //Add 6 pipes with 1 hole
    for (var i = 0; i < 8; i++)
      if (i != hole && i != hole + 1)
        this.addOnePipe(400, i * 60+10);
    this.score += 1;
    this.labelScore.text = this.score;
  }
};

game.state.add('main', mainState);
game.state.start('main');
