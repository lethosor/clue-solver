define("ui/game-list", ["ui", "main"], function(ui, main) {
    function GameList() {

    }

    $.extend(GameList.prototype, ui.View.prototype, {
        create: function() {
            ui.hideView(this.id);
            ui.showView('game-editor', {game: gameManager.addGame()});
        },
        draw: function() {
            var list = this.elt.find('.list-group').html('');
            main.gameManager.listGames().forEach(function(game) {
                list.append(ui.renderTemplate('game-list-item', game));
            });
            main.gameManager.save();
        },
        select: function(elt) {
            ui.hideView(this.id);
            ui.showView('game-play', {game: gameManager.findGame(elt.attr('data-game-id'))});
        },
        edit: function(elt) {
            ui.hideView(this.id);
            ui.showView('game-editor', {game: gameManager.findGame(elt.parent().attr('data-game-id'))});
        },
    });

    return GameList;
});
