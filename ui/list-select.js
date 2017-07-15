define("ui/list-select", [], function() {
    function ListSelect(options) {
        this.options = options;
        this.element = $('<div>', {class: 'list-group list-group-select'});
        this.element.on('click', '.list-group-item', function(event) {
            var elt = $(event.target);
            if (!elt.hasClass('list-group-item'))
                elt = elt.parents('.list-group-item:first');
            this.selected = elt.attr('data-index');
        }.bind(this));
        this.callbacks = [];
        this.render();
    }

    ListSelect.prototype = {
        render: function() {
            this.element.html('');
            this.options.forEach(function(opt, i) {
                var item = $('<div>', {class: 'list-group-item', 'data-index': i})
                    .append(opt);
                if (i == self.selected)
                    item.addClass('selected');
                this.element.append(item);
            }.bind(this));
        },
        onChange: function(f) {
            this.callbacks.push(f);
        },
        triggerChange: function() {
            var selected = this.selected;
            this.callbacks.forEach(function(f) {
                f(selected);
            });
        },
    };

    Object.defineProperties(ListSelect.prototype, {
        selected: {
            get: function() {
                return this.element.find('.list-group-item').index('.selected');
            },
            set: function(value) {
                this.element.find('.list-group-item').removeClass('selected').eq(value).addClass('selected');
                this.triggerChange();
            },
        },
    });


    return ListSelect;
});
