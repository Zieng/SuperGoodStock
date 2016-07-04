/**
 * Created by lenovo on 2016/6/29.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');
var BuyInstruction = mongoose.model('BuyInstruction');
var SellInstruction = mongoose.model('SellInstruction');
var Stocks = mongoose.model('DailyStock');

// initial instruction with http request
router.post('/create', function (req, res, next) {
    var stockID = req.body['stockID'];
    var price = req.body['price'];
    var amount = req.body['amount'];
    var typeInfo = req.body['type'];     //1,0
    var caID = req.body['caId'];
    if( req.cookies.saId == undefined )
    {
        res.redirect('/SecAccSys/login');
    }
    else
    {
        var saID = req.cookies.saId;
    }

    var FindStockIDResult;
    Stocks.find({}).exec(function(err,docs){
        if(err) throw err;
        if(docs == null){
           FindStockIDResult = 0;
       }
        if(typeInfo == 1) {
            if (!stockID.trim())
                res.send('股票编号不能为空');
            else if (!price.trim())
                res.send('股票价格不能为空');
            else if(price <= 0)
                res.send('股票价格不能小于0');
            else if (!amount.trim())
                res.send('交易数量不能为空');
            else if(amount < 0)
                res.send('交易数量不能小于0');
            else if (!typeInfo.trim())
                res.send('交易类型不能为空');
            else if(typeInfo!=0||typeInfo!=1)
                res.send('交易类型输入错误');
            else if(FindStockIDResult == 0)
                res.send('未找到输入的股票号码');
            else {
                var New_BuyInstruction = new BuyInstruction();
                New_BuyInstruction.tickerSymbol = stockID;
                New_BuyInstruction.price = price;
                New_BuyInstruction.amount = amount;
                New_BuyInstruction.type = 1;
                New_BuyInstruction.time = parseInt(new Date().getTime()/1000);
                New_BuyInstruction.leftAmount = amount;
                New_BuyInstruction.state = -1;
                New_BuyInstruction.saId = saID;
                New_BuyInstruction.caId = caID;
            }
            New_BuyInstruction.save( function (err) {
                if(err)
                    return next(err);
                res.status(200).send('Save ok');
            });
        }
        else {

            if (!stockID.trim())
                res.send('股票编号不能为空');
            else if (!price.trim())
                res.send('股票价格不能为空');
            else if (!amount.trim())
                res.send('交易数量不能为空');
            else if (!typeInfo.trim())
                res.send('交易类型不能为空');
            else if(FindStockIDResult == 0)
                res.send('未找到输入的股票号码');
            else {
                var New_SellInstruction = new SellInstruction();
                New_SellInstruction.tickerSymbol = stockID;
                New_SellInstruction.price = price;
                New_SellInstruction.amount = amount;
                New_SellInstruction.time = parseInt(new Date().getTime()/1000);
                New_SellInstruction.type = 0;
                New_SellInstruction.leftAmount = amount;
                New_SellInstruction.state = -1;
                New_SellInstruction.saId = saID;
                New_SellInstruction.caId =caID;
            }

            New_SellInstruction.save( function (err) {
                if(err)
                    return next(err);
                res.status(200).send('Save ok');
            });
        }
    });

});
router.post('/FindResultOfTradeIns', function (req, res, next) {
    if( req.cookies.saId == undefined )
    {
        res.redirect('/SecAccSys/login');
    }
    else {
        var saID = req.cookies.saId;

        BuyInstruction.find({saID: saID}).sort({time: -1}).exec(function (err, docs) {
            if (docs == null) {
                res.send("用户名未查找到");
            }
            else {
                res.json(JSON.stringify(docs));
            }
        });
        SellInstruction.find({saID: saID}).sort({time: -1}).exec(function (err, docs) {
            if (docs == null) {
                res.send("用户名未查找到");
            }
            else {
                console.log(JSON.stringify(docs));
                //res.json(JSON.stringify(docs));
            }
        });
    }

    });

router.post('/cancel', function (req, res, next) {
    var stockID = req.body['stockID'];
    var time = req.body['time'];
    BuyInstruction.remove({ tickerSymbol:stockID,time:time},function(err,doc){
        if(err) throw err;
        else{
            res.send('删除成功！');
        }
    });
    SellInstruction.remove({ tickerSymbol:stockID,time:time},function(err,doc){
        if(err) throw err;
        else{
            res.send('删除成功！');
        }
    });
});
module.exports = router;