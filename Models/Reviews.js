const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    createdAt : {type : Date, default : Date.now()},
    reviewTo : {type : mongoose.Types.ObjectId, ref: "Businesses"},
    reviewBy : {type : mongoose.Types.ObjectId, ref: "Users"},
    rating : {type : Number, default : 1},
    review : {type : String, default : ""},
    replyDate : {type : Date, default : Date.now()},
    reply : {type : String, default : ""},
    likeCounts : {type : Number, default : 0},
    active : {type : Boolean, default : true},
    removed : {type : Boolean, default : false},
});

const Reviews = mongoose.model("Reviews", ReviewSchema);
module.exports = Reviews;