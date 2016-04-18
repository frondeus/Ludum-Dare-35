(function() {
    Game.Obstacles = new Game.System();

    Game.Birds = new Game.System();

    extend(Game.Birds, {
        SeparationWeight: 2,
        AlignWeight: 1,
        CohesionWeight: 1,
        ControllWeight: 1,

        MaxSpeed: 2,
        MaxForce: 0.01,

        NeighbourRadius: 30,
        ControllRadius: 60,
        DesiredSeparation: 20,

        separate: new Game.Vec(),
        cohere: new Game.Vec(),
        align: new Game.Vec(),
        controll: new Game.Vec(),

        step: function(en, dT) {
            var acc = this.flock(en).div(
                this.SeparationWeight + 
                this.AlignWeight + 
                this.CohesionWeight +
                this.ControllWeight
            ).mul(100).mul(dT);

            en.state.vel.add(acc).limit(en.MaxSpeed);
        },

        flock: function(en) {
            //--- Separate ---
            this.separate.zero();
            var count = 0;

            for(var b in Game.Obstacles.ent) {
                var o = Game.Obstacles.ent[b];
                if(o._dirty) continue;
                var dist = en.old.pos.dist(o.old.pos);
                if(dist > 0 && dist < (o.old.size * o.Sepearate) + (en.Separate * en.old.size) + this.DesiredSeparation) {
                    var v = new Game.Vec(e.old.pos);
                    v.sub(o.old.pos);
                    v.normalize();
                    v.div(dist);
                    this.separate.add(v);
                    count++;
                }
            }

            if(count > 0)
                this.separate.div(count);

            //--- Cohere and align ---
            this.cohere.zero();
            this.align.zero();
            count = 0;

            for(var b in this.ent) {
                var bird = this.ent[b];
                if(bird._dirty) continue;
                var dist = en.old.pos.dist(bird.old.pos);

                if(dist > 0 && dist < this.NeighbourRadius) {
                    this.cohere.add(bird.old.pos);
                    this.align.add(bird.old.vel);
                    count++;
                }
            }

            if(count > 0) {
                this.cohere = this.steer(en, this.cohere.div(count));
                this.align.div(count);
            }
            //else this.cohere = en.old.pos.copy();
            this.align.limit(en.MaxForce);


            //--- Controll ---
            var dist = en.old.pos.dist(Game.mouse);
            if(dist > this.ControllRadius) {
                this.controll.set(
                    Game.mouse.x + Math.random() * 200 - 100,
                    Game.mouse.y + Math.random() * 200 - 100
                );
                this.controll.sub(en.old.pos);
                this.controll.mul(30);
                this.controll.div(dist * dist);
                this.controll.limit(10 * en.MaxForce);
            }


            this.separate.mul(this.SeparationWeight);
            this.align.mul(this.AlignWeight);
            this.cohere.mul(this.CohesionWeight);
            this.controll.mul(this.ControllWeight);
            return this.separate
            .add(this.align)
            .add(this.cohere)
            .add(this.controll);

        },

        steer: function(e, target) {
            var desired = new Game.Vec(target);
            desired.sub(e.old.pos);
            var l = desired.length();
            if(l > 0) {
                desired.normalize();

                if(l < 100) desired.mul(e.MaxSpeed * (l / 100));
                else desired.mul(e.MaxSpeed);

                var s = desired.sub(e.old.vel);
                s.limit(e.MaxForce);
                return s;
            }
            else return new Game.Vec(0,0);
        }

    });

    Game.Bird = new Game.Factory(function(en) {

        extend(en, {
            MaxSpeed: Game.Birds.MaxSpeed * (Math.random() + 1),
            MaxForce: Game.Birds.MaxForce * (Math.random() + 1),
            Separate: 1
        });

        Game.Birds.add(en);
        Game.Obstacles.add(en);
        return en;

    }, function(en, args) {

        extend(en.state, {
            size: 5 * (Math.random() + 1),
            vel: new Game.Vec({ x: Math.random() * 2 -1, y: Math.random() * 2 - 1 } ),
            pos: new Game.Vec( {
                x: Game.Mid.x + Math.sin(Math.random() * 10) * 100,
                y: Game.Mid.y + Math.cos(Math.random() * 10) * 100,
            })
        },args);
        return en;
    });

})();
