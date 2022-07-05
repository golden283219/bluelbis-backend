const mongoose = require("mongoose");

const TestSchema = mongoose.Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  fullname: { type: String },
});

class PersonClass {
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(v) {
    const firstSpace = v.indexOf(" ");
    this.firstName = v.split(" ")[0];
    this.lastName = firstSpace === -1 ? "" : v.substr(firstSpace + 1);
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  static async findByFullName (name) {
    const firstSpace = name.indexOf(" ");
    const firstName = name.split(" ")[0];
    const lastName = firstSpace === -1 ? "" : name.substr(firstSpace + 1);
    return await this.findOne({ firstName, lastName });
  }
}

TestSchema.pre("save", function (next) {
  this.fullname = this.firstName + " " + this.lastName;
  next();
});

TestSchema.loadClass(PersonClass);
const Person = mongoose.model("Person", TestSchema);
module.exports = Person;


// How to use
// ---------------------------------------


// app.get("/person", testFun);

// const testFindFun = async (req, res) => {
//   const data = await Person.findByFullName("Ajay Dhangar");
//   res.send(data);
// };

// app.get("/findperson", testFindFun);

// function testFun(req, res, next) {
//   var person = Person({
//     firstName: "Ajay",
//     lastName: "Dhangar",
//   });
//   person.save(function (err, data) {
//     if (err) {
//       console.log(err);
//       next();
//     } else {
//       console.log(data.getFullName());
//       next();
//     }
//   });
// }
