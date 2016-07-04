$(function () {
    //$(".registerform").Validform();  //就这一行代码！;

    var demo = $(".registerform").Validform({
        tiptype: 3,
        label: ".label",
        showAllError: true,
        datatype: {
            "zh1-6": /^[\u4E00-\u9FA5\uf900-\ufa2d]{1,6}$/
        },
        ajaxPost: true
    });
});