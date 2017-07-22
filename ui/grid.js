define("ui/grid", ["ui", "solver"], function(ui, solver) {

    function Grid() {

    }

    $.extend(Grid.prototype, ui.View.prototype, {
        modal: true,
        show: function() {
            this.game = this.data.game;
            this.cmap = solver.getPlayerCardMap(this.game);
            this.matrix_unsolved = solver.getCardMatrix(this.game, this.cmap);
        },
    });

    return Grid;

});
