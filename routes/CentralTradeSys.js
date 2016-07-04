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
var BuyCapitalAccount = mongoose.model('CapitalAccount');
var SellCapitalAccount = mongoose.model('CapitalAccount');

var close = 0; // flag of the trade system whether closed or not


//open central trade system
router.get('/openCentralTradeSys', function (req, res, next) {

    var open = req.body['open'];
    var limit = 0.1;                      //limit of the increase and decrease of the stocks
    if(open ==1){
        res.send('打开交易系统失败！');
    }
    else{
       res.send('交易系统已开启');
            close = 0;
            Stocks.find({}).exec(function (err, stocksResults) {
                if (err) {
                    throw err;
                }
                async.each(stocksResults, function(item, callback) {

                    async.whilst(
                        function() { return close !=1 },
                        function(cb) {
                            BuyInstruction.findOne({tickerSymbol: item.tickerSymbol,"amount":{"$ne":0}}).sort({
                                price: -1,
                                time: 1
                            }).exec(function (err, HighestBuyIns) {
                                if (err) {
                                      throw err;
                                }
                                if(HighestBuyIns == null)
                                        res.send("no more buy instructions");

                                SellInstruction.findOne({tickerSymbol: item.tickerSymbol,"amount":{"$ne":0}}).sort({
                                    price: 1,
                                    time: 1
                                }).exec(function (err, LowestSellIns) {
                                    if (err) {
                                        throw err;
                                    }
                                    if(LowestSellIns == null)
                                        res.send("no more sell instructions");
                                    else {
                                        // if buy and sell instruction price is match
                                        if (HighestBuyIns.price == LowestSellIns.price) {

                                            //modify the current price of the stock
                                            item.currentPricee = HighestBuyIns.price;
                                            item.save(function (err) {
                                                if (err) {
                                                    throw err;
                                                }
                                            });

                                            //change the amount info of the buy and sell instruction
                                            if (HighestBuyIns.amount == LowestSellIns.amount) {
                                                HighestBuyIns.restAmount = 0;
                                                HighestBuyIns.state = 1;  //fully trade
                                                LowestSellIns.restAmount = 0;
                                                LowestSellIns.state = 1; //fully trade
                                                HighestBuyIns.save(function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                                LowestSellIns.save(function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                                //send a info to the user of buy and sell instruction

                                                BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                    if(err)
                                                        throw err;
                                                    docs.availableCapital = HighestBuyIns.amount*HighestBuyIns.price;
                                                    docs.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                });


                                                SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                    if(err)
                                                        throw err;
                                                    docs.availableCapital = LowestSellIns.amount*LowestSellIns.price;
                                                    docs.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                });

                                            }
                                            else if (HighestBuyIns.amount < LowestSellIns.amount) {
                                                HighestBuyIns.restAmount = 0;
                                                HighestBuyIns.state = 1;  //fully trade
                                                LowestSellIns.restAmount = LowestSellIns.amount - HighestBuyIns.amount;
                                                LowestSellIns.state = 0; //part trade
                                                HighestBuyIns.save(function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                                LowestSellIns.save(function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                                //send a info to the user of the buy instruction

                                                BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                    if(err)
                                                        throw err;
                                                    docs.availableCapital = HighestBuyIns.amount*HighestBuyIns.price;
                                                    docs.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                });


                                                SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                    if(err)
                                                        throw err;
                                                    docs.availableCapital = HighestBuyIns.amount*HighestBuyIns.price;
                                                    docs.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                });


                                            }
                                            else {
                                                HighestBuyIns.restAmount = HighestBuyIns.amount - LowestSellIns.amount;
                                                HighestBuyIns.state = 0;  //part trade
                                                LowestSellIns.restAmount = 0;
                                                LowestSellIns.state = 1; //fully trade
                                                HighestBuyIns.save(function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                                LowestSellIns.save(function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                                //send a info to the user of the sell instruction

                                                BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                    if(err)
                                                        throw err;
                                                    docs.availableCapital = LowestSellIns.amount*LowestSellIns.price;
                                                    docs.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                });


                                                SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                    if(err)
                                                        throw err;
                                                    docs.availableCapital = LowestSellIns.amount*LowestSellIns.price;
                                                    docs.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                });

                                            }
                                        }
                                        else if (HighestBuyIns.price < LowestSellIns.price) {

                                            //modify the current price of the stock
                                            if (item.openingPrice * (1 + limit) < ((HighestBuyIns.price + LowestSellIns.price) / 2)) {
                                                //modify the current price of the stock
                                                item.currentPricee = item.openingPrice * (1 + limit);
                                                item.save(function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });

                                                // change the buy and sell instruction amount info.
                                                if (HighestBuyIns.amount == LowestSellIns.amount) {
                                                    HighestBuyIns.restAmount = 0;
                                                    HighestBuyIns.state = 1;  //fully trade
                                                    LowestSellIns.restAmount = 0;
                                                    LowestSellIns.state = 1; //fully trade
                                                    HighestBuyIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    LowestSellIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    //send a info to the user of buy and sell instruction

                                                    BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*item.openingPrice * (1 + limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });


                                                    SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*item.openingPrice * (1 + limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });

                                                }
                                                else if (HighestBuyIns.amount < LowestSellIns.amount) {
                                                    HighestBuyIns.restAmount = 0;
                                                    HighestBuyIns.state = 1;  //fully trade
                                                    LowestSellIns.restAmount = LowestSellIns.amount - HighestBuyIns.amount;
                                                    LowestSellIns.state = 0; //part trade
                                                    HighestBuyIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    LowestSellIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    //send a info to the user of the buy instruction

                                                    BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*item.openingPrice * (1 + limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });


                                                    SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*item.openingPrice * (1 + limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });

                                                }
                                                else {
                                                    HighestBuyIns.restAmount = HighestBuyIns.amount - LowestSellIns.amount;
                                                    HighestBuyIns.state = 0;  //part trade
                                                    LowestSellIns.restAmount = 0;
                                                    LowestSellIns.state = 1; //fully trade
                                                    HighestBuyIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    LowestSellIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    //send a info to the user of the sell instruction

                                                    BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*item.openingPrice * (1 + limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });


                                                    SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*item.openingPrice * (1 + limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });
                                                }
                                            }
                                            else if (item.openingPrice * (1 - limit) > ((HighestBuyIns.price + LowestSellIns.price) / 2)) {
                                                //modify the current price of the stock
                                                item.currentPricee = item.openingPrice * (1 - limit);
                                                item.save(function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });

                                                // change the buy and sell instruction amount info.
                                                if (HighestBuyIns.amount == LowestSellIns.amount) {
                                                    HighestBuyIns.restAmount = 0;
                                                    HighestBuyIns.state = 1;  //fully trade
                                                    LowestSellIns.restAmount = 0;
                                                    LowestSellIns.state = 1; //fully trade
                                                    HighestBuyIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    LowestSellIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    //send a info to the user of buy and sell instruction

                                                    BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount* item.openingPrice * (1 - limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });


                                                    SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount* item.openingPrice * (1 - limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });

                                                }
                                                else if (HighestBuyIns.amount < LowestSellIns.amount) {
                                                    HighestBuyIns.restAmount = 0;
                                                    HighestBuyIns.state = 1;  //fully trade
                                                    LowestSellIns.restAmount = LowestSellIns.amount - HighestBuyIns.amount;
                                                    LowestSellIns.state = 0; //part trade
                                                    HighestBuyIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    LowestSellIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    //send a info to the user of the buy instruction

                                                    BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount* item.openingPrice * (1 - limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });


                                                    SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount* item.openingPrice * (1 - limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });

                                                }
                                                else {
                                                    HighestBuyIns.restAmount = HighestBuyIns.amount - LowestSellIns.amount;
                                                    HighestBuyIns.state = 0;  //part trade
                                                    LowestSellIns.restAmount = 0;
                                                    LowestSellIns.state = 1; //fully trade
                                                    HighestBuyIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    LowestSellIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    //send a info to the user of the sell instruction

                                                    BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount* item.openingPrice * (1 - limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });


                                                    SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount* item.openingPrice * (1 - limit);
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });
                                                }
                                            }
                                            else {

                                                item.currentPricee = (HighestBuyIns.price + LowestSellIns.price) / 2;
                                                item.save(function (err) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                });
                                                // change the buy and sell instruction amount info.
                                                if (HighestBuyIns.amount == LowestSellIns.amount) {
                                                    HighestBuyIns.restAmount = 0;
                                                    HighestBuyIns.state = 1;  //fully trade
                                                    LowestSellIns.restAmount = 0;
                                                    LowestSellIns.state = 1; //fully trade
                                                    HighestBuyIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    LowestSellIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    //send a info to the user of buy and sell instruction

                                                    BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*  (HighestBuyIns.price + LowestSellIns.price) / 2;
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });


                                                    SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*  (HighestBuyIns.price + LowestSellIns.price) / 2;
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });

                                                }
                                                else if (HighestBuyIns.amount < LowestSellIns.amount) {
                                                    HighestBuyIns.restAmount = 0;
                                                    HighestBuyIns.state = 1;  //fully trade
                                                    LowestSellIns.restAmount = LowestSellIns.amount - HighestBuyIns.amount;
                                                    LowestSellIns.state = 0; //part trade
                                                    HighestBuyIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    LowestSellIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    //send a info to the user of the buy instruction

                                                    BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*  (HighestBuyIns.price + LowestSellIns.price) / 2;
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });


                                                    SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*  (HighestBuyIns.price + LowestSellIns.price) / 2;
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });

                                                }
                                                else {
                                                    HighestBuyIns.restAmount = HighestBuyIns.amount - LowestSellIns.amount;
                                                    HighestBuyIns.state = 0;  //part trade
                                                    LowestSellIns.restAmount = 0;
                                                    LowestSellIns.state = 1; //fully trade
                                                    HighestBuyIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    LowestSellIns.save(function (err) {
                                                        if (err) {
                                                            throw err;
                                                        }
                                                    });
                                                    //send a info to the user of the sell instruction

                                                    BuyCapitalAccount.findOne({caId: HighestBuyIns.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount*  (HighestBuyIns.price + LowestSellIns.price) / 2;
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });


                                                    SellCapitalAccount.findOne({caId: SellInstruction.caId}).exec(function (err, docs) {
                                                        if(err)
                                                            throw err;
                                                        docs.availableCapital = LowestSellIns.amount* (HighestBuyIns.price + LowestSellIns.price) / 2;
                                                        docs.save(function (err) {
                                                            if (err) {
                                                                throw err;
                                                            }
                                                        });
                                                    });
                                                }


                                            }

                                        }
                                        else;
                                    }
                                });
                            });
                        },
                        function(err) {
                            throw err;
                        }
                    );

                }, function(err) {
                         throw err;
                });
            });

    }
});

//close central trade system
router.get('/openCentralTradeSys', function (req, res, next) {
    close = req.body['close'];
    if(close == 0){
        res.send('关闭交易系统失败！');
    }
    else{
        res.send('交易系统已关闭');
        close =1;
        //delete all instruction that haven't been traded
        Stocks.find({}).exec(function (err, stocksResults) {
            if (err) {
                throw err;
            }
            async.each(stocksResults, function (item, callback) {
                   item.openingPrice = item.currentPrice;
                   item.save(function(err){
                       if(err) throw err;
                   });
            });
        });
        BuyInstruction.remove({state:-1},function(err,docs){
            if(err) throw err;
        });
        SellInstruction.remove({state:-1},function(err,docs){
            if(err) throw err;
        });
    }
});




module.exports = router;