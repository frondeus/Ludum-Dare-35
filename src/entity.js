(function() {
    Game.systems = [];
    Game.System = function() {
        this.ent = [];
        Game.systems.push(this);
    };

    Game.System.prototype = {
        add: function(e) {
            this.ent.push(e);
            e.systems.push(this);
        },

        remove: function(e) {
            if(e > -1) this.ent.splice(e, 1);
        },

        /*
        clean: function() {
            for(var e in this.ent) {
                if(this.ent[e]._dirty) 
                    this.remove(e);
            }
        }
        */
    };

    var State = function(args) {
        extend(this, {
            pos: new Game.Vec(Game.Mid),
            size: 30,
            vel: new Game.Vec({x: 0, y: 0}),
            rot: Math.random() * 10
        }, args);
    };

    State.prototype.copy = function() {
        var s = new State();
        s.pos = this.pos.copy();
        s.size = this.size;
        s.vel = this.vel.copy();
        s.rot = this.rot;
        return s;
    };

    Game.Factory = function(cons, stateCons) {
        this.cons = cons;
        this.stateCons = stateCons;
        this.queue = [];
        this.gfx = new PIXI.ParticleContainer(300, {
            scale: true,
            rotation: true,
            position: true
        });
        this.size = 64;
        this.count = 0;
    };

    Game.Factory.prototype = {
        init: function() {
            for(var i = 0; i < this.size; i++) this.createEn();
            Game.stage.addChild(this.gfx);
        },

        createEn: function() {
            var en = new Game.Entity();
            this.cons(en);
            en.factory = this;
            en.gfx = new PIXI.Sprite(Game.resources[en.gfx_texture].texture);
            this.queue.push(en);
        },

        create: function(args) {
            if(this.queue.length <= 0) {
                console.log("Allocate: " + this.size);
                for(var i = 0; i < this.size; i++) this.createEn();
                this.size *= 2;
            }

            var en = this.queue.pop();
            this.stateCons(en, args);
            en.old = en.state.copy();
            en._dirty = false;
            this.gfx.addChild(en.gfx);
            this.count++;

            return en;
        },

        remove: function(en) {
            this.count--;
            this.queue.push(en);
            en._dirty = true;
            this.gfx.removeChild(en.gfx);
        }
    };

    Game.Entity = function() { 
        extend(this, {
            state: new State(),
            old: new State(),
            gfx_texture: "bird",
            _dirty: true,
            systems: []
        });

        Game.SimpleMovement.add(this);
    };

    Game.Entity.prototype.remove = function() {
        this.factory.remove(this);
    };

    Game.SimpleMovement = new Game.System();
    Game.SimpleMovement.step = function(en, dt) {
        if(en.old.pos.x < 0 || en.old.pos.x > Game.Width ||
        en.old.pos.y < 0 || en.old.pos.y > Game.Height ) {
            en.remove();    
            return;
        }

        //en.state.vel.mul(100).mul(dt);

        en.state.rot = Math.atan2(en.state.vel.y, en.state.vel.x);
        en.state.pos.add(en.state.vel);
    };

})();
