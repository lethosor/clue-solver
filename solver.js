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

    function getCardMatrix(game, cardMap) {
        var baseEntry = {};
        for (var i = 0; i < game.gameData.players.length; i++)
            baseEntry['p' + i] = 'unknown';
        for (var i = 0; i < game.gameData.weapons.length; i++)
            baseEntry['w' + i] = 'unknown';
        for (var i = 0; i < game.gameData.rooms.length; i++)
            baseEntry['r' + i] = 'unknown';

        var matrix = game.players.map(function(_, i) {
            var entry = $.extend({}, baseEntry);

            cardMap[i].some.forEach(function(cards) {
                cards.forEach(function(card) {
                    entry[card] = 'maybe';
                })
            });

            cardMap[i].none.forEach(function(card) {
                entry[card] = 'no';
            });

            return entry;
        });

        return matrix;
    }

    return {
        getPlayerCardMap: getPlayerCardMap,
        getCardMatrix: getCardMatrix,
    }
});
