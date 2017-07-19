define("solver", ["util"], function(util) {

    function getPlayerCardMap(game) {
        /* structure:
        {
            player id: {
                some: [[card, card...], [card, card...]...],
                none: [card, card...]
            },
            ...
        }
        */
        var map = {};
        for (var i = 0; i < game.players.length; i++) {
            map[i] = {some: [], none: []};
        }

        game.log.forEach(function(entry) {
            cards = ['w' + entry.guess.weapon, 'p' + entry.guess.player, 'r' + entry.guess.room];
            if (entry.has.some !== undefined)
                map[entry.has.some].some.push(cards);
            entry.has.none.forEach(function(p) {
                util.setExtend(map[p].none, cards);
            });
        });
        return map;
    }

    return {
        getPlayerCardMap: getPlayerCardMap,
    }
});
