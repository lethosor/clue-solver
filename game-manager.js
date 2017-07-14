define("game-manager", ["game"], function(Game) {
    function GameManager() {
        this.games = [];
    }

    GameManager.prototype = {
        addGame: function() {
            this.games.push(new Game());
        },
        listGames: function() {
            return this.games;
        },
    };

    return GameManager;
});
