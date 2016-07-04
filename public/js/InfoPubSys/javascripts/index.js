//传入 scale stockname data
scale = "day"// day, month or year
stockname = "A"

var data = [[1,2,3,4,5,6,7,8,9],[3,6,8,1,11,22,4,21,6]];
var data_max = 30; //Y轴最大刻度
var line_title = ["5","10"]; //曲线名称
var y_label = "这是Y轴"; //Y轴标题
var x_label = "这是X轴"; //X轴标题
var x = [1,2,3,4,5,6,7,8,9]; //定义X轴刻度值
switch (scale) {
case "month":
scalename = "月K线";
break;
case "year":
scalename = "年K线";
break;
default:
scalename = "日K线";
}
var title = scalename + "-" + stockname;
j.jqplot.diagram.base("chart", data, line_title, title, x, x_label, y_label, data_max, 1);
