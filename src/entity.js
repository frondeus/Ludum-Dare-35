(function() {
    var System = function() {
        this.entities = [];
    };

    
    System.prototype = {
        add: function(e) {
            this.entities.push(e);
        },

        remove: function(e) {
            if(e > -1) this.entities.splice(e, 1);
        },
        
        clean: function() {
            for(var e in this.entities) {
                if(this.entities[e]._dirty) {
                    this.remove(e);
                }
            }
        }
    };

    var State = function(){
        this.pos = new Game.Vec(Game.Mid);
        this.size = 30;
        this.vel = new Game.Vec({x: 0, y: 0});
        this.rot = 0;
    };


    var Factory = function(Cons) {
        this.Cons = Cons;
        this.queue = [];
        this.gfx = new PIXI.ParticleContainer(1500, {
            scale: true,
            rotation: true,
            position: true
        });
        this.size = 16;
        this.count = 0;
    };

    Factory.prototype = {
        create: function(args) {
            if(this.queue.length <= 0) {
                for(var i = 0; i < this.size; i++)
                this.queue.push(new Entity());
                this.size *= this.size;
            }

            var e = this.queue.shift();
            e.state = new State();
            e.old = new State();
            this.Cons(e, args);
            e.factory = this;
            this.gfx.addChild(e.gfx);
            this.count++;

            e.old.pos = e.state.pos.copy();
            e.old.size = e.state.size;
            e.old.vel = e.state.vel.copy();
            e.old.rot = e.state.rot;
            return e;
        }
    };
    var defaultGfx = function() {
        var gfx = new PIXI.Graphics();
        gfx.beginFill(0xFFFFFF);
        gfx.drawCircle(0, 0, 0.5);
        gfx.endFill();
        return gfx;
    };

    var SimpleMovementSystem  = new System();
    SimpleMovementSystem.step = function(e, dT) { 
        if(e.old.pos.x < 0 || e.old.pos.x > Game.Width || e.old.pos.y < 0 || e.old.pos.y > Game.Height) {
            console.log("Not in screeen");
            e.remove();
        }
    };

    var Entity = function(args) {
        extend(this, {
            state: new State(),
            old: new State(),
            gfx: new PIXI.Sprite(Game.resources.bird.texture),
            _dirty: false
        }, args);

        SimpleMovementSystem.add(this);
    };

    Entity.prototype.remove = function() {
        this._dirty = true;
    };

    Game.System = System;
    Game.State = State;
    Game.Entity = Entity;
    Game.Factory = Factory;
    Game.systems = [SimpleMovementSystem];


})();
