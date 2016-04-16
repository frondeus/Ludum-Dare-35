(function() {
    var random = function(min, max) {
        return Math.random() * (max - min) + min;
    };

    var Obstacle = function(x, y) {
        this.gfx = new PIXI.Graphics();
        this.gfx.beginFill(0xFFFFFF);
        this.gfx.drawCircle(0, 0, 30);
        this.gfx.endFill();

        this.pos = new Game.Vec(0,0);

        this.pos.x = this.gfx.position.x = x;
        this.pos.y = this.gfx.position.y = y;
    };

    Game.Width = window.innerWidth;
    Game.Height = window.innerHeight;

    Game.init = function() {
        this.renderer = new PIXI.WebGLRenderer(this.Width, this.Height);
        this.renderer.autoResize = true;
        this.renderer.resize(this.Width, this.Height);
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.birds = [];
        this.mouse = new Game.Vec(100, 100);

        for(var i = 0; i < 100; i++) this.addBird(random(100, this.Width - 100), random(100, this.Height - 100));

        this.addObject(Obstacle, random(100, this.Width - 100), random(100, this.Height - 100));
    };

    Game.addObject = function(Obj, x, y) {
        var obj = new Obj(x, y);
        this.stage.addChild(obj.gfx);
        return obj;
    };

    Game.addBird = function(x, y) {
        this.birds.push(this.addObject(this.Bird, x, y));
    };

    Game.animate = function() {
        this.renderer.render(this.stage);

        
        this.mouse.x = this.renderer.plugins.interaction.mouse.global.x;
        this.mouse.y = this.renderer.plugins.interaction.mouse.global.y;

        for(var b in this.birds) {
            this.birds[b].step(this.birds, this.mouse);
        }
    };

    Game.init();
    animate();

    function animate() {
        Game.animate();
        requestAnimationFrame(animate);
    }

})();
