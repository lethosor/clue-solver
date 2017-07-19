define("util", [], function() {
    return {
        setExtend: function(set, items) {
            items.forEach(function(item) {
                if (set.indexOf(item) == -1)
                    set.push(item);
            });
        },
    }
});
