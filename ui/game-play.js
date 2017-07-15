define("ui/game-play", ["ui", "main", "game-data", "ui/list-select"], function(ui, main, gameData, ListSelect) {

    function GamePlay(elt) {
    }

    $.extend(GamePlay.prototype, ui.View.prototype, {
        show: function() {
            this.game = this.data.game;

            this.elt.find('.list-group').remove();

            var player_choice_elts = this.game.players.map(function(player) {
                return ui.renderTemplate('select-player-item', {
                    color: gameData[this.game.type].players[player.player].color,
                    name: player.name,
                    char: gameData[this.game.type].players[player.player].name,
                });
            }.bind(this));
            this.player_choices = new ListSelect(player_choice_elts);
            this.elt.append(this.player_choices.element);

            this.draw();
        },
        draw: function() {
            this.elt.find('#game-id').text(this.game.id);
            this.elt.find('#game-type').text(this.game.typeName);
        },
    });

    return GamePlay;

});
