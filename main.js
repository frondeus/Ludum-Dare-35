(function() {
    Game.Width = 1024;
    Game.Height = 768;
    var asp = Game.Width/Game.Height;

    var setSize = function() {
        var w= window.innerHeight * asp;
        var h= window.innerHeight;

        Game.stage.scale.x = (w / Game.Width);
        Game.stage.scale.y = (h / Game.Height);

        Game.Mid = new Game.Vec({x: Game.Width, y: Game.Height});
        Game.Mid.mul(0.5);
        Game.renderer.resize(w, h);
    };

    window.onresize = setSize;

    Game.createUI = function() {
    
        //this.renderer.backgroundColor = 0xFF3333;
      
        this.birdCountText = new PIXI.Text('100', {
            font: 'bold 48px Hack',
            fill: 0xFF3333,
            align: 'center'
        });
        this.birdCountText.anchor.set(0.5, 0.5);
        this.birdCountText.position.x = 100;
        this.birdCountText.position.y = 100;
        this.stage.addChild(this.birdCountText);
                            

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

    };

    Game.init = function() {
        this.renderer = new PIXI.WebGLRenderer(Game.Width, Game.Height, null, false, false);
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.mouse = new Game.Vec(100, 100);
        this.entities = [];

        setSize();
        this.edgeSize = Game.Mid.y - 25;
        this.edge = new PIXI.Graphics();
        this.edge.beginFill(0x000000);
        this.edge.lineStyle(2, 0xFF3333);
        this.edge.drawCircle(0, 0, this.edgeSize);
        this.edge.endFill();
        this.edge.position.x = Game.Mid.x;
        this.edge.position.y = Game.Mid.y;

        this.stage.addChild(this.edge);


        this.stage.addChild(Game.Food.gfx);
        this.stage.addChild(Game.Tree.gfx);
        this.stage.addChild(Game.Bird.gfx);
        this.stage.addChild(Game.Bullet.gfx);

        for(var i = 0; i < 100; i++) {
            this.addChild(Game.Bird);
        }

        for(var i = 0; i < random(1, 20); i++) {
            this.addChild(Game.Tree);
        }


        this.levelTime = 0.0;
        this.levelTimer = 5.0;

        this.createUI();
        this.stage.addChild(this.levelText);
        this.stage.addChild(this.levelTimerText);
    };

    Game.addChild = function(factory, args) {
        var e = factory.create(args);
        this.entities.push(e);
        return e;
    };

    /*
     *  TODO:
     *  3. Hunters
     *  3. Dźwięki
     *  4. Tło
     * */

    Game.update = function(dT) {
        this.birdCountText.text = "" + Game.Birds.entities.length;
        if(Game.Birds.entities.length <= 0) {
            this.levelText.text = "Try again!";
            return;
        }

        this.levelTimerText.text = '' + Math.floor(this.levelTime += dT);
        if((this.levelTimer -= dT) <= 0) {
            this.levelTimer = Math.random() * 10;

            var r = random(0, 100);

            if(r <= 5 && Game.Bird.count < 100) {
                this.levelText.text = "Bigger flock!";
                for(var i = 0; i < random(1, 20); i++) {
                    this.addChild(Game.Bird, { pos: Game.mouse.copy() } );
                }
            }
            else if(r <= 10  && Game.Tree.count < 15) {
                this.levelText.text = "Trees are obstacles";
                for(var i = 0; i < random(1, 20); i++) {
                    this.addChild(Game.Tree);
                }
            }
            else if(r <= 15 && Game.Food.count < 20) {
                this.levelText.text = "Dinner!";
                for(var i = 0; i < random(1, 20); i++) {
                    this.addChild(Game.Food);
                }
            }
            else if(r <= 80) {
                this.levelText.text = "Hunters!";
                for(var i = 0; i < random(10, 60); i++) {
                    this.addChild(Game.Bullet, {});
                }
            }
            else {
                r = random(0, 100);
                if(r <= 20) this.levelText.text = "Don't surrender!";
                else if(r <= 40) this.levelText.text = "Good job!";
                else if(r <= 60) this.levelText.text = "Be a leader!";
                else this.levelText.text = "Stay in circle!";
            }

            this.birdCountText.text = "" + Game.Birds.entities.length-1;
        }



        for(var s in this.systems) {
            var system = this.systems[s];
            if(system.step) for(var e in system.entities) {
                if(system.entities[e]._dirty == false)
                    system.step(system.entities[e], dT);
            }
        }

        for(var b in Game.Birds.entities) {
            var bird = Game.Birds.entities[b];
            if(bird._dirty) continue;
            var dist = this.Mid.dist(bird.state.pos);
            if(dist > this.edgeSize) {
                bird.remove();
            }
        }
    };

    var lerp = function(next, old, alpha) {
        var n = next * alpha + (1.0 - alpha) * old;
        return n;
    };

    Game.render = function(alpha) {

        for(var s in this.systems) {
            var system = this.systems[s];
            system.clean();
        }

        for(var e in this.entities) {
            var en = this.entities[e];

            en.gfx.position.x = lerp(en.state.pos.x, en.old.pos.x, alpha);
            en.gfx.position.y = lerp(en.state.pos.y, en.old.pos.y, alpha);
            en.gfx.rotation = lerp(en.state.rot, en.old.rot, alpha);
            en.gfx.scale.x = en.gfx.scale.y = lerp(en.state.size, en.old.size, alpha) / 16;

            en.old.pos = en.state.pos.copy();
            en.old.vel = en.state.vel.copy();
            en.old.size = en.state.size;
            en.old.rot = en.state.rot;

            if(en._dirty) {
                this.entities.splice(e, 1);
                en.factory.gfx.removeChild(en.gfx);
                en.factory.queue.push(en);
                en.factory.count--;
                en.dirty = false;
            }
        }


        this.renderer.render(this.stage);
        this.mouse.x = this.renderer.plugins.interaction.mouse.global.x / this.stage.scale.x;
        this.mouse.y = this.renderer.plugins.interaction.mouse.global.y / this.stage.scale.y;

        //this.mouse.x = 400;
        //this.mouse.y = 300;
    };

    //---- Loop ----

    var currentTime = Date.now();
    var acc = 0;
    var dT = 0.01;

    PIXI.loader
    .add('bird', 'bird.png')
    .add('tree', 'tree.png')
    .add('food', 'snail.png')
    .add('bullets', 'bullets.png')
    .load(function(loader, resources) {
        Game.resources = resources;
        Game.init();
        animate();
    });

    function animate() {
        var newTime = Date.now();
        var frameTime = (newTime - currentTime) / 1000;
        if(frameTime > 0.25) frameTime = 0.25;
        currentTime = newTime;

        acc += frameTime;

        while(acc >= dT) {
            Game.update(dT);
            acc -= dT;
        }

        var alpha = acc / dT;
        Game.render(alpha);
        requestAnimationFrame(animate);
    }


})();
