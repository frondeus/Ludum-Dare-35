(function() {
    Game.createUI = function() {
        this.birdCountText = new PIXI.Text('100', {
            font: 'bold 48px Hack',
            fill: 0xFF3333,
            align: 'center'
        });
        this.birdCountText.anchor.set(0.5, 0.5);
        this.birdCountText.position.x = 100;
        this.birdCountText.position.y = 100;


        this.levelTimerText = new PIXI.Text('100', {
            font: 'bold 48px Hack',
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.levelTimerText.anchor.set(0.5, 0.5);
        this.levelTimerText.position.x = Game.Width - 100;
        this.levelTimerText.position.y = 100;

        this.levelText = new PIXI.Text("Stay in circle!", {
            font: '24px Hack',
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.levelText.anchor.set(0.5, 0.5);
        this.levelText.position.x =Game.Mid.x;
        this.levelText.position.y = 75;

        this.stage.addChild(this.birdCountText);
        this.stage.addChild(this.levelText);
        this.stage.addChild(this.levelTimerText);
    };

    Game.createEdge = function() {
        this.edgeSize = Game.Mid.y - 25;
        this.edge = new PIXI.Graphics();
        this.edge.lineStyle(2, 0xFF3333);
        this.edge.drawCircle(0, 0, this.edgeSize);
        this.edge.position.x = Game.Mid.x;
        this.edge.position.y = Game.Mid.y;

        this.stage.addChild(this.edge);
    };

    Game.createWorld = function() {
        this.bg = new PIXI.Sprite(this.resources.background.texture);
        this.bg.scale.x = 2;
        this.bg.scale.y = 2;
        this.stage.addChild(this.bg);
        this.createEdge();

        Game.Food.init();
        Game.Tree.init();
        Game.Bird.init();
        Game.Bullet.init();


        Game.music = new Howl( {
            urls: ['music.wav'],
            loop: true,
            volume: 0.033
        });

        Game.flap = Game.loadSounds('flap.wav');
        Game.kra = Game.loadSounds('kra.wav');
        Game.bzz = Game.loadSounds('bzz.wav');
        Game.shoot = Game.loadSounds('shoot.wav');
        
        this.music.play();
    };

    Game.playSound = function(name) {
        Game[name][Math.floor(Math.random() * Game[name].length)].play();
    };

    Game.loadSounds = function(name) {
        var arr = [];
        for(var i = 0; i < 10; i++) arr.push(Game.loadSound(name));
        return arr;
    };

    Game.loadSound = function(name) {
        return new Howl({
            urls: [name],
            volume: 0.04,
            rate: Math.random() * 2
        });
    };

    Game.spawnWorld = function() {

        for(var i = 0; i < 100; i++) {
            this.spawn(Game.Bird);
        }

        for(var i = 0; i < random(1, 20); i++) {
            this.spawn(Game.Tree);
        }

        this.levelTime = 0.0;
        this.levelTimer = 5.0;
    };

    Game.update = function(dT) { 
        this.birdCountText.text = "" + Game.Bird.count;
        if(Game.Bird.count <= 0) {
            this.levelText.text = "Try again!";
            this.music.volume(0.005);
            return;
        }

        this.levelTimerText.text = '' + Math.floor(this.levelTime += dT);
        if((this.levelTimer -= dT) <= 0) {
            this.levelTimer = Math.random() * 2;

            var r = random(0, 100);

            if(r <= 5 && Game.Bird.count < 100) {
                this.levelText.text = "Bigger flock!";
                this.playSound("flap");
                for(var i = 0; i < random(1, 20); i++) {
                    this.spawn(Game.Bird, { pos: Game.mouse.copy() } );
                }
            }
            else if(r <= 30  && Game.Tree.count < 45) {
                this.playSound("kra");
                this.levelText.text = "Trees are obstacles";
                for(var i = 0; i < random(1, 20); i++) {
                    this.spawn(Game.Tree);
                }
            }
            else if(r <= 65 && Game.Food.count < 20) {
                this.playSound("bzz");
                this.levelText.text = "Dinner!";
                for(var i = 0; i < random(1, 5); i++) {
                    this.spawn(Game.Food);
                }
            }
            else if(r <= 80) {
                this.playSound("shoot");
                this.levelText.text = "Hunters!";
                for(var i = 0; i < random(4, 25); i++) {
                    this.spawn(Game.Bullet, {});
                }
            }
            else {
                var texts = [
                    "Don't surrender!",
                    "Good job!",
                    "Be a leader!",
                    "Stay in circle!",
                    "Use trees!",
                    "Avoid bullets!",
                    "Controll flock",
                    "Don't panic!",
                    "Ludum Dare 35"
                ];
                this.levelText.text = texts[Math.floor(Math.random() * texts.length)];
            }

            this.birdCountText.text = "" + Game.Bird.count;

        }
        
        for(var b in Game.Birds.ent) {
            var bird = Game.Birds.ent[b];
            if(bird._dirty) continue;
            var dist = this.Mid.dist(bird.state.pos);
            if(dist > this.edgeSize) {
                bird.remove();
            }
        }


        this.updateSystems(dT);
    };
})();

