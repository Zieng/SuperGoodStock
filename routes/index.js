var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var SecAccount = mongoose.model('SecuritiesAccount');
var CapitalAccount = mongoose.model('CapitalAccount');

var securities_account_type = require('../models/securities_account_type');
    
    
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '首页' });
});

router.get('/login', function(req, res, next) {
    if (req.cookies.user == undefined || req.cookies.pass == undefined)
    {
        res.render('login', { title: '登陆' });
    }
    else
    {
        res.send("use cookie auto login");
    }
});

router.post('/login', function (req, res, next) {
    var username = req.body['user'];
    var password = req.body['pass'];
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
                res.send(JSON.stringify(doc));
        }
    });

    // res.send("post login");
});


router.get('/securities_signup', function(req, res, next) {
    res.render('securities_signup', { title: '证券账户注册', account_type : securities_account_type  });
});


// router.get("*", function (req, res) {
//     res.render('404', { title: 'Page Not Found'});
// });

module.exports = router;
