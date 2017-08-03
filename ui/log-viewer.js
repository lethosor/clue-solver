define("ui/log-viewer", ["ui", "main"], function(ui, main) {

    function LogViewer(elt) {
    }

    $.extend(LogViewer.prototype, ui.View.prototype, {
        show: function() {
            var game = this.game = this.data.game;
            this.elt.find('#game-id').text(game.id);
            this.elt.find('.list-group').html('');
            this.elt.find('#no-entries').toggleClass('hidden', game.log.length != 0);
            for (var i = game.log.length - 1; i >= 0; i--) {
                var entry = game.log[i];
                this.elt.find('.list-group').append(ui.renderTemplate('log-entry', {
                    index: i,
                    color: game.gameData.players[entry.player].color,
                    name: game.getPlayerName(entry.player),
                    player_name: game.gameData.players[entry.player].name,
                    cards: [
                        'p' + entry.guess.player,
                        'r' + entry.guess.room,
                        'w' + entry.guess.weapon
                    ].map(game.getCardName.bind(game)).join(', '),
                    some_name: entry.has.some == undefined ? 'none' : game.getPlayerName(entry.has.some),
                    none_names: entry.has.none.map(function(player_id) {
                        return game.getPlayerName(player_id);
                    }).join(', '),
                    known_card: entry.card ? ('(' + game.getCardName(entry.card) + ')') : '',
                }));
                this._updateDeleteButton(i, this.elt.find('.list-group-item:last [href="#delete"]'))
            }
        },
        back: function() {
            ui.hideView(this.id);
            ui.showView('game-play', {game: this.game});
        },
        _getIndex: function(elt) {
            var index = Number(elt.closest('.list-group-item').attr('data-index'));
            if (!this.game.log[index])
                throw new Error("Invalid log index: " + index);
            return index;
        },
        _updateDeleteButton: function(index, button) {
            var state = !!this.game.log[index].deleted;
            button.toggleClass('btn-danger', !state).toggleClass('btn-default', state)
                .text(state ? 'Undelete' : 'Delete');
        },
        edit: function(elt) {
            var index = this._getIndex(elt);
        },
        delete: function(elt) {
            var index = this._getIndex(elt);
            this.game.log[index].deleted = !this.game.log[index].deleted;
            this._updateDeleteButton(index, elt);
            main.gameManager.save();
        },
    });

    return LogViewer;

});
