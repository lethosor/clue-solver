define("ui", [], function() {

    var views = {};
    var overlays = {};
    var ready = false;
    var ready_callbacks = [];

    function renderTemplate(id, data) {
        data = data || {};
        var text = $('script[type="text/template"]#' + id).text();
        return text.replace(/{{(.+?)}}/g, function(_, name) {
            return data[name];
        });
    }

    function init() {
        $(document).on('click', '.view a, .view button', function(e) {
            if (($(this).attr('href') || '').indexOf('#') == 0) {
                e.preventDefault();
                e.stopPropagation();
                if ($(this).hasClass('disabled'))
                    return;
                var target = $(this).attr('href').substr(1).split('/');
                if (target.length == 1) {
                    getElementView($(this)).dispatch(target[0], $(this));
                }
                else if (target[0] == 'view') {
                    hideView(getElementView($(this)).id);
                    showView(target[1]);
                }
            }
        });

        var view_modules = $('.view').map(function() {
            return "ui/" + this.id;
        }).toArray();

        require(view_modules, function() {
            $('.view').each(function() {
                registerView(this.id, new (require("ui/" + this.id))($(this)));
            });
            ready = true;
            ready_callbacks.forEach(function(f) {
                f();
            });
        });
    }

    function onReady(func) {
        if (ready)
            func();
        else
            ready_callbacks.push(func);
    }

    function registerView(id, view) {
        views[id] = view;
        views[id].id = id;
        views[id].elt = $('.view#' + id);
    }

    function getView(id) {
        if (!views[id])
            throw new Error("bad view id: " + id);
        return views[id];
    }

    function getElementView($elt) {
        $elt = $elt || $(this);
        var id = $elt.parents('.view').first().attr('id');
        if (views[id])
            return views[id];
        throw new Error("bad view id: " + id);
    }

    function View() {

    }

    View.prototype = {
        dispatch: function(action, $element) {
            return this[action]($element);
        },
        show: function() {
            this.draw();
        },
        draw: function() {},
        hide: function() {},
    }

    function showView(id, data) {
        if (!views[id])
            throw new Error("bad view id: " + id);
        views[id].data = data;
        views[id].show();
        views[id].elt.show();

        if (views[id].modal) {
            if (!overlays[id]) {
                overlays[id] = $('<div>').addClass('overlay').appendTo('body').click(function() {
                    hideView(id);
                });
            }
            overlays[id].show();
        }
    }

    function hideView(id) {
        if (!views[id])
            throw new Error("bad view id: " + id);
        views[id].hide();
        views[id].elt.hide();
        if (overlays[id])
            overlays[id].hide();
    }

    return {
        renderTemplate: renderTemplate,
        init: init,
        onReady: onReady,
        View: View,
        getView: getView,
        showView: showView,
        hideView: hideView,
    };

});
