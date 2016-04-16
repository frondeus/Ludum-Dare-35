(function() {
    Game.Width = 800;
    Game.Height = 600;
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

    Game.init = function() {
        this.renderer = new PIXI.WebGLRenderer(Game.Width, Game.Height);
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.mouse = new Game.Vec(100, 100);
        this.entities = [];

        setSize();

        this.particles = new PIXI.ParticleContainer(15000, {
            scale: true,
            rotation: true,
            position: true
        });

        //this.renderer.backgroundColor = 0xFF3333;
        this.edgeSize = 288;
        this.edge = new PIXI.Graphics();
        this.edge.beginFill(0x000000);
        this.edge.lineStyle(2, 0xFF3333);
        this.edge.drawCircle(0, 0, this.edgeSize);
        this.edge.endFill();
        this.edge.position.x = Game.Mid.x;
        this.edge.position.y = Game.Mid.y;

        this.stage.addChild(this.edge);

        this.birdCountText = new PIXI.Text('100', {
            font: '48px Hack Bold',
            fill: 0xFF3333,
            align: 'center'
        });
        this.birdCountText.anchor.set(0.5, 0.5);
        this.birdCountText.position.x =Game.Mid.x;
        this.birdCountText.position.y =Game.Mid.y;
        this.stage.addChild(this.birdCountText);
                            



        this.stage.addChild(this.particles);
        for(var i = 0; i < 100; i++) {
            var e = Game.Bird.create();
            this.particles.addChild(e.gfx);
            this.entities.push(e);
        }

    };

    Game.update = function(dT) {
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
                this.birdCountText.text = "" + Game.Birds.entities.length-1;
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
                this.particles.removeChild(en.gfx);
                this.entities.splice(e, 1);
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

    PIXI.loader.add('bird', 'bird.png').load(function(loader, resources) {
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
