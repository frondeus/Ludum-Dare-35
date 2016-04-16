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

    var Factory = function(Cons) {
        this.Cons = Cons;
        this.queue = [];
        this.size = 16;
    };

    Factory.prototype = {
        create: function(args) {
            if(this.queue.length <= 0) {
                for(var i = 0; i < this.size; i++)
                this.queue.push(new Entity());
                this.size *= this.size;
            }

            var e = this.queue.shift();
            this.Cons(e, args);
            e.factory = this;
            return e;
        }
    };

    var State = function(){
        this.pos = new Game.Vec(Game.Mid);
        this.size = 30;
        this.vel = new Game.Vec({x: 0, y: 0});
        this.rot = 0;
    };

    var defaultGfx = function() {
        var gfx = new PIXI.Graphics();
        gfx.beginFill(0xFFFFFF);
        gfx.drawCircle(0, 0, 0.5);
        gfx.endFill();
        return gfx;
    };

    var Entity = function(Cons, args) {
        extend(this, {
            state: new State(),
            old: new State(),
            //gfx: defaultGfx(),
            gfx: new PIXI.Sprite(Game.resources.bird.texture),
            _dirty: false
        }, args);

        //this.gfx.tint = 0xFFFFFF;
    };

    Entity.prototype.remove = function() {
        this._dirty = true;
    };

    Game.System = System;
    Game.State = State;
    Game.Entity = Entity;
    Game.Factory = Factory;
    Game.systems = [];


})();
