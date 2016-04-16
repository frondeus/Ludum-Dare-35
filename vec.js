(function() {
    var Vec = function(v) {
        if(v === undefined) {
            v = {x: 0, y: 0};
        }
        this.x = v.x;
        this.y = v.y;
    };

    Vec.prototype = {
        copy: function() {
            return new Vec(this);
        },

        add: function(other) {
            this.x += other.x;
            this.y += other.y;
            return this;
        },

        sub: function(other) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        },

        mul: function(x) {
            this.x *= x;
            this.y *= x;
            return this;
        },

        div: function(x) {
            this.x /= x;
            this.y /= x;
            return this;
        },



        limit: function(max) {
            if(this.x > max) this.x = max;
            if(this.y > max) this.y = max;
            if(this.x < -max) this.x = -max;
            if(this.y < -max) this.y = -max;
            return this;
        },

        warp: function(width, height) {
            while(this.x < 0) this.x += width;
            while(this.x > width) this.x -= width;

            while(this.y < 0) this.y += height;
            while(this.y > height) this.y -= height;
        },

        dist: function(other) {
            var dX = Math.abs(this.x - other.x);
            var dY = Math.abs(this.y - other.y);

            return Math.sqrt(dX * dX + dY * dY);

            return Math.sqrt(
                Math.min(dX, Game.Width - dX) * Math.min(dX, Game.Width - dX)
                +
                Math.min(dY, Game.Height - dY) * Math.min(dY, Game.Height - dY)
            );

        },

        length: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        normalize: function() {
            var l = this.length();
            if(l > 0) {
                this.x /= l;
                this.y /= l;
            }
            return this;
        }

    };

    window.randomVec = function() {
        return new Vec({x : random(100, Game.Width - 100), y: random(100, Game.Height - 100)});
    };

    Game.Vec = Vec;
})();
