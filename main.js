(function() {

    Game.Width = window.innerWidth;
    Game.Height = window.innerHeight;

    Game.init = function() {
        this.renderer = new PIXI.WebGLRenderer(this.Width, this.Height);
        this.renderer.autoResize = true;
        this.renderer.resize(this.Width, this.Height);
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.mouse = new Game.Vec(100, 100);

        for(var i = 0; i < 100; i++) this.addEntity(this.Bird, {} );

        for(var i = 0; i < 50; i++) this.addEntity(this.Food, {} );

    };

    Game.addEntity = function(Obj, args) {
        var e = Obj(args);
        this.stage.addChild(e.gfx);
        return e;
    };


    var safeRadius = Game.Width / 4;

    Game.update= function(dt) {

        for(var b in this.Birds.entities) {
            var bird = this.Birds.entities[b];
            var dX = new Game.Vec((this.Width/2) , (this.Height/2));

            var dist = dX.dist(bird._pos);
            if(dist > safeRadius) {
                bird.remove();
                bird.gfx.tint = 0x000000;
            }
        }
        
        for(var s in this.systems) {
            var system = this.systems[s];
            if(system.step) for(var e in system.entities) {
                var entity = system.entities[e];
                system.step(entity, dt);
            }
        }

    };

    Game.render = function(alpha) {
        for(var e in this.systems[0].entities) {
            var entity = this.systems[0].entities[e];
            
            entity.gfx.position.x = entity.pos.x * alpha + entity._pos.x * (1.0 - alpha);
            entity.gfx.position.y = entity.pos.y * alpha + entity._pos.y * (1.0 - alpha);

    
            entity._pos.x = entity.pos.x;
            entity._pos.y = entity.pos.y;

            entity.gfx.rotation = entity.rotation;
        }


        this.renderer.render(this.stage);
        this.mouse.x = this.renderer.plugins.interaction.mouse.global.x;
        this.mouse.y = this.renderer.plugins.interaction.mouse.global.y;
    };

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
