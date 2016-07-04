/**
 * Created by Mason on 2016/7/4.
 */

$(document).ready(function () {

    $.post("/CapAccSys/Info", {}, function (data) {

        var jsonData = eval('('+$.parseJSON(data)+')');
        // alert(j['username']);


        $.each(jsonData, function (n, value) {
            $("#"+n).html(value);
            // alert(value);
        });



    }, "text");

});