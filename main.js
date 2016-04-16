(function() {
    Game.Width = window.innerWidth;
    Game.Height = window.innerHeight;

    var renderer = new PIXI.WebGLRenderer(Game.Width, Game.Height);
    renderer.autoResize = true;
    renderer.resize(Game.Width, Game.Height);
    document.body.appendChild(renderer.view);

    var stage = new PIXI.Container();
    var birds = [];

    var addBird = function(x, y) {
        var bird = new Game.Bird(x, y);
        birds.push(bird);
        stage.addChild(bird.gfx);
    };

    var randCircle = function(size) {
        var x = Math.random() * size - (2 * size);
        return x;
    };

    for(var i = 0; i < 100; i++) addBird(randCircle(1000), randCircle(1000));

    var mouse = new Game.Vec(100, 100);

    console.log(renderer);

    animate();

    function animate() {
        renderer.render(stage);

        
        mouse.x = renderer.plugins.interaction.mouse.global.x;
        mouse.y = renderer.plugins.interaction.mouse.global.y;

        for(var b in birds) {
            birds[b].step(birds, mouse);
        }


        requestAnimationFrame(animate);
    }

})();
