(function() {
    var Obstacles = new Game.System();

    var Birds = new Game.System();
    extend(Birds, {
        SeparationWeight: 5,
        AlignWeight: 1,
        CohesionWeight: 1,
        ControllWeight: 5.5,

        MaxSpeed: 2,
        MaxForce: 0.05,

        NeighbourRadius: 100,
        ControllRadius: 400,
        DesiredSeparation: 10,

        step: function( e ,dt ) {
            var acc = this.flock( e ).div(this.SeparationWeight + this.AlignWeight + this.CohesionWeight + this.ControllWeight);
            acc.mul(dt * 100);
            e.vel.add(acc);
            e.vel.mul(dt * 100);
            e.vel.limit(e.MaxSpeed);

            e.pos.add(e.vel).warp(Game.Width, Game.Height);

            var rot = Math.atan2(e.vel.y, e.vel.x) ;
            e.rotation = rot;

            e._vel.x = e.vel.x;
            e._vel.y = e.vel.y;
        },

        flock: function(e) {
            //--- Separate ---
            var separate = new Game.Vec(0, 0);
            var count = 0;

            for(var b in Obstacles.entities) {
                var o = Obstacles.entities[b];
                var dist = e._pos.dist(o._pos);
                if(dist > 0 && dist < o.size + e.size + this.DesiredSeparation) {
                    var v = new Game.Vec(e._pos.x, e._pos.y);
                    v.sub(o._pos);
                    v.normalize();
                    v.div(dist);
                    separate.add(v);
                    count++;
                }
            }

            if(count > 0)
                separate.div(count);
            
            //--- Cohere and align ---
            var cohere = new Game.Vec(0, 0);
            var align = new Game.Vec(0, 0);
            count = 0;

            for(var b in this.entities) {
                var bird = this.entities[b];
                var dist = e._pos.dist(bird._pos);

                if(dist > 0 && dist < this.NeighbourRadius) {
                    cohere.add(bird._pos);
                    align.add(bird._vel);
                    count++;
                }
            }

            if(count > 0) {
                cohere = this.steer(e, cohere.div(count));
                align.div(count);
            }
            align.limit(e.MaxForce);

            //--- Controll ---
            var controll = new Game.Vec(0, 0);
            var dist = e._pos.dist(Game.mouse);
            if(dist >  this.ControllRadius * 0.5 && dist < this.ControllRadius) {
                controll = this.steer(e, Game.mouse);
            }
            //controll.limit(e.MaxForce);


            separate.mul(this.SeparationWeight);
            align.mul(this.AlignWeight);
            cohere.mul(this.CohesionWeight);
            controll.mul(this.ControllWeight);
            return separate.add(align).add(cohere).add(controll);
        },
        
        steer: function(e, target) {
            var desired = new Game.Vec(target.x, target.y);
            desired.sub(e._pos);
            var l = desired.length();
            if(l > 0) {
                desired.normalize();

                if(l < 100)
                    desired.mul(e.MaxSpeed * (l / 100));
                else 
                    desired.mul(e.MaxSpeed);

                var steer = desired.sub(e._vel);
                steer.limit(e.MaxForce);
            }
            else 
                var steer = new Game.Vec(0,0);

            return steer;
        },

        
    });


    var Bird = function(args) {
        var e = new Game.Entity(args);

        extend(e, {
            size: Bird.Size * (Math.random() + 1),
            vel: new Game.Vec(Math.random() * 2 - 1, Math.random() * 2 - 1),
            MaxSpeed: Birds.MaxSpeed * (Math.random() + 1),
            MaxForce: Birds.MaxForce * (Math.random() + 1),
        }, args);

        e.gfx = new PIXI.Sprite(Game.resources.bird.texture);
        e.gfx.tint = 0xFF3333;

        e._pos = new Game.Vec(e.pos.x, e.pos.y);
        e._vel = new Game.Vec(e.vel.x, e.vel.y);
        Birds.add(e);
        Obstacles.add(e);
        return e;
    };

    Bird.Color = 0x0e74c3c;
    Bird.Size = 5;


    Game.Bird = Bird;
    Game.Birds = Birds;
    Game.Obstacles = Obstacles;
    Game.systems.push(Birds);
})();
