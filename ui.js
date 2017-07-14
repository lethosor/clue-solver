define("ui", [], function() {

    var views = {};
    var ready = false;
    var ready_callbacks = [];

    function init() {
        $(document).on('click', '.view a', function(e) {
            if ($(this).attr('href').indexOf('#') == 0) {
                e.preventDefault();
                getElementView($(this)).dispatch($(this).attr('href').substr(1), $(this));
            }
        });

        var view_modules = $('.view').map(function() {
            return "ui/" + this.id;
        }).toArray();
        console.log(view_modules);

        require(view_modules, function() {
            $('.view').each(function() {
                registerView(this.id, new (require("ui/" + this.id))());
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
        show: function() {},
        hide: function() {},
    }

    function showView(id) {
        if (!views[id])
            throw new Error("bad view id: " + id);
        views[id].show();
        views[id].elt.show();
    }

    function hideView(id) {
        if (!views[id])
            throw new Error("bad view id: " + id);
        views[id].hide();
        views[id].elt.hide();
    }

    return {
        init: init,
        onReady: onReady,
        View: View,
        getView: getView,
        showView: showView,
        hideView: hideView,
    };

});
