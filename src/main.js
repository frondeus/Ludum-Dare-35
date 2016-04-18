(function() {
    Game.Width = 1024 * 2;
    Game.Height = 768 * 2;
    var Aspect = Game.Width / Game.Height;

    var setSize = function() {
        var w = window.innerHeight * Aspect;
        var h = window.innerHeight;

        Game.stage.scale.x = (w / Game.Width);
        Game.stage.scale.y = (h / Game.Height);

        Game.Mid = new Game.Vec({x: Game.Width, y: Game.Height});
        Game.Mid.mul(0.5);

        Game.renderer.resize(w, h);
    };
    window.onresize = setSize;

    Game.init = function() {
        this.renderer = new PIXI.WebGLRenderer(Game.Width, Game.Height, null, false, false);
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.mouse = new Game.Vec(100, 100);
        setSize();

        this.entities = [];

        this.createWorld();
        this.createUI();
        this.spawnWorld();
    };

    Game.spawn = function(factory, args) {
        var en = factory.create(args);
        this.entities.push(en);
        return en;
    };

    Game.updateSystems = function(dt) {
        for(var e in this.entities) {
            var en = this.entities[e];
            if(en._dirty) continue;

            for(var s in en.systems) {
                var system = en.systems[s];
                if(system.step) system.step(en, dt);
            }
        }
    };

    
    Game.updateInput = function() {
        this.mouse.x = this.renderer.plugins.interaction.mouse.global.x / this.stage.scale.x;
        this.mouse.y = this.renderer.plugins.interaction.mouse.global.y / this.stage.scale.y;
    };

    Game.render = function(alpha) {
        for(var e in this.entities) {
            var en = this.entities[e];
            if(en._dirty) {
                continue;
            }

            en.gfx.position.x = lerp(en.old.pos.x, en.state.pos.x, alpha);
            en.gfx.position.y = lerp(en.old.pos.y, en.state.pos.y, alpha);
            en.gfx.rotation = lerp(en.old.rot, en.state.rot, alpha);
            en.gfx.scale.x = en.gfx.scale.y = lerp(en.old.size, en.state.size, alpha) / 16;

            en.old = en.state.copy();
        }
    
        this.renderer.render(this.stage);
    };

    var currentTime = 0;
    var acc = 0;
    var dT = 0.01;

    window.onload = function() {
        PIXI.loader
        .add('bird', 'tileset_0.png')
        .add('tree', 'tileset_1.png')
        .add('food', 'tileset_3.png')
        .add('bullets', 'tileset_2.png')
        .load(function(loader, resources) {
            Game.resources = resources;
            Game.init();
            currentTime = Date.now();
            animate();
        });

    };

    function animate() {
        var newTime = Date.now();
        var frameTime = (newTime - currentTime) / 1000;
        if(frameTime > 0.25) frameTime = 0.25;
        currentTime = newTime;

        Game.updateInput();
        Game.update(frameTime);

        Game.render(1.0);
        requestAnimationFrame(animate);
    }


})();
