/**
 * Created by zieng on 6/28/16.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CapitalAccount = mongoose.model('CapitalAccount');
var countryList = require('../models/country-list');

router.get('/', function (req, res, next) {
    // res.send('CapAccSys_index');
    if( req.cookies.user == undefined || req.cookies.pass == undefined )
    {
        // res.redirect('/login');
        res.cookie('user', 'CapTest', { maxAge: 900000 });
        res.cookie('pass', '123456', { maxAge: 900000 });
        console.log('Set Cookie');

        res.redirect('/CapAccSys');
    }
    else
        res.render('CapAccSys_index');
});

router.post('/', function (req, res, next) {
    res.send('You submit a form in /CapAccSys');
});

// create
router.get('/create', function (req, res, next) {
    res.render('CapAccSys_create', { title: '资金账户注册', countries : countryList  });
});


router.post('/create', function (req, res, next) {
    var username = req.body['username'];
    var email = req.body['email'];
    var country = req.body['country'];
    var city = req.body['city'];
    var telephone = req.body['telephone'];
    var loginPass = req.body['loginPassword'];
    var loginPass_confirm = req.body['loginPassword_confirm'];
    var tradePass = req.body['tradePassword'];
    var tradePass_confirm = req.body['tradePassword_confirm'];

    if( ! username.trim() )
        res.send('用户名不能为空');
    else if( !loginPass.trim() )
        res.send('登录密码不能为空');
    else if( !tradePass.trim() )
        res.send('交易密码不能为空');
    else if( loginPass != loginPass_confirm )
        res.send('两次输入的登录密码不符');
    else if( tradePass != tradePass_confirm )
        res.send('两次输入的交易密码不符');
    else
    {
        var newAccount = new CapitalAccount();
        newAccount.caId = Math.random();
        newAccount.username = username;
        newAccount.loginPassword = loginPass;
        newAccount.tradePassword = tradePass;
        newAccount.country = country;
        newAccount.city = city;
        newAccount.email = email;
        newAccount.telephone = telephone;

        newAccount.save( function (err) {
            if(err)
                return next(err);
            res.status(200).send('Save ok');
        });
    }

});

// update info
router.get('/editinfo', function (req, res, next) {
    res.send('Edit Info');
});
router.post('/editinfo', function (req, res, next) {
    if( req.cookies.user == undefined || req.cookies.pass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        CapitalAccount.findOne({username: req.cookies.user}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                
            }

        });
    }
});

// activate account
router.get('/activate', function (req, res, next) {
    res.send('activate account');
});
router.post('/activate', function (req, res, next) {
    if( req.cookies.user == undefined || req.cookies.pass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        CapitalAccount.findOne({username: req.cookies.user}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {

            }
        });
    }
});

// Modify
router.get('/changePass', function (req, res, next) {
    res.render('CapAccSys_changePass');
});

router.post('/changePass', function (req, res, next) {
    if( req.cookies.user == undefined || req.cookies.pass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        CapitalAccount.findOne({username: req.cookies.user}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                console.log("cookie.user = "+req.cookies.user);

                var passwordType = req.body.passwordType;
                var oldPassword = req.body.oldPassword;
                var newPassword = req.body.newPassword1;
                var newPassword_confirm = req.body.newPassword2;

                console.log("password type= "+passwordType);
                console.log("oldPassword = "+oldPassword);
                console.log("newPassword = "+newPassword);


                if( newPassword == newPassword_confirm )
                {
                    if( passwordType == 'transaction' && oldPassword == obj.tradePassword )
                        obj.tradePassword = newPassword;
                    else if( passwordType == 'withdrawal' && oldPassword == obj.withdrawalPassword )
                        obj.withdrawalPassword = newPassword;
                    else if( passwordType == 'login' && oldPassword == obj.loginPassword )
                        obj.loginPassword = newPassword;
                    else
                        res.send('旧密码错误!!');

                    obj.save( function (err) {
                        if( err )
                            return next(err);
                        res.send('成功修改密码');
                    });
                }
                else
                {
                    res.send('两次输入的新密码不匹配!!');
                }
            }

        });

    }

});

// MoneySave
router.get('/MoneySave', function (req, res, next) {
    res.render('CapAccSys_moneysave');
});

router.post('/MoneySave', function (req, res, next) {
    if( req.cookies.user == undefined || req.cookies.pass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        CapitalAccount.findOne({username: req.cookies.user}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                var toSave = req.body.depositionSum;
                obj.availableCapital = obj.availableCapital + toSave;
                obj.save(function (err) {
                    if( err )
                        return next(err);
                    res.send('成功存入'+toSave+'到账户中');
                });
            }

        });
    }
});

// MoneyLoad
router.get('/MoneyLoad', function (req, res, next) {
    res.render('CapAccSys_moneyload');
});

router.post('/MoneyLoad', function (req, res, next) {
    if( req.cookies.user == undefined || req.cookies.pass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        CapitalAccount.findOne({username: req.cookies.user}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                var withdrawalPassword = req.body.withdrawalPassword;
                var money = req.body.withdrawalSum;

                if( withdrawalPassword != obj.withdrawalPassword )
                    res.send('取款密码不正确');
                else if ( obj.availableCapital < money )
                    res.send('账户余额不足');
                else
                {
                    obj.availableCapital = obj.availableCapital - money;
                    obj.save( function (err) {
                        if( err )
                            return next(err);
                        res.send('成功取出'+money+'。');
                    });
                }
            }
        });
    }
});

// Lost
router.get('/Lost', function (req, res, next) {
    res.render('CapAccSys_lost');
});

router.post('/Lost', function (req, res, next) {
    if( req.cookies.user == undefined || req.cookies.pass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        CapitalAccount.findOne({username: req.cookies.user}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                //todo
            }

        });
    }
});

// Delete
router.get('/Delete', function (req, res, next) {
    res.render('CapAccSys_delete');
});

router.post('/Delete', function (req, res, next) {
    if( req.cookies.user == undefined || req.cookies.pass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        CapitalAccount.findOne({username: req.cookies.user}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {

            }

        });
    }
});

// Info
router.get('/Info', function (req, res, next) {
    res.render('CapAccSys_info');
});

router.post('/Info', function (req, res, next) {
    if( req.cookies.user == undefined || req.cookies.pass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        CapitalAccount.findOne({username: req.cookies.user}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {

            }

        });
    }
});

module.exports = router;