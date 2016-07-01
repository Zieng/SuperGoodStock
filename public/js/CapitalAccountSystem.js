/**
 * Created by Mason on 2016/7/1.
 */

$(document).ready(function () {
    $(".operation-option").on("click", function () {
        var id = $(this).attr("id");
        $("#operation_page").attr("src","subPage/"+id+".html");
        $(".operation-option").removeClass("active");
        $(this).addClass("active");
    });
});
