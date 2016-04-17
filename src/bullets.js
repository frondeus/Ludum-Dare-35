(function() {
    Game.Bullets = new Game.System();

    extend(Game.Bullets, {
        step: function(e, dT) {
            e.state.vel.mul(100).mul(dT);

            e.state.rot = Math.atan2(e.state.vel.y, e.state.vel.x);
            e.state.pos.add(e.state.vel);

            for(var b in Game.Birds.entities) {
                var bird = Game.Birds.entities[b];
                if(bird._dirty) continue;
                var dist = bird.old.pos.dist(e.old.pos);
                if(dist > 0 && dist < 5) {
                    bird.remove();
                }
            }

            for(var o in Game.Obstacles.entities) {
                var ob = Game.Obstacles.entities[o];

                if(ob._dirty) continue;
                var dist = ob.old.pos.dist(e.old.pos);
                if(dist > 0 && dist < 5) {
                    e.remove();
                }
            }
        }
    });

    Game.systems.push(Game.Bullets);

    Game.Bullet = new Game.Factory(function(e, args) {
        var ang  = Math.random() * 10;
        extend(e.state, {
            size: 5 * (Math.random() + 1),
            pos: new Game.Vec({
                x: Game.Mid.x  + ( Math.sin(ang) * Game.edgeSize),
                y: Game.Mid.y  + ( Math.cos(ang) * Game.edgeSize),
            })

        }, args);

        e.state.vel = Game.Mid.copy().sub(e.state.pos).normalize().mul(Math.random() * 1 + 1);
        

        e.gfx = new PIXI.Sprite(Game.resources.bullets.texture);
        extend(e, {
            Separate: 1
        });

        Game.Obstacles.add(e);
        Game.Bullets.add(e);
        return e;
    });
})();
