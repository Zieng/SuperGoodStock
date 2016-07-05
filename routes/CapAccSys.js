/**
 * Created by zieng on 6/28/16.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CapitalAccount = mongoose.model('CapitalAccount');
var SecuritiesAccount = mongoose.model('SecuritiesAccount');
var Counter = mongoose.model('counter');

var countryList = require('../models/country-list');

var rememberMe = false;

// get the CapAccSys main page
router.get('/', function (req, res, next) {
    // res.send('CapAccSys_index');
    if( req.cookies.caId == undefined || req.cookies.capPass == undefined )
    {
        res.redirect('/CapAccSys/login');
    }
    else
        res.render('CapAccSys_index');
});
router.post('/', function (req, res, next) {
    res.send('You submit a form in /CapAccSys');
});


router.get('/signup', function (req, res, next) {
    // clear cookies
    res.cookie('caId', "", { expires: new Date() });
    res.cookie('capPass', "", { expires: new Date() });

    res.render('CapAccSys_signup', { title: '账户注册', countries : countryList  });
});
router.post('/signup', function (req, res, next) {
    var username = req.body['username'];
    var email = req.body['email'];
    var country = req.body['country'];
    var city = req.body['city'];
    var telephone = req.body['telephone'];
    var loginPass = req.body['loginPassword'];
    var loginPass_confirm = req.body['loginPassword_confirm'];

    if( ! username.trim() )
        res.send('用户名不能为空');
    else if( !loginPass.trim() )
        res.send('登录密码不能为空');
    else if( loginPass != loginPass_confirm )
        res.send('两次输入的登录密码不符');
    else
    {
        Counter.findById({_id: 'CapitalAccount'}, function (err, obj) {
            if( err )
                return next(err);
            var newAccount = new CapitalAccount();
            newAccount.caId = obj.seq;
            newAccount.username = username;
            newAccount.loginPassword = loginPass;
            newAccount.country = country;
            newAccount.city = city;
            newAccount.email = email;
            newAccount.telephone = telephone;

            newAccount.save( function (err) {
                if(err)
                    return next(err);
                res.status(200);
                res.redirect('/CapAccSys/login');
            });
        });
    }

});


router.get('/login', function(req, res, next) {
    if (req.cookies.caId == undefined || req.cookies.capPass == undefined)
    {
        res.render('CapAccSys_login', { title: '登陆' });
    }
    else
    {
        // res.send("use cookie auto login");
        res.redirect('/CapAccSys');
    }
});
router.post('/login', function (req, res, next) {
    // clear cookies
    res.cookie('caId', "", { expires: new Date() });
    res.cookie('capPass', "", { expires: new Date() });

    var username = req.body['user'];
    var password = req.body['pass'];
    rememberMe = req.body['rememberMe'];
    console.log('RememberMe: '+rememberMe);
    CapitalAccount.findOne({username: username}, function (err, doc) {
        if( doc == null )
        {
            res.send('User Not Found');
        }
        else
        {
            if( password != doc.loginPassword )
                res.send('Invalid Password');
            else
            {
                res.cookie('caId', doc.caId, { maxAge: 900000 });
                res.cookie('capPass', password, { maxAge: 900000 });

                // console.log('hello');
                res.redirect('/CapAccSys');
            }
        }
    });
});


router.get('/logout', function (req, res, next) {
    // clear cookies
    res.cookie('caId', "", { expires: new Date() });
    res.cookie('capPass', "", { expires: new Date() });

    res.redirect('/CapAccSys/login');
});


// update info
router.get('/editinfo', function (req, res, next) {
    res.send('Edit Info');
});
router.post('/editinfo', function (req, res, next) {
    if( req.cookies.caId == undefined || req.cookies.capPass == undefined )
    {
        res.redirect('/CapAccSys/login');
    }
    else
    {
        var personId = req.body.id;
        var securitiesAccount = req.body.securitiesAccount;
        var trueName = req.body.name;
        var gender = req.body.genderRadios;
        var address = req.body.address;

        CapitalAccount.findOne({caId: req.cookies.caId}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                SecuritiesAccount.findOne({saId: securitiesAccount}, function (err2, secAccount) {
                    if( err2 )
                        throw err2;
                    if( secAccount == null )
                        res.send('No such Securities Account!');
                    else
                    {
                        // console.log(typeof obj.saID);
                        // console.log(secAccount.saId);

                        obj.personId = personId;
                        obj.saId = secAccount.saId;
                        obj.trueName = trueName;
                        obj.gender = gender;
                        obj.address = address;

                        obj.save( function (err) {
                            if( err )
                                return next(err);
                            res.send('成功录入信息');
                        });
                    }
                });
            }

        });
    }
});


// activate account
router.get('/activate', function (req, res, next) {
    res.send('activate account');
});
router.post('/activate', function (req, res, next) {
    if( req.cookies.caId == undefined || req.cookies.capPass == undefined )
    {
        res.redirect('/CapAccSys/login');
    }
    else
    {
        var tradePassword = req.body.transactionPassword1;
        var tradePassword_confirm = req.body.transactionPassword2;
        var withdrawalPassword = req.body.withdrawalPassword1;
        var withdrawalPassword_confirm = req.body.withdrawalPassword2;

        if( tradePassword != tradePassword_confirm || withdrawalPassword != withdrawalPassword_confirm)
            res.send('输入的两次密码不符');
        else
        {
            CapitalAccount.findOne({caId: req.cookies.caId}, function (err, obj) {
                if( err )
                    throw err;
                if( obj == null )
                    res.send('user not found');
                else
                {
                    obj.tradePassword = tradePassword;
                    obj.withdrawalPassword = withdrawalPassword;
                    obj.activate = true;
                    obj.save( function (err) {
                        if( err )
                            return next(err);
                        res.send('开通账户成功');
                    })
                }
            });
        }
    }
});


// Modify
router.get('/Modify', function (req, res, next) {
    res.render('CapAccSys_modify');
});
router.post('/Modify', function (req, res, next) {
    if( req.cookies.caId == undefined || req.cookies.capPass == undefined )
    {
        res.redirect('/CapAccSys/login');
    }
    else
    {
        CapitalAccount.findOne({caId: req.cookies.caId}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                // console.log("cookie.caId = "+req.cookies.caId);
                // console.log(obj);

                var passwordType = req.body.passwordType;
                var oldPassword = req.body.oldPassword;
                var newPassword = req.body.newPassword1;
                var newPassword_confirm = req.body.newPassword2;

                // console.log("password type= "+passwordType);
                // console.log("oldPassword = "+oldPassword);
                // console.log("newPassword = "+newPassword);

                if( obj.activate == false)
                {
                    res.send('请先开通账户');
                }
                else if( newPassword == newPassword_confirm )
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
    if( req.cookies.caId == undefined || req.cookies.capPass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        var toSave = req.body.depositionSum;
        if( toSave <= 0 )
            res.send('存入金额必须为正数');
        else 
        {
            CapitalAccount.findOne({caId: req.cookies.caId}, function (err, obj) {
                if( err )
                    throw err;
                if( obj == null )
                    res.send('user not found');
                else
                {
                    if( obj.activate == false)
                    {
                        res.send('请先开通账户');
                    }
                    else if( obj.isLost == false )
                    {

                        obj.availableCapital = obj.availableCapital + toSave;
                        obj.save(function (err) {
                            if( err )
                                return next(err);
                            res.send('成功存入'+toSave+'到账户中');
                        });
                    }
                    else
                    {
                        res.send('账户已冻结,不能进行存款操作');
                    }
                }

            });
        }
    }
});


// MoneyLoad
router.get('/MoneyLoad', function (req, res, next) {
    res.render('CapAccSys_moneyload');
});
router.post('/MoneyLoad', function (req, res, next) {
    if( req.cookies.caId == undefined || req.cookies.capPass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        var money = req.body.withdrawalSum;
        
        if( money <= 0 )
            res.send('取款金额必须为正数');
        else 
        {
            CapitalAccount.findOne({caId: req.cookies.caId}, function (err, obj) {
                if( err )
                    throw err;
                if( obj == null )
                    res.send('user not found');
                else
                {
                    var withdrawalPassword = req.body.withdrawalPassword;
                    
                    if( obj.activate == false)
                    {
                        res.send('请先开通账户');
                    }
                    else if( withdrawalPassword != obj.withdrawalPassword )
                        res.send('取款密码不正确');
                    else if ( obj.availableCapital < money )
                        res.send('账户余额不足');
                    else
                    {
                        if( obj.isLost == false)
                        {
                            obj.availableCapital = obj.availableCapital - money;
                            obj.save( function (err) {
                                if( err )
                                    return next(err);
                                res.send('成功取出'+money+'。');
                            });
                        }
                        else
                            res.send('账户已冻结,不能进行取款操作');
                    }
                }
            });
        }
    }
});


// Lost
router.get('/Lost', function (req, res, next) {
    res.render('CapAccSys_lost');
});
router.post('/Lost', function (req, res, next) {
    if( req.cookies.caId == undefined || req.cookies.capPass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        var personId = req.body.id;
        var trueName = req.body.name;
        var gender = req.body.gender;
        var address = req.body.address;

        CapitalAccount.findOne({caId: req.cookies.caId}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                if( obj.activate == false)
                {
                    res.send('请先开通账户');
                }
                else if( personId == obj.personId && trueName == obj.trueName && gender == obj.gender )
                {
                    obj.isLost = true;
                    obj.save( function (err) {
                        if( err )
                            return next(err);
                        res.send('挂失账户成功!解挂请联系管理员');
                    });
                }
                else
                    res.send('账户验证失败!请检查是否输入有误');
            }

        });
    }
});


// Delete
router.get('/Delete', function (req, res, next) {
    res.render('CapAccSys_delete');
});
router.post('/Delete', function (req, res, next) {
    if( req.cookies.caId == undefined || req.cookies.capPass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        var personId = req.body.id;
        var trueName = req.body.name;
        var gender = req.body.gender;
        var address = req.body.address;
        var withdrawalPassword = req.body.withdrawalPassword;
        var remove = false;

        CapitalAccount.findOne({caId: req.cookies.caId}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                if( obj.activate == false)
                {
                    res.send('请先开通账户');
                }
                else if( personId == obj.personId && trueName == obj.trueName && gender == obj.gender
                    && withdrawalPassword == obj.withdrawalPassword )
                {
                    CapitalAccount.remove({caId: req.cookies.caId}, function (err2) {
                        if(err2)
                            return next(err2);
                        else
                        {
                            // clear cookies
                            res.cookie('caId', "", { expires: new Date() });
                            res.cookie('capPass', "", { expires: new Date() });
                            res.redirect('/CapAccSys/signup');
                        }
                    });
                }
                else
                    res.send('账户验证失败!请检查是否输入有误');
            }

        });
    }
});


// Info
router.get('/Info', function (req, res, next) {
    res.render('CapAccSys_info');
});
router.post('/Info', function (req, res, next) {
    if( req.cookies.caId == undefined || req.cookies.capPass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        // console.log(req);
        CapitalAccount.findOne({caId: req.cookies.caId}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                if( obj.isLost )
                    res.send('账户已冻结,请先解冻');
                else 
                {
                    // res.setHeader('Content-Type', 'application/json');
                    res.json(JSON.stringify(obj));
                    // res.json(JSON.stringify(obj, null, 3));
                }
            }
        });
    }
});


router.get('/forgetpass', function (req, res, enext) {
    res.send('请联系管理员');
    res.end();
});

module.exports = router;