define("main", ["ui", "game-manager"], function(ui, GameManager) {
    console.log('main');

    gameManager = new GameManager();

    ui.init();
    ui.onReady(function() {
        ui.showView("game-list");
    });

    return {
        gameManager: gameManager,
    }
});
