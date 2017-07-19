define("ui/game-play", ["ui", "main", "game-data", "ui/list-select"], function(ui, main, gameData, ListSelect) {

    function addMod(orig, delta, mod) {
        var ret = orig + delta;
        if (ret > 0)
            return ret % mod;
        while (ret < 0)
            ret += mod;
        return ret;
    }

    // data:
    // - game: Game
    // - log_index: current log index - if undefined, append to log
    function GamePlay(elt) {
    }

    $.extend(GamePlay.prototype, ui.View.prototype, {
        show: function() {
            this.game = this.data.game;
            this.gdata = gameData[this.game.type];
            this.log_entry = this.game.log[this.data.log_index] || this.game.newLogEntry();

            this.elt.find('.list-group:not(.no-remove)').remove();

            var player_choice_elts = this.game.players.map(function(player, id) {
                return ui.renderTemplate('select-player-item', {
                    color: this.gdata.players[player.player].color,
                    name: this.game.getPlayerName(id),
                    char: this.gdata.players[player.player].name,
                });
            }.bind(this));
            this.player_choices = new ListSelect(player_choice_elts);
            this.player_choices.onChange(this.selectPlayer.bind(this));
            this.elt.find('#page-select-player').append(this.player_choices.element);

            this.card_choices = {
                players: new ListSelect(this.gdata.players.map(function(p) { return p.name; })),
                weapons: new ListSelect(this.gdata.weapons),
                rooms: new ListSelect(this.gdata.rooms),
            };
            $.each(this.card_choices, function(id, select) {
                this.elt.find('#container-' + id).append(select.element);
            }.bind(this));

            this.page('select-player');
            this.draw();
        },
        hide: function() {
            this.elt.find('.alert').addClass('hidden');
        },
        draw: function() {
            this.elt.find('#game-id').text(this.game.id);
            this.elt.find('#game-type').text(this.game.typeName);
        },
        selectPlayer: function(id) {
            this.current_player_id = id;
            this.log_entry.player = id;
            this.current_player = this.game.players[id];
            this.second_player_id = addMod(this.current_player_id, 1, this.game.players.length);
            this.second_player_id_orig = this.second_player_id;
            this.elt.find('.current-player-name').text(
                this.gdata.players[this.current_player.player].name + ' (' +
                this.game.getPlayerName(id) + ')'
            );
            this.secondPlayerDraw();
            this.page('select-cards');
        },
        page: function(page) {
            if (page.attr)
                page = page.attr('data-page');
            this.elt.find('.page').hide();
            this.elt.find('.page#page-' + page).show();
        },
        suggestionOk: function() {
            return this.card_choices.players.selected >= 0 &&
                this.card_choices.weapons.selected >= 0 &&
                this.card_choices.rooms.selected >= 0;
        },
        switchToCheck: function(page) {
            if (!this.suggestionOk()) {
                this.elt.find('#bad-suggestion').removeClass('hidden');
                return;
            }
            this.log_entry.guess.player = this.card_choices.players.selected;
            this.log_entry.guess.weapon = this.card_choices.weapons.selected;
            this.log_entry.guess.room = this.card_choices.rooms.selected;
            this.elt.find('#bad-suggestion').addClass('hidden');
            this.page('check');
            this.elt.find('.current-suggestion').text(
                this.gdata.players[this.card_choices.players.selected].name + ' / ' +
                this.gdata.weapons[this.card_choices.weapons.selected] + ' / ' +
                this.gdata.rooms[this.card_choices.rooms.selected]
            );
        },
        secondPlayerDraw: function() {
            var player = this.game.players[this.second_player_id];
            this.elt.find('.second-player-name').text(
                this.gdata.players[player.player].name + ' (' +
                this.game.getPlayerName(this.second_player_id) + ')'
            );
        },
        secondPlayerMove: function(delta) {
            do {
                this.second_player_id = addMod(this.second_player_id, delta, this.game.players.length);
            } while (this.second_player_id == this.current_player_id);
            this.secondPlayerDraw();
        },
        secondPlayerNext: function() {
            this.secondPlayerMove(1);
        },
        secondPlayerPrev: function() {
            this.secondPlayerMove(-1);
        },
        secondPlayerNone: function() {
            this.logCards(this.second_player_id, false);
            this.secondPlayerNext();
            if (this.second_player_id == this.second_player_id_orig)
                this.finishGuess();
        },
        secondPlayerSome: function() {
            this.logCards(this.second_player_id, true);
            this.finishGuess();
        },
        logCards: function(id, has_some) {
            if (has_some)
                this.log_entry.has.some = id;
            else
                this.log_entry.has.none.push(id);
        },
        finishGuess: function() {
            if (this.data.log_index === undefined)
                this.data.log_index = this.game.log.length;
            this.game.log[this.data.log_index] = this.log_entry;
            main.gameManager.save();
            this.show();
        },
    });

    return GamePlay;

});
