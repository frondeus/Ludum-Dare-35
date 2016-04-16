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

        for(var i = 0; i < 20; i++) this.addEntity(this.Bird, {} );

        for(var i = 0; i < 50; i++) this.addEntity(this.Food, {} );

    };

    Game.addEntity = function(Obj, args) {
        var e = Obj(args);
        this.stage.addChild(e.gfx);
        return e;
    };


    Game.update= function(dt) {

        for(var s in this.systems) {
            var system = this.systems[s];
            if(system.step) for(var e in system.entities) {
                var entity = system.entities[e];
                if(!entity.removed)
                    system.step(entity, dt);
            }
        }

        for(var s in this.systems) {
            var system = this.systems[s];
            system.clean();
        }

        for(var e in this.removed) {
            this.stage.removeChild(this.removed[e].gfx);
        }
        this.removed = [];
    };

    Game.render = function() {
        this.renderer.render(this.stage);
        this.mouse.x = this.renderer.plugins.interaction.mouse.global.x;
        this.mouse.y = this.renderer.plugins.interaction.mouse.global.y;
    };

    Game.init();
    var currentTime = Date.now();
    var acc = 0;
    var dT = 0.01;

    animate();

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

        Game.render();

        requestAnimationFrame(animate);
    }

})();
