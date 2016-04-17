(function() {
    var Tree = new Game.Factory(function(e, args) {
        extend(e.state, {
            size: 20 * (Math.random() + 1),
            rot: Math.random() * 2 - 1,
            pos: randomVec()
        }, args);
        
        e.gfx = new PIXI.Sprite(Game.resources.tree.texture);
        extend(e, {
            Separate: 30,
        });

        Game.Obstacles.add(e);
        return e;
    });

    Game.Tree = Tree;
})();
