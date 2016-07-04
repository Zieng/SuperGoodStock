/**
 * Created by climberpi on 7/4/16.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CapitalAccount = mongoose.model('CapitalAccount');
var SecuritiesAccount = mongoose.model('SecuritiesAccount');

var countryList = require('../models/country-list');


router.get('/', function (req, res, next) {
    if( req.cookies.secId == undefined || req.cookies.secPass == undefined )
    {
        res.redirect('/SecAccSys/login');
    }
    else
        res.render('SecAccSys_index');
});
router.post('/', function (req, res, next) {
    res.send('You submit a form in /SecAccSys');
});


router.get('/register', function (req, res, next) {
    // clear cookies
    res.cookie('secId', "", { expires: new Date() });
    res.cookie('secPass', "", { expires: new Date() });

    res.render('SecAccSys/register', { title: '账户注册', countries : countryList  });
});
router.post('/register', function (req, res, next) {
    var c = 0;
    console.log(req.query['Corporate']);
    if(req.query['Corporate'] == 1){
        c = 1;
    }
    if(c == 0){
        var username = req.body['name'];
        var usertype = 'Individual';
        var usersex = req.body['sex'];
        var userIdno = req.body['idno'];
        var telephone = req.body['phone'];
        var addr = req.body['addr'];
        var career = req.body['career'];
        var degree = req.body['degree'];
        var company = req.body['company'];
        var password = req.body['password'];
    } else {
        var usertype = 'Corporate';
        var docid = req.body['docid'];
        var fname = req.body['fname'];
        var fidno = req.body['fidno'];
        var fphone = req.body['fphone'];
        var faddr = req.body['addr'];
        var username = req.body['name'];
        var userIdno = req.body['idno'];
        var telephone = req.body['phone'];
        var addr = req.body['addr'];
        var company = req.body['company'];
        var password = req.body['password'];
    }
    /*
    var newAccount = new SecuritiesAccount();
    newAccount.secId = Math.random();
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
        res.redirect('/SecAccSys/login');
    });*/

});


router.get('/login', function(req, res, next) {
    if (req.cookies.secId == undefined || req.cookies.secPass == undefined)
    {
        res.render('SecAccSys/login', { title: '登陆' });
    }
    else
    {
        res.send("use cookie auto login");
    }
});
router.post('/login', function (req, res, next) {
    // clear cookies
    res.cookie('secId', "", { expires: new Date() });
    res.cookie('secPass', "", { expires: new Date() });

    var username = req.body['user'];
    var password = req.body['pass'];
    SecuritiesAccount.findOne({username: username}, function (err, doc) {
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
                // res.send(JSON.stringify(doc));

                res.cookie('secId', doc.secId, { maxAge: 900000 });
                res.cookie('secPass', password, { maxAge: 900000 });

                // console.log('hello');
                res.redirect('/SecAccSys');
            }

        }
    });
});


/*router.get('/logout', function (req, res, next) {
    // clear cookies
    res.cookie('secId', "", { expires: new Date() });
    res.cookie('secPass', "", { expires: new Date() });

    res.redirect('/SecAccSys/login');
});*/


// activate account
/*router.get('/activate', function (req, res, next) {
    res.send('activate account');
});
router.post('/activate', function (req, res, next) {
    if( req.cookies.secId == undefined || req.cookies.secPass == undefined )
    {
        res.redirect('/SecAccSys/login');
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
            SecuritiesAccount.findOne({secId: req.cookies.secId}, function (err, obj) {
                if( err )
                    throw err;
                if( obj == null )
                    res.send('user not found');
                else
                {
                    obj.tradePassword = tradePassword;
                    obj.withdrawalPassword = withdrawalPassword;
                    obj.save( function (err) {
                        if( err )
                            return next(err);
                        res.send('开通账户成功');
                    })
                }
            });
        }
    }
});*/


