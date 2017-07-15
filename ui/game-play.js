define("ui/game-play", ["ui", "main", "game-data", "ui/list-select"], function(ui, main, gameData, ListSelect) {

    function GamePlay(elt) {
    }

    $.extend(GamePlay.prototype, ui.View.prototype, {
        show: function() {
            this.game = this.data.game;

            this.elt.find('.list-group').remove();

            var player_choice_elts = this.game.players.map(function(player, id) {
                return ui.renderTemplate('select-player-item', {
                    color: gameData[this.game.type].players[player.player].color,
                    name: this.game.getPlayerName(id),
                    char: gameData[this.game.type].players[player.player].name,
                });
            }.bind(this));
            this.player_choices = new ListSelect(player_choice_elts);
            this.player_choices.onChange(this.selectPlayer.bind(this));
            this.elt.find('#page-select-player').append(this.player_choices.element);

            this.page('select-player');
            this.draw();
        },
        draw: function() {
            this.elt.find('#game-id').text(this.game.id);
            this.elt.find('#game-type').text(this.game.typeName);
        },
        selectPlayer: function(id) {
            this.current_player = this.game.players[id];
            this.elt.find('.current-player-name').text(
                gameData[this.game.type].players[this.current_player.player].name + ': ' +
                this.game.getPlayerName(id)
            );
            this.page('select-cards');
        },
        page: function(page) {
            if (page.attr)
                page = page.attr('data-page');
            this.elt.find('.page').hide();
            this.elt.find('.page#page-' + page).show();
        }
    });

    return GamePlay;

});
