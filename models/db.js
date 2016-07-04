/**
 * Created by zieng on 6/14/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// for auto increment field
var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);

// SecuritiesAccount Schema
var SecS = new Schema({
    saId: {type: Number, default: 0, required: true},
    type: {type: Number, default: 0, required: true},
    registeTime: {type: Date, default: Date.now},
    tel: { type: String, default: 'null' },
    docID: {type: Number, default: 0}
});
mongoose.model('SecuritiesAccount', SecS);

// CapitalAccount Schema
var CapS = new Schema({
    caId:{ type: Number, default: 0, required: true, unique: true},
    // saId: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'SecS'
    // }],
    saId: { type: Number, default: 0},
    username: { type: String, default: 'null' , required: true},
    trueName: { type: String, default: 'tom'},
    loginPassword: { type: String, default: 'null', required: true },
    tradePassword: { type: String, default: 'null', required: true },
    withdrawalPassword: { type: String, default: 'null', required: true},
    availableCapital: { type: Number, default: 0},
    frozenCapital: { type: Number, default: 0},
    personId: { type: Number, default: 0},
    gender: { type: String, default: 'male'},
    birthday: { type: Date, default: Date.now },
    country: { type: String, default: 'China'},
    city: { type: String, default: 'HangZhou'},
    address: { type: String, default: 'Earth'},
    email: { type: String, default: 'null'},
    telephone: { type: Number, default: 13612345678 },
    nextYearInterest: { type: Number, default: 0},
    recentDate: { type: Date, default: Date.now },
    isLost: { type: Boolean, default: false}
});
CapS.pre('save', function (next) {
    counter.findByIdAndUpdate({_id: 'CapitalAccount'}, {$inc: { seq: 1} }, function(error, obj)   {
        if(error)
            return next(error);
        if( obj == null )
        {
            obj = new counter();
            obj._id = 'CapitalAccount';
            obj.seq = 1;
            obj.save( function (err) {
                if( err )
                    return next(err);
            });
        }
        next();
    });
});
mongoose.model('CapitalAccount', CapS);

// Administrator Schema
var AdminS = new Schema({
    adminId: {type: Number, default: 0, required: true, unique: true},
    username: { type: String, default: 'null' , required: true},
    loginPassword: { type: String, default: 'null', required: true },
    level: {type: Number, default: 0}
});
mongoose.model('Administrator', AdminS);

// Stock Schema
var StkS = new Schema({
    tickerSymbol: { type: Number, default: 0, required: true, unique: true},
    name: { type: String, default: 'null', required: true },
    launchDate: {type: Date, default: Date.now}
});
mongoose.model('Stock', StkS);

// HoldingStock Schema
var HoStkS = new Schema({
    saID: [{
        type: Schema.Types.ObjectId,
        ref: 'SecS'
    }],
    tickerSymbol: [{
        type: Schema.Types.ObjectId,
        ref: 'StkS'
    }],
    amount: {type: Number, default: 0, required: true},
    price: {type: Number, default: 0, required: true}
});
mongoose.model('HoldingStock', HoStkS);

// Announcement Schema
var AnnS = new Schema({
    tickerSymbol: [{
        type: Schema.Types.ObjectId,
        ref: 'StkS'
    }],
    time: { type: Date, default: Date.now()},
    title: { type: String, default: 'null'},
    content: {type: String, default: 'null'}
});
mongoose.model('Announcement', AnnS);

// DailyStock Schema
var DailyS = new Schema({
    tickerSymbol: [{
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    }],
    limit:{ type: Number, default: 0},
    state:{ type: Number, default: 0},
    date: { type: Number, default: 0},
    priceDataFileId:{ type: Number, default: 0},
    currentPrice:{ type: Number, default: 0},
    openingPrice:{ type: Number, default: 0},
    closingPrice:{ type: Number, default: 0},
    highestPrice:{ type: Number, default: 0},
    lowestPrice:{ type: Number, default: 0}
});
mongoose.model('DailyStock', DailyS);

// Instruction Schema
var BuyInstS = new Schema({
    tickerSymbol: [{
        type: Schema.Types.ObjectId,
        ref: 'StkS'
    }],
    caId:[{
       type: Schema.Types.ObjectId,
        ref: 'CapS'
    }],
    saID: [{
        type: Schema.Types.ObjectId,
        ref: 'SecS'
    }],
    time: { type: Date, default: Date.now()},
    amount: { type: Number, default: 0},
    price: { type: Number, default:0},
    type:{type:Number,default:0},
    leftAmount: { type: Number, default:0},
    state: { type: Number, default:-1}                    //1 successfully trade 0 partly trade -1 unsuccessfully trade
});
mongoose.model('BuyInstruction', BuyInstS);

var SellInstS = new Schema({
    tickerSymbol: [{
        type: Schema.Types.ObjectId,
        ref: 'StkS'
    }],
    caId:[{
        type: Schema.Types.ObjectId,
        ref: 'CapS'
    }],
    saID: [{
        type: Schema.Types.ObjectId,
        ref: 'SecS'
    }],
    time: { type: Date, default: Date.now()},
    amount: { type: Number, default: 0},
    type:{type:Number,default:0},
    price: { type: Number, default:0},
    leftAmount: { type: Number, default:0},
    state: { type: Number, default:-1}                     //1 successfully trade 0 partly trade -1 unsuccessfully trade
});
mongoose.model('SellInstruction', SellInstS);

// Transaction Schema
var tranS = new Schema({
    buyInsId: [{
        type: Schema.Types.ObjectId,
        ref: 'InstS'
    }],
    sellInsId: [{
        type: Schema.Types.ObjectId,
        ref: 'InstS'
    }],
    tId:{ type: Number, default:0},
    user_amount:{ type: Number, default:0},
    price: { type: Number, default:0},
    amount: { type: Number, default:0}
});
mongoose.model('Transaction', tranS);

mongoose.connect('mongodb://localhost/supergoodstock');