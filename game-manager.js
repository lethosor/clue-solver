define("game-manager", ["game"], function(Game) {
    function GameManager() {
        this.games = this.load() || [];
        this.next_id = this.getNextId();
    }

    GameManager.prototype = {
        addGame: function() {
            var game = new Game(this.next_id++);
            this.games.push(game);
            this.save();
            return game;
        },
        deleteGame: function(game) {
            var index = this.games.indexOf(game);
            if (index == -1)
                throw new Error("Bad game");
            this.games.splice(index, 1);
        },
        findGame: function(id) {
            for (var i = 0; i < this.games.length; i++)
                if (this.games[i].id == id)
                    return this.games[i];
        },
        listGames: function() {
            return this.games;
        },
        getNextId: function() {
            var next = 1;
            this.games.forEach(function(g) {
                next = Math.max(next, g.id + 1);
            });
            return next;
        },
        load: function() {
            return (JSON.parse(localStorage.getItem('games')) || []).map(function(game) {
                return new Game(game.id, game);
            });
        },
        save: function() {
            localStorage.setItem('games', JSON.stringify(this.games));
        },
    };

    return GameManager;
});
