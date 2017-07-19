define("tests/test-main", ["game", "solver"], function(Game, solver) {

    function log(msg) {
        $('body').append($('<div>').css({whiteSpace: 'pre'}).text(msg));
    }

    function wrapLog(func) {
        try {
            func();
        }
        catch(e) {
            log(e.stack || e);
            throw e;
        }
    }

    function assert(expr, msg) {
        if (!expr)
            throw new Error("assertion failed: " + msg);
    }


    function arraysEqual(a1, a2) {
        a1 = a1.sort();
        a2 = a2.sort();
        for (var i = 0; i < a1.length; i++) {
            if (a1[i] == a2[i])
                continue;
            if (a1[i] instanceof Array && a2[i] instanceof Array && arraysEqual(a1[i], a2[i]))
                continue;
            return false;
        }
        return true;
    }

    function assertArrayContentsEqual(a1, a2) {
        var msg = "Arrays not equal: [" + [a1, a2].join('], [') + ']';
        assert(a1.length == a2.length, msg + " (length mismatch)")
        assert(arraysEqual(a1, a2), msg);
    }

    var game = new Game({type: 'parker'});
    for (var i = 0; i < 5; i++)
        game.players.push(game.newPlayer());

    function mklog(player, guess, none, some) {
        var e = game.newLogEntry();
        e.player = player;
        e.guess.player = guess[0];
        e.guess.weapon = guess[1];
        e.guess.room = guess[2];
        e.has.none = none;
        e.has.some = some;
        return e;
    }

    function main() {
        var e1 = mklog(1, [4, 5, 6], [2], 3);
        game.log.push(e1);

        var cmap = solver.getPlayerCardMap(game);
        console.log(cmap);
        // no info about what players except 3 could have
        assertArrayContentsEqual(cmap[0].some, []);
        assertArrayContentsEqual(cmap[1].some, []);
        assertArrayContentsEqual(cmap[2].some, []);
        assertArrayContentsEqual(cmap[4].some, []);
        // no info about what players except 2 could not have
        assertArrayContentsEqual(cmap[0].none, []);
        assertArrayContentsEqual(cmap[1].none, []);
        assertArrayContentsEqual(cmap[3].none, []);
        assertArrayContentsEqual(cmap[4].none, []);
        // player 3 has some of cards [p4, w5, r6]
        assertArrayContentsEqual(cmap[3].some, [['p4', 'w5', 'r6']]);
        // player 2 has none of those
        assertArrayContentsEqual(cmap[2].none, ['p4', 'w5', 'r6']);
    }

    wrapLog(main);
    log('done');

});
