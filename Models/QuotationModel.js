const mongoose = require('mongoose');

const QuotationDataSchema = mongoose.Schema({
    _id : false,
    createdAt : {type : Date, default : Date.now()},
    description : {type : String, default : ""},
    qty : {type : Number, default : 0},
    unitprice : {type : Number, default : 0},
    amount : {type : Number, default : 0},
});

const QuotationSchema = mongoose.Schema({
    createdAt : {type : Date, default : Date.now()},
    task : {type : mongoose.Types.ObjectId, ref: "Tasks"},
    byBusiness : {type : mongoose.Types.ObjectId, ref: "Businesses"},
    subtotal : {type : Number, default : 0},
    discount : {type : Number, default : 0},
    taxes : {type : Number, default : 0},
    total : {type : Number, default : 0},
    timeDuration : {type : String, default : ""},
    notes : {type : String, default : ""},
    quoteItems : [QuotationDataSchema],
    active   : {type : Boolean, default : true},
    removed : {type : Boolean, default : false},
});

const Quotations = mongoose.model("Quotations", QuotationSchema);
module.exports = Quotations;