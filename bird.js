(function() {
    var Obstacles = new Game.System();

    var Birds = new Game.System();

    extend(Birds, {
        SeparationWeight: 2,
        AlignWeight: 1,
        CohesionWeight: 1,
        ControllWeight: 1.5,

        MaxSpeed: 2,
        MaxForce: 0.03,

        NeighbourRadius: 300,
        ControllRadius: 200,
        DesiredSeparation: 10,

        step: function(e, dT) {
            var acc = this.flock(e).div(this.SeparationWeight + this.AlignWeight + this.CohesionWeight + this.CohesionWeight);
            acc.mul(100).mul(dT);
            
            e.state.vel.add(acc).mul(100).mul(dT).limit(e.MaxSpeed);

            e.state.rot = Math.atan2(e.state.vel.y, e.state.vel.x);

            e.state.pos.add(e.state.vel);

        },

        flock: function(e) {
            //--- Separate ---
            var separate = new Game.Vec();
            var count = 0;

            for(var b in Obstacles.entities) {
                var o = Obstacles.entities[b];
                if(o._dirty) continue;
                var dist = e.old.pos.dist(o.old.pos);
                if(dist > 0 && dist < o.old.size + e.old.size + this.DesiredSeparation) {
                    var v = new Game.Vec(e.old.pos);
                    v.sub(o.old.pos);
                    v.normalize();
                    v.div(dist);
                    separate.add(v);
                    count++;
                }
            }

            if(count > 0)
                separate.div(count);

            //--- Cohere and align ---
            var cohere = new Game.Vec();
            var align = new Game.Vec();
            count = 0;

            for(var b in this.entities) {
                var bird = this.entities[b];
                if(bird._dirty) continue;
                var dist = e.old.pos.dist(bird.old.pos);

                if(dist > 0 && dist < this.NeighbourRadius) {
                    cohere.add(bird.old.pos);
                    align.add(bird.old.vel);
                    count++;
                }
            }

            if(count > 0) {
                cohere = this.steer(e, cohere.div(count));
                align.div(count);
            }
            align.limit(e.MaxForce);


            //--- Controll ---
            var controll = new Game.Vec();
            var dist = e.old.pos.dist(Game.mouse);
            if(dist >  this.ControllRadius * 0.5 ) {
                controll = this.steer(e, Game.mouse).mul(this.ControllRadius).div(dist);
            }


            separate.mul(this.SeparationWeight);
            align.mul(this.AlignWeight);
            cohere.mul(this.CohesionWeight);
            controll.mul(this.ControllWeight);
            return separate.add(align).add(cohere).add(controll);
        },

        steer: function(e, target) {
            var desired = new Game.Vec(target);
            desired.sub(e.old.pos);
            var l = desired.length();
            if(l > 0) {
                desired.normalize();

                if(l < 100)
                    desired.mul(e.MaxSpeed * (l / 100));
                else 
                    desired.mul(e.MaxSpeed);

                var steer = desired.sub(e.old.vel);
                steer.limit(e.MaxForce);
            }
            else 
                var steer = new Game.Vec(0,0);

            return steer;
        }
    });

    var Bird = new Game.Factory(function(e, args) {
        extend(e.state, {
            size: 5 * (Math.random() + 1),
            vel: new Game.Vec({ x: Math.random() * 2 -1, y: Math.random() * 2 - 1 } ),
        }, args);

        extend(e, {
            MaxSpeed: Birds.MaxSpeed * (Math.random() + 1),
            MaxForce: Birds.MaxForce * (Math.random() + 1),
        });

        //e.gfx.tint = 0xFF3333;
        Birds.add(e);
        Obstacles.add(e);

        return e;
    });

    Game.Bird = Bird;
    Game.systems.push(Birds);
    Game.Birds = Birds;
})();
