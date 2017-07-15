define("main", ["ui", "game-manager"], function(ui, GameManager) {
    gameManager = new GameManager();

    $(function() {
        ui.init();
        ui.onReady(function() {
            ui.showView("game-list");
        });
    });

    return {
        gameManager: gameManager,
    }
});
