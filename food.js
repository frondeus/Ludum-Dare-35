(function() {
    Game.Foods = new Game.System();
    extend(Game.Foods, {
        step: function(e, dT) {
            

            for(var b in Game.Birds.entities) {
                var bird = Game.Birds.entities[b];
                if(bird._dirty) continue;
                var dist = e.old.pos.dist(bird.old.pos);
                if(dist < 10) {
                    e.remove();
                    
                    for(var i = 0; i < random(1, 5); i++) {
                        var e = Game.addChild(Game.Bird, { pos: bird.old.pos.copy()  });
                    }

                    return;
                }
            }

            e.state.rot = Math.atan2(e.state.vel.y, e.state.vel.x);
            e.state.pos.add(e.state.vel);
        }
    });

    Game.Food = new Game.Factory(function(e, args) {
        extend(e.state, {
            size: 5 * (Math.random() + 1),
            rot: Math.random() * 2 - 1,
            pos: randomVec(),
            vel: new Game.Vec({ x: Math.random() * 2 -1, y: Math.random() * 2 - 1 })
        },args);

        e.gfx = new PIXI.Sprite(Game.resources.food.texture);
        Game.Foods.add(e);

        return e;
    });

    Game.systems.push(Game.Foods);

})();