// Lost
router.get('/Lost', function (req, res, next) {
    res.render('SecAccSys/lossReport');
});
router.post('/Lost', function (req, res, next) {
    if( req.cookies.secId == undefined || req.cookies.secPass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        var c = 0;
        console.log(req.query['Corporate']);
        if(req.query['Corporate'] == 1){
            c = 1;
        }
        if(c = 0){
            var id = req.body['stockid'];
            var name = req.body['name'];
            var idno = req.body['idno'];
        }
        else{
            var id = req.body['stockid'];
            var docid = req.body['docid'];
            var fname = req.body['fname'];
            var fidno = req.body['fidno'];
        } 
/*        var personId = req.body.id;
        var trueName = req.body.name;
        var gender = req.body.gender;
        var address = req.body.address;

        SecuritiesAccount.findOne({secId: req.cookies.secId}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                if( personId == obj.personId && trueName == obj.trueName && gender == obj.gender )
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

        });*/
    }
});


// Delete
router.get('/Delete', function (req, res, next) {
    res.render('SecAccSys/closeAccount');
});
router.post('/Delete', function (req, res, next) {
    if( req.cookies.secId == undefined || req.cookies.secPass == undefined )
    {
        res.redirect('/login');
    }
    else
    {
        var c = 0;
        console.log(req.query['Corporate']);
        if(req.query['Corporate'] == 1){
            c = 1;
        }
        if(c = 0){
            var id = req.body['stockid'];
            var name = req.body['name'];
            var idno = req.body['idno'];
        }
        else{
            var id = req.body['stockid'];
            var docid = req.body['docid'];
            var fname = req.body['fname'];
            var fidno = req.body['fidno'];
        }

        var personId = req.body.id;
        var trueName = req.body.name;
        var gender = req.body.gender;
        var address = req.body.address;
        var withdrawalPassword = req.body.withdrawalPassword;
        var remove = false;

        SecuritiesAccount.findOne({secId: req.cookies.secId}, function (err, obj) {
            if( err )
                throw err;
            if( obj == null )
                res.send('user not found');
            else
            {
                if( personId == obj.personId && trueName == obj.trueName && gender == obj.gender
                    && withdrawalPassword == obj.withdrawalPassword )
                {
                    SecuritiesAccount.remove({secId: req.cookies.secId}, function (err2) {
                        if(err2)
                            return next(err2);
                        else
                        {
                            // clear cookies
                            res.cookie('secId', "", { expires: new Date() });
                            res.cookie('secPass', "", { expires: new Date() });
                            res.redirect('/SecAccSys/signup');
                        }
                    });
                }
                else
                    res.send('账户验证失败!请检查是否输入有误');
            }

        });
    }
});


router.get('/forgetpass', function (req, res, enext) {
    res.send('请联系管理员');
    res.end();
});


router.get('modify', function (req, res, next) {

  var c = 0;
  console.log(req.query['Corporate']);
  if(req.query['Corporate'] == 1){
    c = 1;
  }
  if(c == 0) {
    res.render('SecAccSys/modifyIndividual', {
      title: '修改信息',
      stockID: '1234567890',
      name: '张三',
      sex: 'male',
      idno: '1213214324',
      phone: '12132321',
      addr: 'dsdfdfdsfds',
      degree: '本科',
      career: 'dsadsa',
      company: 'dsadasda'
    });
  } else {
    res.render('SecAccSys/modifyCorporate', {
      title: '修改信息',
      stockID: '1234567890',
      docid: '12345',
      fname: '张三',
      fidno: '1213214324',
      fphone: '12132321',
      faddr: 'dsdfdfdsfds',
      name: '张三',
      idno: '1213214324',
      phone: '12132321',
      addr: 'dsdfdfdsfds'
    });
  }

});
router.post('/modify', function (req, res, next) {
    var c = 0;
    console.log(req.query['Corporate']);
    if(req.query['Corporate'] == 1){
        c = 1;
    }
    if(c == 0){
        var username = req.body['name'];
        var usertype = 'Individual';
        var usersex = req.body['sex'];
        var userIdno = req.body['idno'];
        var telephone = req.body['phone'];
        var addr = req.body['addr'];
        var career = req.body['career'];
        var degree = req.body['degree'];
        var company = req.body['company'];
        var password = req.body['password'];
    } else {
        var usertype = 'Corporate';
        var docid = req.body['docid'];
        var fname = req.body['fname'];
        var fidno = req.body['fidno'];
        var fphone = req.body['fphone'];
        var faddr = req.body['addr'];
        var username = req.body['name'];
        var userIdno = req.body['idno'];
        var telephone = req.body['phone'];
        var addr = req.body['addr'];
        var company = req.body['company'];
        var password = req.body['password'];
    }
});

module.exports = router;