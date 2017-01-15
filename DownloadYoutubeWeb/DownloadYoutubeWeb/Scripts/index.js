$(document).ready(function r() {
    $("#btnLoadExample1").click(function example1() {
        var urlsForExample1 = "https://www.youtube.com/watch?v=StlMdNcvCJo\nhttps://www.youtube.com/watch?v=DtoM41TH7HM\nhttps://www.youtube.com/watch?v=2bVtPqZCniA\nhttps://www.youtube.com/watch?v=Q3OEbzaHOh8\nhttps://www.youtube.com/watch?v=BplsGX5eLLo\nhttps://www.youtube.com/watch?v=z3yC4q0JUQg\nhttps://www.youtube.com/watch?v=7bmO8JW193Q\nhttps://www.youtube.com/watch?v=tAbbE1oMXJQ\nhttps://www.youtube.com/watch?v=H6uFHp_P3o8\nhttps://www.youtube.com/watch?v=-q1kk4OwnTQ\nhttps://www.youtube.com/watch?v=r78xl5NaQeM\nhttps://www.youtube.com/watch?v=KPJqwzlvuVw\n";
        $("#tbUrls").val(urlsForExample1);
    });
    $("#btnLoadUrls").click(function btnLoadUrls_Click(e) {
        var urls = $("#tbUrls").val();
        var urlsArray = urls.replace(/\n/g, " ").split(" ");
        $.each(urlsArray, function f(indexInArray, valueOfElement) {
            if (valueOfElement.indexOf('youtube.com/watch?v=') > 0) {
                var last = $(".audioFiles").last();
                last.append('<div class="col-sm-6 col-md-4 text-center center-block  fa-spinner-toRemove"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only"></span><p>' + valueOfElement + '</p></div>');
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
                        var dummy = $;
                        if (dummy.active == 1) {
                            $(".audioCompleted").show();
                        }
                    }
                });
            }
        });
    });
});
//# sourceMappingURL=index.js.map