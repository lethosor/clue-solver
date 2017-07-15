define("ui/game-editor", ["ui", "main", "game-data"], function(ui, main, gameData) {
    function GameEditor(elt) {
        var typeList = elt.find('select#game-type');
        $.each(gameData, function(id, entry) {
            typeList.append(
                $('<option>').attr('value', id).text(entry.name)
            );
        });
        typeList.on('change', this.updateGameType.bind(this));

        elt.find('input#num-players').on('input', this.updatePlayers.bind(this));
        elt.find('.list-group#player-list').on('input change', this.updatePlayerData.bind(this));
    }

    $.extend(GameEditor.prototype, ui.View.prototype, {
        show: function() {
            this.game = this.data.game;
            this.num_players = this.game.players.length;
            if (this.num_players) {
                this.elt.find('input#num-players').val(this.num_players);
            }
            this.elt.find('select#game-type').val(this.game.type);
            this.draw();
        },
        hide: function() {
            // discard any extra players
            this.game.players = this.game.players.slice(0, this.num_players);
        },
        draw: function() {
            this.elt.find('#game-id').text(this.game.id);
            this.updateGameType();
            this.updatePlayers();
        },
        delete: function() {
            if (!confirm("Are you sure?"))
                return;
            main.gameManager.deleteGame(this.game);
            ui.hideView(this.id);
            ui.showView('game-list');
        },
        updateGameType: function() {
            var game_type = this.elt.find('select#game-type').val();
            this.game.type = game_type;
            if (game_type) {
                // update max players
                this.elt.find('input#num-players').attr('max', gameData[game_type].players.length);
                // redraw players (might not be drawn yet)
                this.updatePlayers();
            }

            main.gameManager.save();
        },
        updatePlayers: function() {
            var field = this.elt.find('input#num-players');
            if (!field.val())
                return;
            var num = Number(field.val());
            if (isNaN(num) || num < field.attr('min') || num > field.attr('max')) {
                field.addClass('error');
                return;
            }
            this.num_players = num;
            field.removeClass('error');

            var list = this.elt.find('.list-group#player-list').html('');
            for (var i = 0; i < num; i++) {
                if (!this.game.players[i]) {
                    var player = this.game.newPlayer();
                    if (player)
                        this.game.players[i] = player;
                    else
                        return;
                }
                list.append(ui.renderTemplate('player-edit', {
                    id: i,
                    id1: (i + 1) + (i ? '' : ' (you)'),
                    name: this.game.getPlayerName(i, true),
                    placeholder: this.game.getPlayerName(i),
                    color: gameData[this.game.type].players[this.game.players[i].player].color,
                }));
            }

            // update player <select>s
            var data = gameData[this.game.type];
            list.find('select[name=player]').each(function(i, e) {
                data.players.forEach(function(player, player_id) {
                    $(e).append(
                        $('<option>').text(player.name).attr('value', player_id)
                    );
                });
                $(e).val(this.game.players[i].player);
            }.bind(this));
        },
        updatePlayerData: function(event) {
            var item = $(event.target).parents('.list-group-item:first');
            var player = this.game.players[item.attr('data-id')];
            player.name = item.find('input[name=name]').val();
            player.player = item.find('select[name=player]').val();
            item.find('.player-circle-icon').css('background-color',
                gameData[this.game.type].players[player.player].color);

            main.gameManager.save();
        },
    });

    return GameEditor;
})
