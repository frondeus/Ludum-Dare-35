(function() {
    Game.Bullets = new Game.System();
    
    extend(Game.Bullets, {
        step: function(en, dt) {

            for(var o in Game.Obstacles.ent) {
                var ob = Game.Obstacles.ent[o];

                if(ob._dirty) continue;
                var dist = ob.old.pos.dist(en.old.pos);
                if(dist > 0 && dist < 20) {
                    en.remove();
                    ob.remove();
                }
            }

        }
    });

    Game.Bullet = new Game.Factory(function(en) {
        extend(en, {
            gfx_texture: "bullets",
            Separate: 1
        });
        Game.Bullets.add(en);
        Game.Obstacles.add(en);
        return en;
    }, function(en, args) {
        var ang = Math.random() * 10;
        extend(en.state, {
            size: 5 * (Math.random() + 1),
            pos: new Game.Vec({
                x: Game.Mid.x  + ( Math.sin(ang) * Game.edgeSize),
                y: Game.Mid.y  + ( Math.cos(ang) * Game.edgeSize),
            })
        },args);
        en.state.vel = Game.Mid.copy().sub(en.state.pos).normalize().mul(Math.random() * 1 + 1);
        return en;
    });
})();
