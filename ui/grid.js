define("ui/grid", ["ui", "solver"], function(ui, solver) {

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
            this.cmap = solver.getPlayerCardMap(this.game);
            this.matrix_unsolved = solver.getCardMatrix(this.game, this.cmap);
            this.matrix_solved = solver.getCardMatrix(this.game, solver.solve(this.game));
            this.select(true);
        },
        draw: function() {
            this.elt.find('th:not(:first), tbody tr').remove();
            this.game.players.forEach(function(player, i) {
                this.elt.find('thead tr').append(ui.renderTemplate('grid-header-col', {
                    color: this.game.gameData.players[i].color,
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
                        row.append($('<td>', {
                            class: CELL_CLASSES[
                                this.matrix_current[i][cat.substr(0, 1) + item_i]
                            ]
                        }));
                    }
                    tbody.append(row);
                };
            };
        },
        select: function(use_solved) {
            this.matrix_current = use_solved ? this.matrix_solved : this.matrix_unsolved;
            this.elt.find('#use-solved').prop('checked', use_solved);
            this.draw();
        },
    });

    return Grid;

});
