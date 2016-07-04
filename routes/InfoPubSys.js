/**
 * Created by imxian on 6/28/16.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var DailyStock = mongoose.model('DailyStock');


function toDay(date) {
	var m = date.getMonth();
	var d = date.getDay();
	if (m <= 9) m = '0' + m;
	if (d <= 9) d = '0' + d;
	return date.getFullYear() + '/' + m  + '/' + d;
}

function toMonth(date) {
	var m = date.getMonth();
	if (m <= 9) m = '0' + m;
	return date.getFullYear() + '/' + m;
}

function toYear(date) {
	return date.getFullYear();
}


router.get('/StockInfo', function (req, res, next) {
	var data = null;
	res.render('StockInfo.html', {'data' : JSON.stringify(data)});
});


router.post('/StockInfo', function (req, res, next) {
	var tickerSymbol;
	var scale;
    tickerSymbol = req.body['tickerSymbol'];
	scale = req.body['scale'];
	switch (scale) {
		case 'day':
			getDay(res, tickerSymbol);
			break;
		case 'month':
			getMonth(res, tickerSymbol);
			break;
		case 'year':
			getYear(res, tickSymbol);
	}
	//res.render('StockInfo.html', {'data' : JSON.stringify(data)});
});


var oneDay = 24*60*60*1000;

function getDay(res, tickerSymbol) {
	var data = new Object();
	data.date = new Array();
	data.openningPrice = new Array();
	data.closingPrice = new Array();
	data.highestPrice = new Array();
	data.lowestPrice = new Array();
	data.max = 0.0;
	var daysAgo = new Date(Date.now-30*oneDay); /* 30 days */
    DailyStock.find({'tickerSymbol': tickerSymbol})
			  .where('date').gt(daysAgo)
			  .sort('date')
			  .exec(function (err, stock) {
				  console.log('123');
				  if (err) return;
				  console.log('123');
				  for (i in stock) {
					  data.date.append(toDay(stock[i].date));
					  data.openningPrice.append(stock[i].openningPrice);
					  data.closingPrice.append(stock[i].closingPrice);
					  data.highestPrice.append(stock[i].highestPrice);
					  data.lowestPrice.append(stock[i].lowestPrice);
					  data.max = Math.max(data.max, stock[i].highestPrice);
				  }
				  if (stock.length == 0) data = null;
				  res.render('StockInfo.html', {'data' : JSON.stringify(data)});
			  })
}

function getMonth(res, tickerSymbol) {
	var data = new Object();
	var lastMonth = '';
	data.date = new Array();
	data.openningPrice = new Array();
	data.closingPrice = new Array();
	data.highestPrice = new Array();
	data.lowestPrice = new Array();
	data.max = 0.0;
	var monthsAgo = new Date(Date.now-12*30*oneDay); /* 12 months */
    DailyStock.find({'tickerSymbol': tickerSymbol})
			  .where('date').gt(monthsAgo)
			  .sort('date')
			  .exec(function (err, stock) {
				  if (err) return;
				  for (i in stock) {
					  if (lastMonth != toMonth(stock[i].date)) {
						  data.date.append(toMonth(stock[i].date));
						  data.openningPrice.append(stock[i].openningPrice);
						  data.closingPrice.append(stock[i].closingPrice);
						  data.highestPrice.append(stock[i].highestPrice);
						  data.lowestPrice.append(stock[i].lowestPrice);
						  data.max = Math.max(data.max, stock[i].highestPrice);
						  lastMonth = toMonth(stock[i].date);
					  } else {
						  data.closingPrice[closingPrice.length-1] = stock[i].closingPrice;
						  var tmp = data.highestPrice[highestPrice.length-1];
						  data.highestPrice[highestPrice.length-1] = Math.max(tmp, stock[i].highestPrice);
						  var tmp = data.lowestPrice[lowestPrice.length-1];
						  data.lowestPrice[lowestPrice.length-1] = Math.min(tmp, stock[i].lowestPrice);
					  }
				  }
				  if (stock.length == 0) data = null;
				  res.render('StockInfo.html', {'data' : JSON.stringify(data)});
			  })
}

function getYear(res, tickerSymbol) {
	var data = new Object();
	var lastYear = '';
	data.date = new Array();
	data.openningPrice = new Array();
	data.closingPrice = new Array();
	data.highestPrice = new Array();
	data.lowestPrice = new Array();
	data.max = 0.0;
	var yearsAgo = new Date(Date.now-12*12*30*oneDay); /* 12 years */
    DailyStock.find({'tickerSymbol': tickerSymbol})
			  .where('date').gt(yearsAgo)
			  .sort('date')
			  .exec(function (err, stock) {
				  if (err) return;
				  for (i in stock) {
					  if (lastYear != toYear(stock[i].date)) {
						  data.date.append(toYear(stock[i].date));
						  data.openningPrice.append(stock[i].openningPrice);
						  data.closingPrice.append(stock[i].closingPrice);
						  data.highestPrice.append(stock[i].highestPrice);
						  data.lowestPrice.append(stock[i].lowestPrice);
						  data.max = Math.max(data.max, stock[i].highestPrice);
						  lastYear = toYear(stock[i].date);
					  } else {
						  data.closingPrice[closingPrice.length-1] = stock[i].closingPrice;
						  var tmp = data.highestPrice[highestPrice.length-1];
						  data.highestPrice[highestPrice.length-1] = Math.max(tmp, stock[i].highestPrice);
						  var tmp = data.lowestPrice[lowestPrice.length-1];
						  data.lowestPrice[lowestPrice.length-1] = Math.min(tmp, stock[i].lowestPrice);
					  }
				  }
				  if (stock.length == 0) data = null;
				  res.render('StockInfo.html', {'data' : JSON.stringify(data)});
			  })
}

module.exports = router;
