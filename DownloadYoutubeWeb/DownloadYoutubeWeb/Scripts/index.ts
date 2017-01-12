function btnLoadUrls_Click(e) {
    var urls = $("#tbUrls").val();

    var urlsArray = urls.replace(/\n/g, " ").split(" ");
    $.each(urlsArray, function f(indexInArray, valueOfElement: string) {
        if (valueOfElement.indexOf('youtube.com/watch?v=') > 0) {

            $.ajax({
                url: '/Home/_AudioPartial',
                traditional: true,
                data: { uri: valueOfElement },
                success: function (result) {
                    $("#audioFiles").append(result)
                }
            });
        }
    }
    );

    //$.ajax({
    //    url: '/Home/DownloadAudio',
    //    traditional: true,
    //    data: { urls: urls },
    //    success: function (result) {

    //    }
    //});




}

function onChange() {

    var index = this.select().index();
    var dataItem = this.dataSource.view()[index];

    //$("#mediaPlayer").data("kendoMediaPlayer").media(dataItem);
    var kendoMediaPlayer = $("#mediaPlayer").data("kendoMediaPlayer");
    var options = kendoMediaPlayer.options;
    options.media = dataItem;
    kendoMediaPlayer.setOptions(options);

    //$("#mediaPlayer").data("kendoMediaPlayer").options.media = dataItem;
}

function onDataBound() {
    this.select(this.element.children().first());
}