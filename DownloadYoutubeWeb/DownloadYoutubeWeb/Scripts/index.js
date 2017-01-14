$(document).ready(function r() {
    $("#btnLoadUrls").click(function btnLoadUrls_Click(e) {
        var urls = $("#tbUrls").val();
        var urlsArray = urls.replace(/\n/g, " ").split(" ");
        $.each(urlsArray, function f(indexInArray, valueOfElement) {
            if (valueOfElement.indexOf('youtube.com/watch?v=') > 0) {
                var last = $(".audioFiles").last();
                last.append('<div class="col-sm-6 col-md-4 fa-spinner-toRemove"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>');
                $.ajax({
                    url: '/Home/_AudioPartial',
                    traditional: true,
                    data: { uri: valueOfElement },
                    success: function (result) {
                        var firstSpinner = $('.fa-spinner-toRemove').first();
                        firstSpinner.removeClass("fa-spinner-toRemove");
                        firstSpinner.html(result);
                        //var last = $(".audioFiles").last();
                        //last.append(result);
                    }
                });
            }
        });
    });
});
//# sourceMappingURL=index.js.map