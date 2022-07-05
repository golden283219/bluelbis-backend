const mongoose = require('mongoose');

const FAQSchema = mongoose.Schema({
    createdAt : {type : Date, default : Date.now()},
    title : {type : String, default : "", required : true},
    info : {type : String, default : "", required : true},
    image : {type : String, default : ""},
    active   : {type : Boolean, default : true},
    removed : {type : Boolean, default : false},
});

const FAQs = mongoose.model("FAQs", FAQSchema);
module.exports = FAQs;