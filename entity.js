(function() {
    window.extend = function() {
        for (var i = 1; i < arguments.length; i++)
            for (var j in arguments[i])
                arguments[0][j] = arguments[i][j];
        return arguments[0];
    };
    window.random = function(min, max) {
        return Math.random() * (max - min) + min;
    };

    var defaultGfx = function(color, size) {
        var gfx = new PIXI.Graphics();
        gfx.beginFill(color);
        gfx.drawCircle(0, 0, size);
        gfx.endFill();
        return gfx;
    };

    var System = function() {
        this.entities = [];
    };

    System.prototype = {
        is: function(e) {
            return(this.entities.indexOf(e) > -1);
        },

        add: function(e) {
            if(this.entities.indexOf(e) < 0)
                this.entities.push(e);
        },

        remove: function(e) {
            var i = this.entities.indexOf(e);
            if(i > -1)
                this.entities.splice(i, 1);
        },

        clean: function(e) {
            for(var e in this.entities) {
                if(this.entities[e].removed) this.remove(this.entities[e]);
            }
        }

    };

    var SimpleMovement = new System();
    SimpleMovement.step = function(e) {
        e.gfx.position.x = e.pos.x;
        e.gfx.position.y = e.pos.y;
    };

    var Entity = function(args) {
        extend(this, {
            pos: new Game.Vec(random(100, Game.Width - 100), random(100, Game.Height - 100)),
            size: 30,
            gfx: defaultGfx(0xFFFFFF, 30),
        }, args);

        this._pos = new Game.Vec(this.pos.x, this.pos.y);
        SimpleMovement.add(this);
    };

    Entity.prototype.remove = function() {
        this.removed = true;
        Game.removed.push(this);
    };

    Game.defaultGfx = defaultGfx;
    Game.System = System;
    Game.Entity = Entity;
    Game.removed = [];
    Game.systems = [SimpleMovement];
})();
