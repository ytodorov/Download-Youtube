declare var PUBNUB: any;

module DY {
    export class Common {
        /// Тук следим кога за даден url за първи път се е извикал dataBound събитието на даден грид.
        pubnubHelper: any = {};
    }
}

interface Window { dy: DY.Common; }

window.dy = new DY.Common();

$(document).ready(function r() {

    $(".chooseLangugage").click(
        function setCookie() {
            var lang = $(this).attr("href");
            if (lang == "/bg") {
                document.cookie = "userSetLangugaTo=bg";
            }
            else {
                document.cookie = "userSetLangugaTo=en";
            }
        }
    );

    $("a.ahome").attr("href", GetCultureTwoLetterISOLanguageName());

    $("#btnLoadUrls").click(
        function btnLoadUrls_Click(e) {
            var urls = $("#tbUrls").val();

            var urlsArray: string[] = urls.replace(/\n/g, " ").split(" ");
            if (urlsArray.length > 0) {
                $(".audioFiles").html('');
            }

            $.each(urlsArray, function f(indexInArray, valueOfElement: string) {
                if (valueOfElement.indexOf('youtube.com/') > 0 || valueOfElement.indexOf('youtu.be/') > 0) {

                    if (valueOfElement.lastIndexOf('list=') > 0) {

                        $.ajax({
                            url: GetCultureTwoLetterISOLanguageName() + '/home/getvideourlsfromplaylistid',
                            type: 'POST',
                            data: { uri: valueOfElement },
                            success: function (resultArray: string[]) {

                                $.each(resultArray, function f(indexInArray, uri: string) {

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

                                            var dummy: any = $;
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

                                var dummy: any = $;
                                if (dummy.active == 1) {
                                    $(".audioCompleted").show();
                                }
                            }
                        });
                    }
                }
            }
            );

        });



    $("#btnLoadExample1").click(function example1() {
        var urlsForExample1 = 'https://www.youtube.com/watch?v=xDMP3i36naA https://www.youtube.com/watch?v=QPdWJeybMo8';
        $("#tbUrls").text(urlsForExample1);
        $("#tbUrls").val(urlsForExample1);
        setTimeout(function () {
            $("#btnLoadUrls").click();
        }, 1);
    });

    $("#btnLoadExample2").click(function example1() {
        var urlsForExample1 = 'https://www.youtube.com/watch?v=hHUbLv4ThOo&list=PL4b5LdUWJfmkZAg_N279Di5LRnCD5vzji';
        $("#tbUrls").text(urlsForExample1);
        $("#tbUrls").val(urlsForExample1);
        setTimeout(function () {
            $("#btnLoadUrls").click();
        }, 1);
    });
    
    $("#clearAudioFiles").click(function () {
        $(".audioFiles").html("");
        $(".audioCompleted").hide();;
    });
       
    var intervalCounter = 0;
    var interval = setInterval(function alignGoogle() {

        var g = $("div[id*='follow'],div[id*='plusone'],iframe[id*='twitter']"); 

        g.off("mouseleave").mouseleave(function () { var g = $("div[id*='plusone']"); g.css("vertical-align", "bottom"); });
        g.off("mouseout").mouseout(function () { var g = $("div[id*='plusone']"); g.css("vertical-align", "bottom"); });
        g.off("hover").hover(function () { var g = $("div[id*='plusone']"); g.css("vertical-align", "bottom"); });

        g.css("vertical-align", "bottom");
        intervalCounter++;
        if (intervalCounter > 30) {
            clearInterval(interval);
        } 
    }, 500);

    
     // глобална променлива. лошо :(
     var pubnub = PUBNUB.init({
        publish_key: 'pub-c-5bd3c97d-e760-4aa8-9b91-0746c78606f9',
        subscribe_key: 'sub-c-406da20e-e48e-11e6-b325-02ee2ddab7fe',
        ssl: true,
        error: function (error) {
            console.log('Error:', error);
        }
    })

    pubnub.time(
        function (time) {
            console.log(time)
        }
     );

    window.dy.pubnubHelper = pubnub;

    //pubnub.subscribe({
    //    channel: 'DY',
    //    message: function (g) {
    //        debugger;
    //        console.log('this is from Yordan pubnub' + g);

    //        var $a = $("a[data-guid=" + g + "]");
    //        var iToShow = $a.next("i");
    //        var fileIsBeingProccessed = $a.nextAll(".fileIsBeingProccessed").first();

    //        //var url = "/home/downloadaudiostream?guid=" + g;
    //        var url = "http://localhost:49722/home/dav?guid=" + g;
    //        if ($("span." + g).length == 0) {
    //            var newGuid = new Date().getTime();
    //            $('<a target="_blank" class="' + newGuid + '" href="' + url + '"><span class="' + g + '"><i class="pe-7s-cloud-download hovercolor"></i></span></a>').insertAfter(iToShow);
    //            // Променяме и на цъкнатия линк url-а за да не се натисне пак

    //        }
    //        $a.attr("href", url);
    //        $a.unbind("click");
    //        iToShow.hide();

    //        fileIsBeingProccessed.hide();

    //    },
    //    error: function (error) {
    //        // Handle error here
    //        console.log(JSON.stringify(error));
    //    }
    //});

});

function GetCultureTwoLetterISOLanguageName() {
    var html = $("html").first();
    var lang = html.attr("lang");
    if (lang == "bg") {
        return "/bg";
    }
    return "";
}

