/**
 * Created by wizard on 2016/6/11.
 */

function swit(c){
    var activeColor = '#f0ad4e';
    var diableColor = '#e8e8e8';
    var oSpanIndi = document.getElementById('indi');
    var oSpanCorp = document.getElementById('corp');
    var oDivIndi = document.getElementById('individual');
    var oDivCorp = document.getElementById('corporate');
    if(c == 0){
        oSpanIndi.style.backgroundColor = activeColor;
        oSpanCorp.style.backgroundColor = diableColor;
        oDivIndi.style.display = 'block';
        oDivCorp.style.display = 'none';
    } else {
        oSpanIndi.style.backgroundColor = diableColor;
        oSpanCorp.style.backgroundColor = activeColor;
        oDivIndi.style.display = 'none';
        oDivCorp.style.display = 'block';
    }
}