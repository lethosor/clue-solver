define("solver", ["util"], function(util) {

    function getPlayerCardMap(game) {
        /* structure:
        {
            player id: {
                known: [card, card...],
                some: [[card, card...], [card, card...]...],
                none: [card, card...]
            },
            ...
        }
        */
        var map = {};
        for (var i = 0; i < game.players.length; i++) {
            map[i] = {known: [], some: [], none: []};
        }

        game.log.forEach(function(entry) {
            if (entry.deleted)
                return;

            cards = ['w' + entry.guess.weapon, 'p' + entry.guess.player, 'r' + entry.guess.room];
            if (entry.card) {
                map[entry.has.some].known.push(entry.card);
            }
            else if (entry.has.some !== undefined) {
                map[entry.has.some].some.push(cards);
            }
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

            cardMap[i].known.forEach(function(card) {
                entry[card] = 'yes';
            });

            return entry;
        });

        return matrix;
    }

    function solve(game) {
        var changed;
        var cardMap = getPlayerCardMap(game);

        do {
            changed = false;

            // add known cards to everyone else's "none"
            // (only do this once!)
            for (var pi = 0; pi < game.players.length; pi++) {
                for (var ki = 0; ki < cardMap[pi].known.length; ki++) {
                    for (var pi2 = 0; pi2 < game.players.length; pi2++) {
                        if (pi != pi2) {
                            util.setExtend(cardMap[pi2].none, [cardMap[pi].known[ki]]);
                        }
                    }
                }
            }

            for (var pi = 0; pi < game.players.length; pi++) {
                // remove any entries that appear in "none" from "some"
                for (var ni = 0; ni < cardMap[pi].none.length; ni++) {
                    for (var si = 0; si < cardMap[pi].some.length; si++) {
                        changed = changed || util.arrayRemove(cardMap[pi].some[si], cardMap[pi].none[ni]);
                    }
                }

                // move any one-element arrays from "some" to "known"
                for (var si = 0; si < cardMap[pi].some.length; si++) {
                    var some = cardMap[pi].some;
                    if (some[si].length == 1) {
                        changed = true;
                        util.setExtend(cardMap[pi].known, some[si]);
                        // remove from "some" and adjust loop index
                        some.splice(si, 1);
                        si--;
                    }
                }
            }

        } while (changed);

        return cardMap;
    }

    function getNumSolutions(game) {
        var cardMap = solve(game);
        var mat = getCardMatrix(game, cardMap);
        var ok_cards = {p: {}, r: {}, w: {}}
        for (var pi = 0; pi < game.players.length; pi++) {
            $.each(mat[pi], function(key, val) {
                var type = key[0];
                var id = Number(key.substr(1));
                if (val == 'yes')
                    ok_cards[type][id] = false;
                else if (ok_cards[type][id] != false)
                    ok_cards[type][id] = true;
            });
        }

        var counts = {p: 0, r: 0, w: 0};
        $.each(counts, function(type) {
            $.each(ok_cards[type], function(_, val) {
                if (val)
                    counts[type]++;
            });
        });

        // check if all players don't have a card - this must be a solution card
        $.each(mat[0], function(card_id, val) {
            var might_have = false;
            for (var pi = 0; pi < mat.length; pi++) {
                if (mat[pi][card_id] != 'no') {
                    // someone has (or could have) this card
                    might_have = true;
                }
            }

            if (!might_have) {
                // nobody possibly has this card
                counts[card_id[0]] = 1;
            }
        });

        return counts.p * counts.r * counts.w;
    }

    return {
        getPlayerCardMap: getPlayerCardMap,
        getCardMatrix: getCardMatrix,
        solve: solve,
        getNumSolutions: getNumSolutions,
    }
});
