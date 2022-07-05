const mongoose = require('mongoose');

const StatusLogScheme = mongoose.Schema({
    status : {type :String, required : true}, 
    date : { type : Date, default : Date.now()}, 
    reason : {type :String, default : ""}, 
    info : {type : String , default : ""} 
})

const QueAnsSchema = mongoose.Schema({
    _id : false,
    question : {type : mongoose.Types.ObjectId, ref: "Questions"}, 
    answer : [{type : mongoose.Types.ObjectId, ref: "QuestionsData"}], 
    answerText : {type :String, default : ""}
})

const TaskSchema = mongoose.Schema({
    // setp 1
    createdAt : {type : Date, default : Date.now()},
    userId : {type : mongoose.Types.ObjectId, ref: "Users"},
    location : {type : String, default : ""},
    latitude : {type : String, default : ""},
    longitude : {type : String, default : ""},
    category : {type : mongoose.Types.ObjectId, ref: "Categories"},
    title : {type : String, default : "0"},
    subcategory : {type : mongoose.Types.ObjectId, ref: "Subcategories"},
    queans : [QueAnsSchema],
    // setp 2
    description : {type : String, default : ""},
    // step 3
    address : {type : String, default : ""},
    country : {type : String, default : ""},
    state : {type : String, default : ""},
    city : {type : String, default : ""},
    pin : {type : String, default : ""},
    // step4
    budgetNotDefine : {type : Boolean, default : false},
    budget : {type : Number, default : 0},
    // step 5
    fromdate : {type : Date, default : Date.now()},
    todate : {type : Date, default : Date.now()},
    timeslot : {type : String, default : ""},
    // step 6
    images : {type : Array, default : []},
    // other
    maxlimit : {type : Number, default : 5},
    noOfInterestes : {type : Number, default : 0},
    taskType : {type : String, default : "broadcast", enum : ["broadcast", "individual"]},
    taskIndividualFor : {type : mongoose.Types.ObjectId, ref: "Users"},
    status : {type : String, default : "open", enum : ["open", "assigned", "closed", "canceld", "completed", "incomplete", "declined", "purchased"]},
    statusLog : [StatusLogScheme],
    adminVerified : {type : Boolean, default : false},
    assignTo : {type : mongoose.Types.ObjectId, ref: "Users"},
    removed : {type : Boolean, default : false},
    
});

const Tasks = mongoose.model("Tasks", TaskSchema);
module.exports = Tasks;