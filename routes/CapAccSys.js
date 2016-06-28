/**
 * Created by zieng on 6/28/16.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CapitalAccount = mongoose.model('CapitalAccount');
var countryList = require('../models/country-list');

router.get('/', function (req, res, next) {
    res.send('CapAccSys');
});

// create
router.get('/create', function (req, res, next) {
    res.render('CapAccSys_create', { title: '资金账户注册', countries : countryList  });
});


router.post('/create', function (req, res, next) {
    var username = req.body['username'];
    var email = req.body['email'];
    var loginPass = req.body['loginPassword'];
    var loginPass_confirm = req.body['loginPassword_confirm'];
    var tradePass = req.body['tradePassword'];
    var tradePass_confirm = req.body['tradePassword_confirm'];

    console.log( typeof(username) );

    if( ! username.trim() )
        res.send('用户名不能为空');
    else
        res.send(username);
});

// Modify
router.get('/modify', function (req, res, next) {

});

router.post('/modify', function (req, res, next) {

});

// MoneySave
router.get('/MoneySave', function (req, res, next) {

});

router.post('/MoneySave', function (req, res, next) {

});

// MoneyLoad
router.get('/MoneyLoad', function (req, res, next) {

});

router.post('/MoneyLoad', function (req, res, next) {

});

// Lost
router.get('/Lost', function (req, res, next) {

});

router.post('/Lost', function (req, res, next) {

});

// Delete
router.get('/Delete', function (req, res, next) {

});

router.post('/Delete', function (req, res, next) {

});

// Info
router.get('/Info', function (req, res, next) {

});

router.post('/Info', function (req, res, next) {

});

module.exports = router;