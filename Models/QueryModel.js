const mongoose = require('mongoose');

const QuerySchema = mongoose.Schema({
    createdAt : {type : Date, default : Date.now()},
    firstname : {type : String, default : "", required : true, minLength : 3, maxLength : 255},
    lastname : {type : String, default : "", required : true, minLength : 3, maxLength : 255},
    email : {type : String, default : "", required : true},
    subject : {type : String, default : ""},
    message : {type : String, default : ""},
    status : {type : String, default : "unseen", enum : ["unseen", "seen", "replied"]},
    replyDate : {type : Date, default : Date.now()},
    reply : {type :String, default : ""},
    removed : {type : Boolean, default : false},
});

const Queries = mongoose.model("Queries", QuerySchema);
module.exports = Queries;