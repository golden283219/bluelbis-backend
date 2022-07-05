const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  createdAt: { type: Date, default: Date.now() },
  firstname: {
    type: String,
    default: "",
    minLength: 3,
    maxLength: 255,
  },
  lastname: { type: String, default: "" },
  mobile: {
    type: String,
    minLength: 10,
    maxLength: 15,
    required: true,
    unique: true,
  },
  mobileVerified: { type: Boolean, default: false },
  email: { type: String, lowercase: true, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  gender: { type: String, default: "" },
  dob: { type: Date, default: Date.now() },
  offersAccepted: { type: Boolean, default: true },
  address: { type: String, default: "" },
  addressLine2: { type: String, default: "" },
  latitude: { type: String, default: "" },
  longitude: { type: String, default: "" },
  country: { type: String, default: "" },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  pin: { type: String, default: "" },
  password: { type: String, default: "" },
  passwordLastChange: { type: Date, default: Date.now() },
  creditCardNo: { type: String, default: "" },
  creditCardCvv: { type: String, default: "" },
  creditCardExpiry: { type: String, default: "" },
  referralCode: { type: String, default: "" },
  otp: { type: String, default: "" },
  token: { type: String, default: "" },
  role: { type: String, default: "Customer", enum: ["Customer", "Provider"] },
  profileImage: { type: String, default: "" },
  active: { type: Boolean, default: true },
  adminVerified: { type: Boolean, default: true },
  favouriteProviders: [{ type: mongoose.Types.ObjectId, ref: "Businesses" }],
  activePlan: { type: mongoose.Types.ObjectId, ref: "Plans" },
});

class UserClass {
  static async isEmailExists(email) {
    var result = false;
    const data = await this.findOne({ email: email }).exec();
    if (data) result = true;
    return result;
  }
  static async isMobileExists(mobile) {
    var result = false;
    const data = await this.findOne({ mobile: mobile }).exec();
    if (data) result = true;
    return result;
  }
  static async findForLogin(userid) {
    var result = null;
    const data = await this.findOne({
      $or: [{ email: userid }, { mobile: userid }],
    }).exec();
    if (data) result = data;
    return result;
  }

  static async findByEmail(email) {
    var result = null;
    const data = await this.findOne({ email: email }).exec();
    if (data) result = data;
    return result;
  }

  static async findByMobile(mobile) {
    var result = null;
    const data = await this.findOne({ mobile: mobile }).exec();
    if (data) result = data;
    return result;
  }

  static async updatePassword(email, password) {
    return new Promise(async (resolve, reject) => {
      var isExists = await this.isEmailExists(email);
      if (isExists) {
        this.findOneAndUpdate(
          { email: email },
          { $set: { password: password, passwordLastChange : Date.now() } },
          { new: true, useFindAndModify: true },
          (err, doc) => {
            if (err) {
              console.log("Something wrong when calling updatePassword!");
              resolve("Something wrong when calling updatePassword!");
            }
            resolve("true");
          }
        );
      } else {
        resolve("User email not found.");
      }
    });
  }

  static async updateOTP(mobile, otp) {
    return new Promise(async (resolve, reject) => {
      var isExists = await this.isMobileExists(mobile);
      if (isExists) {
        this.findOneAndUpdate(
          { mobile: mobile },
          { $set: { otp: otp } },
          { new: true, useFindAndModify: true },
          (err, doc) => {
            if (err) {
              console.log("Something wrong when calling updateOTP!");
              resolve("Something wrong when calling updateOTP!");
            }
            resolve("true");
          }
        );
      } else {
        resolve("User mobile not found.");
      }
    });
  }

}

UserSchema.loadClass(UserClass);
const Users = mongoose.model("Users", UserSchema);
module.exports = Users;
