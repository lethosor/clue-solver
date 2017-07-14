define("ui/game-editor", ["ui", "main"], function(ui, main) {
    function GameEditor() {

    }

    $.extend(GameEditor.prototype, ui.View.prototype, {
        draw: function() {
            this.elt.find('#game-id').text(this.data.game.id);
        },
        delete: function() {
            main.gameManager.deleteGame(this.data.game);
            ui.hideView(this.id);
            ui.showView('game-list');
        }
    });

    return GameEditor;
})
