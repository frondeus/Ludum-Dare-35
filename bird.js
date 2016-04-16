(function() {
    var Bird = function(x, y) {
        this.size = Bird.Size * (Math.random() + 1)
        {
            this.gfx = new PIXI.Graphics();
            this.gfx.beginFill(Bird.Color);
            this.gfx.drawCircle(0,0, this.size);
            this.gfx.endFill();
        }

        this.pos = new Game.Vec(0,0);
        this.pos.x = this.gfx.position.x = x;
        this.pos.y = this.gfx.position.y = y;
        this.vel = new Game.Vec(Math.random() * 2 - 1, Math.random() * 2 - 1);
    };

    Bird.Color = 0x0e74c3c;
    Bird.Size = 5;
    Bird.NeighbourRadius = 40;
    Bird.MaxSpeed = 10;
    Bird.MaxForce = 7;
    Bird.CohesionWeight = 0.1;
    Bird.DesiredSeparation = 3;
    Bird.SeparationWeight = 10;
    Bird.AlignWeight = 0.09;
    Bird.ControllWeight = 0.04;
    //Bird.ControllWeight = 0;
    Bird.ControllRadius  =  Bird.NeighbourRadius * 10;

    Bird.prototype = {
        step: function(neighbours, mouse) {
            var acc = this.flock(neighbours, mouse);
            this.vel.add(acc).limit(Bird.MaxSpeed);
            this.pos.add(this.vel).warp(Game.Width, Game.Height);

            this.gfx.position.x = this.pos.x;
            this.gfx.position.y = this.pos.y;
        },

        flock: function(neighbours, mouse) {
            var c = this.cohere(neighbours).mul(Bird.CohesionWeight);
            var s = this.separate(neighbours).mul(Bird.SeparationWeight);
            var a = this.align(neighbours).mul(Bird.AlignWeight);
            var st = this.controll(mouse).mul(Bird.ControllWeight);
            return s.add(a).add(c).add(st);
        },

        controll: function(mouse) { 
            var dist = this.pos.dist(mouse);
            if(dist > 0 && dist < Bird.ControllRadius)
                return this.steer(mouse);
            else return new Game.Vec(0, 0);
        },

        cohere: function(neighbours) {
            var sum = new Game.Vec(0, 0);
            var count = 0;
            for(var b in neighbours) {
                var bird = neighbours[b];
                var dist = this.pos.dist(bird.pos);
                if(dist > 0 && dist < Bird.NeighbourRadius)  {
                    sum.add(bird.pos);
                    count++;
                }
            }
            
            if(count > 0) return this.steer(sum.div(count));
            else return sum;
        },

        steer: function(target) {
            var desired = new Game.Vec(target.x, target.y);
            desired.sub(this.pos);
            var l = desired.length();
            if(l > 0) {
                desired.normalize();

                if(l < 100)
                    desired.mul(Bird.MaxSpeed * (l / 100));
                else 
                    desired.mul(Bird.MaxSpeed);

                var steer = desired.sub(this.vel);
                steer.limit(Bird.MaxForce);
            }
            else 
                var steer = new Game.Vec(0,0);

            return steer;
        },

        separate: function(neighbours) {
            var mean = new Game.Vec(0, 0);
            var count = 0;
            for(var b in neighbours) {
                var bird = neighbours[b];
                var dist = this.pos.dist(bird.pos);

                if(dist > 0 && dist < this.size * Bird.DesiredSeparation) {
                    var v = new Game.Vec(this.pos.x, this.pos.y);
                    v.sub(bird.pos);
                    v.normalize();
                    v.div(dist);
                    mean.add(v);
                    count ++;
                }
            }

            //if(count > 0) mean.div(count);
            return mean;
        },

        align: function(neighbours) {
            var mean = new Game.Vec(0, 0);
            var count = 0;
            for(var b in neighbours) {
                var bird = neighbours[b];
                var dist = this.pos.dist(bird.pos);
                if(dist > 0 && dist < Bird.NeighbourRadius) {
                    mean.add(bird.vel);
                    count++;
                }
            }

            if(count > 0) mean.div(count);
            mean.limit(Bird.MaxForce);
            return mean;
        }
    };

    Game.Bird = Bird;
})();
