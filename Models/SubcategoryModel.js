const mongoose = require('mongoose');

const SubcategorySchema = mongoose.Schema({
    createdAt : {type : Date, default : Date.now()},
    category : {type : mongoose.Types.ObjectId, ref: "Categories"},
    name : {type : String, default : "", minLength : 3, maxLength : 255, lowercase : true},
    image : {type : String, default : ""},
    active : {type : Boolean, default : true},
    removed : {type : Boolean, default : false},
});

const Subcategories = mongoose.model("Subcategories", SubcategorySchema);
module.exports = Subcategories;