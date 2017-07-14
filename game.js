define("game", ["game-data"], function(gameData) {
    function Game() {
        this.gameType = '';
        this.players = [];
        this.log = [];
    }

    Game.prototype = {
        serialize: function() {
            return JSON.stringify(this);
        },
    }

    return Game;
});
