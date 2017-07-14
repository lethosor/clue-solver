define("ui/game-list", ["ui", "main"], function(ui, main) {
    function GameList() {

    }

    $.extend(GameList.prototype, ui.View.prototype, {
        create: function() {
            main.gameManager.addGame();
        },
        show: function() {

        }
    });

    return GameList;
});
