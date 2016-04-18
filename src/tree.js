(function() {
    Game.Tree = new Game.Factory(function(en) {
        extend(en, {
            Separate: 30,
            gfx_texture: "tree"
        });
    
        Game.Obstacles.add(en);

    }, function(en, args) {
        extend(en.state, {
            size: 20 * (Math.random() + 1),
            rot: Math.random() * 2 - 1,
            pos: randomVec()
        }, args);
    });

})();
