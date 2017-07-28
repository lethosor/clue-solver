define("util", [], function() {
    return {
        setExtend: function(set, items) {
            items.forEach(function(item) {
                if (set.indexOf(item) == -1)
                    set.push(item);
            });
        },
        arrayRemove: function(array, item) {
            var removed = false;
            while (true) {
                var i = array.indexOf(item);
                if (i == -1)
                    break;
                array.splice(i, 1);
                removed = true;
            }
            return removed;
        },
    }
});
