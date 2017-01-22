$(document).ready(function r() {
    $(".chooseLangugage").click(function setCookie() {
        var lang = $(this).attr("href");
        if (lang == "/bg") {
            document.cookie = "userSetLangugaTo=bg";
        }
        else {
            document.cookie = "userSetLangugaTo=en";
        }
    });
    debugger;
    $("a.ahome").attr("href", GetCultureTwoLetterISOLanguageName());
    $("#btnLoadUrls").click(function btnLoadUrls_Click(e) {
        var urls = $("#tbUrls").val();
        var urlsArray = urls.replace(/\n/g, " ").split(" ");
        if (urlsArray.length > 0) {
            $(".audioFiles").html('');
        }
        $.each(urlsArray, function f(indexInArray, valueOfElement) {
            if (valueOfElement.indexOf('youtube.com/') > 0 || valueOfElement.indexOf('youtu.be/') > 0) {
                if (valueOfElement.lastIndexOf('list=') > 0) {
                    $.ajax({
                        url: GetCultureTwoLetterISOLanguageName() + '/home/getvideourlsfromplaylistid',
                        type: 'POST',
                        data: { uri: valueOfElement },
                        success: function (resultArray) {
                            $.each(resultArray, function f(indexInArray, uri) {
                                var last = $(".audioFiles").last();
                                last.append('<div class="col-xs-12 col-sm-6 col-md-4 text-center center-block  fa-spinner-toRemove"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only"></span><p>' + valueOfElement + '</p></div>');
                                $.ajax({
                                    url: GetCultureTwoLetterISOLanguageName() + '/home/_audiopartial',
                                    type: 'POST',
                                    data: { uri: uri },
                                    success: function (result) {
                                        var firstSpinner = $('.fa-spinner-toRemove').first();
                                        firstSpinner.removeClass("fa-spinner-toRemove");
                                        firstSpinner.html(result);
                                        var dummy = $;
                                        if (dummy.active == 1) {
                                            $(".audioCompleted").show();
                                        }
                                    }
                                });
                            });
                        }
                    });
                }
                else {
                    var last = $(".audioFiles").last();
                    last.append('<div class="col-xs-12 col-sm-6 col-md-4 text-center center-block  fa-spinner-toRemove"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only"></span><p>' + valueOfElement + '</p></div>');
                    $.ajax({
                        url: GetCultureTwoLetterISOLanguageName() + '/home/_audiopartial',
                        type: 'POST',
                        data: { uri: valueOfElement },
                        success: function (result) {
                            var firstSpinner = $('.fa-spinner-toRemove').first();
                            firstSpinner.removeClass("fa-spinner-toRemove");
                            firstSpinner.html(result);
                            var dummy = $;
                            if (dummy.active == 1) {
                                $(".audioCompleted").show();
                            }
                        }
                    });
                }
            }
        });
    });
    $("#btnLoadExample1").click(function example1() {
        var urlsForExample1 = 'https://www.youtube.com/watch?v=-4kTei0XrCs&list=PL04831A1BBA13F830';
        //https://www.youtube.com/watch?v=DtoM41TH7HM
        //https://www.youtube.com/watch?v=2bVtPqZCniA&#13;&#10;
        //https://www.youtube.com/watch?v=Q3OEbzaHOh8&#13;&#10;
        //https://www.youtube.com/watch?v=BplsGX5eLLo&#13;&#10;
        //https://www.youtube.com/watch?v=z3yC4q0JUQg&#13;&#10;
        //https://www.youtube.com/watch?v=7bmO8JW193Q&#13;&#10;
        //https://www.youtube.com/watch?v=tAbbE1oMXJQ&#13;&#10;
        //https://www.youtube.com/watch?v=H6uFHp_P3o8&#13;&#10;
        //https://www.youtube.com/watch?v=-q1kk4OwnTQ&#13;&#10;
        //https://www.youtube.com/watch?v=r78xl5NaQeM&#13;&#10;
        //https://www.youtube.com/watch?v=KPJqwzlvuVw&#13;&#10;
        $("#tbUrls").text(urlsForExample1);
        $("#tbUrls").val(urlsForExample1);
        setTimeout(function () {
            $("#btnLoadUrls").click();
        }, 1);
    });
    $("#clearAudioFiles").click(function () {
        $(".audioFiles").html("");
        $(".audioCompleted").hide();
        ;
    });
    $(".downloadInWebM").click(function () {
        var aMp4 = $(".webm");
        aMp4.multiDownload({ delay: 5000 });
        //aMp4.each((num, elem) => {
        //    debugger;
        //    var a = $(elem);
        //    var href = a.attr('href');
        //    window.open(href, '_parent');
        //})
        //aMp4.click();
    });
    $(".downloadInMp4").click(function () {
        var aMp4 = $(".webm");
        aMp4.multiDownload({ delay: 5000 });
        //debugger;
        //var aMp4 = $(".mp4");
        //aMp4.click();
    });
    var timeout = setTimeout(function alignGoogle() {
        var g = $("div[id*='follow'],div[id*='plusone'],iframe[id*='twitter']");
        g.mouseleave(function () { var g = $("div[id*='plusone']"); g.css("vertical-align", "bottom"); });
        g.mouseout(function () { var g = $("div[id*='plusone']"); g.css("vertical-align", "bottom"); });
        g.hover(function () { var g = $("div[id*='plusone']"); g.css("vertical-align", "bottom"); });
        g.css("vertical-align", "bottom");
        if (g.length > 0) {
            clearInterval(timeout);
        }
    }, 2000);
});
function GetCultureTwoLetterISOLanguageName() {
    var html = $("html").first();
    var lang = html.attr("lang");
    if (lang == "bg") {
        return "/bg";
    }
    return "";
}
//# sourceMappingURL=index.js.map