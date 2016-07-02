var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var SecAccount = mongoose.model('SecuritiesAccount');
var CapitalAccount = mongoose.model('CapitalAccount');


    /* GET users listing. */
router.get('/', function(req, res, next) {
    // SecAccount.find({}, function (err, docs) {
    //     if( !err )
    //     {
    //         // res.render('index',{
    //         //     title: 'SecuritiesAccount',
    //         //     accouts: docs
    //         // });
    //
    //         res.send(JSON.stringify(docs) ) ;
    //     }
    //     else
    //         console.log("can't find SecuritiesAccount!");
    // })
    console.log("get all accounts");
    CapitalAccount.find().lean({}).exec(function (err, results) {
        return res.send(JSON.stringify(results));
    })
});

router.get('/add', function (req, res, next) {
    var newAccount = new SecAccount();
    newAccount.saId = 72;
    newAccount.tytpe = 0;
    newAccount.save(function (err) {
        if(err)
            return next(err);
        res.send('add a new Securities Account');
    })
});

router.get('/del', function (req, res, next) {
    CapitalAccount.find({}).remove().exec();
    res.send("delete all accounts");
});

module.exports = router;
