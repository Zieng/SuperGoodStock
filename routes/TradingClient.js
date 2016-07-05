var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CapitalAccount = mongoose.model('CapitalAccount');
var SecuritiesAccount = mongoose.model('SecuritiesAccount');
var HoldingStock = mongoose.model('HoldingStock');
var Stocks = mongoose.model('Stock');
var DailyStocks = mongoose.model('DailyStock');
var BuyInstruction = mongoose.model('BuyInstruction');
var SellInstruction = mongoose.model('SellInstruction');

var countryList = require('../models/country-list');

router.get('/', function(req, res, next) {
	if(req.cookies.saId == undefined || req.cookies.saPass == undefined)
	{
		res.redirect('/TradingClient/login');
	}
	else
		res.render('TradingClient/login');
});
router.post('/', function(req, res, next) {
	res.send('You submit a form in /TradingClient');
});

router.get('/login', function(req, res, next) {
	if(req.cookies.saId == undefined || req.cookies.saPass == undefined)
	{
		res.render('TradingClient/login');
	}
	else
	{
		res.send('use cookie auto login');
	}
});
router.post('/login', function(req, res, next) {
	// clear cookies
	res.cookie('saId', "", {expires:new Date()});
	res.cookie('saPass', "", {expires:new Date()});
	
	var username = req.body['user'];
	var password = req.body['pass'];
	SecuritiesAccount.findOne({username: username}, function(err, doc) {
		if(doc == null)
		{
			res.send('User not found');
		}
		else
		{
			if(password != doc.loginPassword)
				res.send('Invalid Password');
			else
			{
				res.cookie('saId', doc.saId, {maxAge: 900000});
				res.cookie('saPass', password, {maxAge: 900000});
				
				res.redirect('/TradingClient');
			}
		}
	});
	
});

router.get('/stockInfo', function(req, res, next) {
	res.render('TradingClient/stockInfo');
});
router.post('/stockInfo', function(req, res, next) {
	if(req.cookies.saId == undefined || req.cookies.saPass == undefined)
	{
		res.redirect('TradingClient/login');
	}
	else
	{
		SecuritiesAccount.findOne({saId: req.cookies.saId}, function(err, obj){
			if(err)
				throw err;
			if(obj == null)
				res.send('user not found');
			else
			{
				HoldingStock.find({saId: req.cookies.saId}).exec(function(err2, holdingStock) {
					if(err2)
						throw err2;
					if(holdingStock == null)
						res.send('No such holding stock');
					else
						res.json(JSON.stringify(holdingStock));
				});
			}
		});
	}	
});

router.get('/capAccInfo', function(req, res, next) {
	res.render('TradingClient/capAccInfo');
});
router.post('/capAccInfo', function(req, res, next) {
	if(req.cookies.saId == undefined || req.cookies.saPass == undefined)
	{
		res.redirect('TradingClient/login');
	}
	else
	{
		SecuritiesAccount.findOne({saId: req.cookies.saId}, function(err, obj){
			if(err)
				throw err;
			if(obj == null)
				res.send('user not found');
			else
			{
				CapitalAccount.find({saId: req.cookies.saId}).exec(function(err2, capicalAccount) {
					if(err2)
						throw err2;
					if(holdingStock == null)
						res.send('No such holding stock');
					else
						res.json(JSON.stringify(capicalAccount));
				});
			}
		});
	}	
});

/*
router.get('/secAccInfo', function(req, res, next) {
	res.render('TradingClient/secAccInfo');
});
router.post('/secAccInfo', function(req, res, next) {
	if(req.cookies.saId == undefined || req.cookies.saPass == undefined)
	{
		res.redirect('TradingClient/login');
	}
	else
	{
		SecuritiesAccount.findOne({saId: req.cookies.saId}, function(err, obj){
			if(err)
				throw err;
			if(obj == null)
				res.send('user not found');
			else
				res.json(JSON.stringify(obj));
		});
	}	
});
*/

router.get('/stockPurchase', function(req, res, next) {
	res.render('TradingClient/stockPurchase');
});
router.post('/stockPurchase', function(req, res, next) {
	var stockID = req.body['stockID'];
	var amount = req.body['amount'];
	var caId = req.body['caId'];
	if(req.cookies.saId == undefined || req.cookies.saPass == undefined)
	{
		res.redirect('TradingClient/login');
	}
	else
		saId = req.cookies.saId;
	
	DailyStocks.find({tickerSymbol: stockId}).exec(function(err, docs) {
		if(err)
			throw err;
		if(docs == null)
			res.send('No such stock');
		else
		{
			var price = docs.currentPrice;
			var NewBuyInstruction = new BuyInstruction();
			NewBuyInstruction.tickerSymbol = stockID;
			NewBuyInstruction.price = price;
			NewBuyInstruction.amount = amount;
			NewBuyInstruction.time = parseInt(new Date().getTime()/1000);
			NewBuyInstruction.type = 1;
			NewBuyInstruction.leftAmount = amount;
			NewBuyInstruction.state = -1;
			NewBuyInstruction.saId = saId;
			NewBuyInstruction.caId = caId;
			
			NewBuyInstruction.save(function(err) {
				if(err)
					return next(err);
				res.status(200).send('save ok');
			});
		}
	});
});

