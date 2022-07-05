const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    createdAt : {type : Date, default : Date.now()},
    title : {type : String, default : "", minLength : 3, maxLength : 255, lowercase : true},
    type : {type : String, default : "singleselect", enum : ["singleselect", "multiselect", "number", "text"]},
    questionName : {type :String, default : ""},
    isRequired : {type : Boolean, default : true},
    active : {type : Boolean, default : true},
    removed : {type : Boolean, default : false},
});

const Questions = mongoose.model("Questions", QuestionSchema);
module.exports = Questions;