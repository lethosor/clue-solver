define("game", ["game-data"], function(gameData) {
    function Game(id, data) {
        data = data || {};
        this.id = id;
        this.type = data.type || '';
        this.players = data.players || [];
        /*
        Log format:
        {
            player: id,
            guess: {
                player: id,
                weapon: id,
                room: id
            },
            has: {
                some: id,
                card: ('p'|'w'|'r' + card_id) || undefined,
                none: [id...]
            }
        }
        */
        this.log = data.log || [];
    }

    Game.prototype = {
        newPlayer: function() {
            var data = gameData[this.type];
            if (!data)
                return;

            // available_players = [true] * data.players.length
            var available_players = data.players.map(function() { return true; });
            this.players.forEach(function(player) {
                available_players[player.player] = false;
            });

            return {
                name: "",
                player: available_players.indexOf(true),
            };
        },
        getPlayerName: function(id, allow_empty) {
            if (!this.players[id].name && !allow_empty)
                return 'Player ' + (id + 1);
            return this.players[id].name;
        },
        getCardName: function(id) {
            var type = id[0];
            var num = Number(id.match(/\d+$/));
            if (type == 'p')
                return this.gameData.players[num].name;
            else if (type == 'r')
                return this.gameData.rooms[num];
            else if (type == 'w')
                return this.gameData.weapons[num];
        },
        newLogEntry: function() {
            return {
                player: undefined,
                guess: {
                    player: undefined,
                    weapon: undefined,
                    room: undefined
                },
                has: {
                    some: undefined,
                    none: []
                }
            }
        },
    }

    Object.defineProperties(Game.prototype, {
        typeName: {
            get: function() {
                if (!this.type)
                    return '(not set up)';
                if (!gameData[this.type])
                    return '(no name)';
                return gameData[this.type].name;
            },
        },
        gameData: {
            get: function() {
                return gameData[this.type];
            },
        },
    });

    return Game;
});