router.get('/stockSell', function(req, res, next) {
	res.render('TradingClient/stockSell');
});
router.post('/stockSell', function(req, res, next) {
	var stockID = req.body['stockID'];
	var price = req.body['price'];
	var amount = req.body['amount'];
	var caId = req.body['caId'];
	if(req.cookies.saId == undefined || req.cookies.saPass == undefined)
	{
		res.redirect('TradingClient/login');
	}
	else
		saId = req.cookies.saId;
	
	Stocks.find({tickerSymbol: stockId}).exec(function(err, docs) {
		if(err)
			throw err;
		if(docs == null)
			res.send('No such stock');
		else
		{
			var NewSellInstruction = new SellInstruction();
			NewSellInstruction.tickerSymbol = stockID;
			NewSellInstruction.price = price;
			NewSellInstruction.amount = amount;
			NewSellInstruction.time = parseInt(new Date().getTime()/1000);
			NewSellInstruction.type = 0;
			NewSellInstruction.leftAmount = amount;
			NewSellInstruction.state = -1;
			NewSellInstruction.saId = saId;
			NewSellInstruction.caId = caId;
			
			NewSellInstruction.save(function(err) {
				if(err)
					return next(err);
				res.status(200).send('save ok');
			});
		}
	});
});

router.get('/undo', function(req, res, next) {
	res.render('TradingClient/undo');
});
router.post('/undo', function(req, res, next) {
	var stockID = req.body['stockID'];
	var time = req.body['time'];
	if(req.cookies.saId == undefined || req.cookies.saPass == undefined)
	{
		res.redirect('TradingClient/login');
	}
	else
	{
		SecuritiesAccount.findOne({saId: req.cookies.saId}, function(err, obj){
			if(err)
				throw err;
			if(obj == null)
				res.send('user not found');
			else
			{
				BuyInstruction.remove({tickerSymbol:stockID, time:time}, function(err, doc) {
					if(err)
						throw err;
					else
						res.send('undo successfully');
				});
				SellInstruction.remove({tickerSymbol:stockID, time:time}, function(err, doc) {
					if(err)
						throw err;
					else
						res.send('undo successfully');
				});
			}
		});
	}	
});

router.get('/tradingResult', function(req, res, next) {
	res.render('TradingClient/tradingResult');
});
router.post('/tradingResult', function(req, res, next) {
	if(req.cookies.saId == undefined || req.cookies.saPass == undefined)
	{
		res.redirect('TradingClient/login');
	}
	else
	{
		SecuritiesAccount.findOne({saId: req.cookies.saId}, function(err, obj){
			if(err)
				throw err;
			if(obj == null)
				res.send('user not found');
			else
			{
				var saId = req.cookies.saId;
				
				BuyInstruction.find({saId: saId}).sort({time: -1}).exec(function(err, docs) {
					if(docs == null)
						res.send('User not found');
					else
						res.json(JSON.stringify(docs));
				});
				SellInstruction.find({saId: saId}).sort({time: -1}).exec(function(err, docs) {
					if(docs == null)
						res.send('User not found');
					else
					{
						//res.json(JSON.stringify(docs));
					}
				});
			}
		});
	}	
});

/*
router.get('/passwordModify', function(req, res, next) {
	res.render('TradingClient/passwordModify');
});
router.post('/passwordModify', function(req, res, next) {
	if(req.cookies.saId == undefined || req.cookies.saPass == undefined)
	{
		res.redirect('TradingClient/login');
	}
	else
	{
		CapitalAccount.findOne({saId: req.cookies.saId}, function(err, obj){
			if(err)
				throw err;
			if(obj == null)
				res.send('user not found');
			else
			{
				var oldPass = req.body.oldPass;
				var newPass = req.body.newPass;
				var newPass_confirm = req.body.newPass2;
				
				if(newPass == newPass_confirm)
				{
					if(oldPass == obj.tradePassword)
					{
						obj.tradePassword = newPass;
						res.send('修改成功');
					}
					else
						res.send('旧密码错误');
				}
				else
					res.send('两次输入的密码不匹配');
			}
		});
	}	
});
*/

module.exports = router;
