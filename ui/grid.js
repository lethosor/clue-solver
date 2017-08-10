define("ui/grid", ["ui", "solver", "util"], function(ui, solver, util) {

    var CELL_CLASSES = {
        'unknown': '',
        'yes': 'success',
        'maybe': 'warning',
        'no': 'danger',
    }

    function Grid(elt) {
        elt.find('#use-solved').on('change', function(e) {
            this.select($(e.target).prop('checked'));
        }.bind(this));
    }

    $.extend(Grid.prototype, ui.View.prototype, {
        modal: true,
        show: function() {
            this.game = this.data.game;
            this.calculate();
            this.select(true);
        },
        calculate: function() {
            this.cmap = solver.getPlayerCardMap(this.game);
            this.matrix_unsolved = solver.getCardMatrix(this.game, this.cmap);
            this.matrix_solved = solver.getCardMatrix(this.game, solver.solve(this.game));
        },
        draw: function() {
            this.elt.find('th:not(:first), tbody tr').remove();
            this.game.players.forEach(function(player, i) {
                this.elt.find('thead tr').append(ui.renderTemplate('grid-header-col', {
                    color: this.game.gameData.players[i].color,
                    name: this.game.players[i].name,
                    player: this.game.gameData.players[i].name,
                }));
            }.bind(this));

            var tbody = this.elt.find('tbody');
            var colspan = this.game.players.length + 1;
            var game = this.game;
            var cats = ['players', 'weapons', 'rooms'];
            for (var cat_i = 0; cat_i < cats.length; cat_i++) {
                var cat = cats[cat_i];
                tbody.append(
                    $('<tr>').append(
                        $('<td>', {colspan: colspan}).text(cat)
                    )
                );

                for (var item_i = 0; item_i < game.gameData[cat].length; item_i++) {
                    var item = game.gameData[cat][item_i]
                    var row = $('<tr>').append(
                        $('<td>').text(item.name || item)
                    );
                    for (var i = 0; i < game.players.length; i++) {
                        var card = cat[0] + item_i;
                        var td = $('<td>', {
                            class: CELL_CLASSES[
                                this.matrix_current[i][card]
                            ]
                        }).addClass('solver-cell').data({
                            player: i,
                            card: card,
                        }).on('click', function(e) {
                            this.clickCell($(e.target));
                        }.bind(this));
                        if (this.matrix_current[i][card] != 'unknown')
                            td.text(this.matrix_current[i][card]);
                        if (this.game.getPlayerOverrides(i).known.indexOf(card) != -1 ||
                            this.game.getPlayerOverrides(i).none.indexOf(card) != -1) {
                            td.addClass('overridden');
                        }
                        row.append(td);
                    }
                    tbody.append(row);
                };
            };
        },
        select: function(use_solved) {
            this.use_solved = use_solved;
            this.matrix_current = use_solved ? this.matrix_solved : this.matrix_unsolved;
            this.elt.find('#use-solved').prop('checked', use_solved);
            this.draw();
        },
        clickCell: function(cell) {
            var card = cell.data('card');
            var overrides = this.game.getPlayerOverrides(cell.data('player'));
            var is_overriden = true;

            if (util.arrayRemove(overrides.known, card)) {
                overrides.none.push(card);
            }
            else if (util.arrayRemove(overrides.none, card)) {
                is_overriden = false;
            }
            else {
                overrides.known.push(card);
            }

            cell.toggleClass('overridden', is_overriden);
            this.calculate();
            this.select(this.use_solved);
        },
    });

    return Grid;

});
