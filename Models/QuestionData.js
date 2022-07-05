const mongoose = require('mongoose');

const QuestionDataSchema = mongoose.Schema({
    createdAt : {type : Date, default : Date.now()},
    question : {type : mongoose.Types.ObjectId, ref: "Questions"},
    data : {type : String, default : "", minLength : 3, maxLength : 255, lowercase : true},
    active : {type : Boolean, default : true},
    removed : {type : Boolean, default : false},
});

const QuestionsData = mongoose.model("QuestionsData", QuestionDataSchema);
module.exports = QuestionsData;