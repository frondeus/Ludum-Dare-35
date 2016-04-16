(function() {


    var Food = function(args) {
        var e = new Game.Entity(args);

        extend(e, {
            size: 40 * (Math.random() + 1)
        }, args);

        e.gfx = Game.defaultGfx(0xFFFFFF, e.size * 0.25);
        Game.Obstacles.add(e);

        return e;
    };

    Game.Food = Food;
})();
