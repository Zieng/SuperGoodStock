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



router.get('/securities_signup', function(req, res, next) {
    res.render('securities_signup', { title: '证券账户注册', account_type : securities_account_type  });
});


// router.get("*", function (req, res) {
//     res.render('404', { title: 'Page Not Found'});
// });

module.exports = router;
