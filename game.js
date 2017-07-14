define("game", ["game-data"], function(gameData) {
    function Game(id) {
        this.id = id;
        this.gameType = '';
        this.players = [];
        this.log = [];
    }

    Game.prototype = {
    }

    return Game;
});
