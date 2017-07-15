define("game", ["game-data"], function(gameData) {
    function Game(id, data) {
        data = data || {};
        this.id = id;
        this.type = data.type || '';
        this.players = data.players || [];
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
    });

    return Game;
});
