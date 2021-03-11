var apiclient = (function () {
    return {
        getBlueprintsByAuthor: function (author, callback) {
            const promise = $.ajax({
                url: "/blueprints/" + author,
                type: 'GET',
                contentType: "application/json",
            });
            promise.then(function (data) {
                    callback(data);
                }, function (error) {
                    alert("No existen datos del autor!")
                }
            );
        },

        getBlueprintsByNameAndAuthor: function (name, author, callback) {
            const promise = $.ajax({
                url: "/blueprints/" + author + "/" + name,
                type: 'GET',
                contentType: "application/json",
            });
            promise.then(function (data) {
                    callback(data);
                }, function (error) {
                    alert("No existen datos del autor!")
                }
            );
        }
    }
})();