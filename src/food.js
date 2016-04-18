(function() {
    Game.Foods = new Game.System();
    
    extend(Game.Foods, {
        step: function(en, dt) {
            for(var b in Game.Birds.ent) {
                var bird = Game.Birds.ent[b];
                if(bird._dirty) continue;
                var dist = en.old.pos.dist(bird.old.pos);
                if(dist < 10) {
                    en.remove();
                    
                    if(Game.Bird.count < 95) {
                        for(var i = 0; i < random(1, 2); i++) {
                            var e = Game.spawn(Game.Bird, { pos: bird.old.pos.copy()  });
                        }
                    }

                    return;
                }
            }
        }
    });

    Game.Food = new Game.Factory(function(en) {
        en.gfx_texture = "food";
        Game.Foods.add(en);
        return en;
    }, function(en, args) {
        extend(en.state, {
            size: 10 * (Math.random() + 1),
            rot: Math.random() * 2 - 1,
            pos: randomVec(),
            vel: new Game.Vec({ x: Math.random() * 2 -1, y: Math.random() * 2 - 1 })
        },args);
        return en;
    });
})();
