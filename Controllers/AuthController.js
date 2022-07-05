const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult, check } = require("express-validator");
var userModel = require("../Models/UserModel");
const Response = require("../Helpers/Response");
const Global = require("../Helpers/Global");
const {
  mobileVerificationTemplate,
} = require("../Helpers/Templates/MobileVerificationTemp");
const { emailVerificationTemplate } = require("../Helpers/Templates/EmailTemp");
const {
  resetPasswordEmailTemplate,
} = require("../Helpers/Templates/ResetPasswordLink");
const { MobileOTPMessage } = require("../Helpers/Templates/MobileOTPTemp");
var objectID = mongoose.Types.ObjectId;
const api_secret =
  "eyJhbGciOi_JIUzI1NiIs.DkwIiwibm_FtZSI6Ikpva_G4gRG9lIi_wiaWF0";

const generateToken = ({
  payload: payload,
  secret: secret,
  expiry: expiry = "2 days",
}) => {
  var token = "";
  const jwtPayload = JSON.parse(payload);
  const jwtConfig = { expiresIn: expiry };
  token = jwt.sign(jwtPayload, secret, jwtConfig);
  return token;
};

const verifyToken = (req, res, token) => {
  var result = false;
  if (token) {
    jwt.verify(token, api_secret, (err, user) => {
      if (err)
        return Response.unauthorizedResponse(
          res,
          "User not authorized to access (invalid token)."
        );
      req.user = user;
      result = true;
    });
  }
  return result;
};

const getUserFromToken = (res, token) => {
  var result = null;
  if (token) {
    jwt.verify(token, api_secret, (err, user) => {
      if (err)
        return Response.unauthorizedResponse(
          res,
          "User not authorized to access (invalid token)."
        );
      result = user;
    });
  }
  return result;
};

const verifyAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return Response.unauthorize(res, "User not authorized to access.");
  if (token) {
    jwt.verify(token, api_secret, (err, user) => {
      if (err)
        return Response.unauthorize(
          res,
          "User not authorized to access (invalid token)."
        );
      req.user = user;
      next();
    });
  }
};

const encryptPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    bcrypt.hash(password, 10, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const checkPassword = (password, hashPassword) => {
  return new Promise(async (resolve, reject) => {
    bcrypt.compare(
      password.toString(),
      hashPassword.toString(),
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};

const resgister = async (req, res) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  req.body.password = await encryptPassword(req.body.password);
  var otp = Global.randomNumber(4);
  req.body.otp = otp;
  var user = new userModel(req.body);
  user.save((err) => {
    var token = generateToken({
      payload: JSON.stringify(user),
      secret: api_secret,
    });
    user.token = token;
    if (err) return Response.error(res, err, null);
    Global.sendMessage(
      req.body.mobile,
      MobileOTPMessage(user.firstname + " " + user.lastname, otp)
    );
    Global.sendEmail(
      user.email,
      "Verification link for verify your email address.",
      emailVerificationTemplate(
        req.body.emailVerificationLink + "verification/email/" + token
      )
    );
    Global.sendEmail(
      user.email,
      "OTP to verify your mobile number.",
      mobileVerificationTemplate(otp)
    );
    return Response.ok(
      res,
      "Registered successfully. You have to verify your email.",
      {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        token: user.token,
      }
    );
  });
};

const login = async (req, res) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var userData = await userModel.findForLogin(req.body.userid);
  if (userData) {
    var isPasswordMatched = await checkPassword(
      req.body.password,
      userData.password
    );
    if (isPasswordMatched) {
      userData = Global.convertObject(userData);
      _us2 = Global.select(userData, [
        "_id",
        "firstname",
        "lastname",
        "mobile",
        "email",
        "profileImage",
        "role",
      ]);
      _us2.token = generateToken({
        payload: JSON.stringify(userData),
        secret: api_secret,
      });

      if (!userData.emailVerified) {
        return Response.error(res, "Please verify your email id.");
      } else if (!userData.mobileVerified) {
        // return Response.error(res, "Please verify your mobile number.", {
        //   mobile: userData.mobile,
        // });
        return Response.ok(res, "logged in successfully.", _us2);
      } else {
        return Response.ok(res, "logged in successfully.", _us2);
      }
    } else {
      return Response.error(res, "Password is not matched.");
    }
  } else {
    return Response.error(res, "Userid is not found.");
  }
};

const forgetPassword = async (req, res) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var user = await userModel.findByEmail(req.body.email);
  if (user) {
    const userData = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
    };
    var token = generateToken({
      payload: JSON.stringify(userData),
      secret: api_secret,
    });
    Global.sendEmail(
      req.body.email,
      "Reset your password.",
      resetPasswordEmailTemplate(req.body.resetLink + "reset-password/" + token)
    );
    Response.ok(
      res,
      "Password reset link is sent to your registered email address."
    );
  } else {
    return Response.error(res, "User is not found.");
  }
};

const resetPassword = async (req, res, next) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var reqToken = req.body.token;
  if (verifyToken(req, res, reqToken)) {
    var password = await encryptPassword(req.body.password);
    var updateLog = await userModel.updatePassword(req.user.email, password);
    if (updateLog === "true") {
      Response.ok(res, "Password successfully changed.");
    } else {
      Response.error(res, updateLog);
    }
  }
};

const getUserInfo = async (req, res, next) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var userData = await userModel.findByEmail(req.user.email);
  userData = Global.convertObject(userData);
  var userDataFinal = Global.omit(userData, [
    "password",
    "otp",
    "token",
    "active",
    "createdAt",
    "mobileVerified",
    "emailVerified",
    "adminVerified",
  ]);
  if (userData)
    return Response.ok(res, "Data retrived successfully.", userDataFinal);
};

const verifyOTP = async (req, res) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var isExists = await userModel.isMobileExists(req.body.mobile);
  if (!isExists) return Response.error(res, "Mobile number is not exists.");
  var userData = await userModel.findByMobile(req.body.mobile);
  if (userData.otp.toString() === req.body.otp.toString()) {
    userModel.findOneAndUpdate(
      { mobile: req.body.mobile },
      { $set: { mobileVerified: true } },
      { new: true, useFindAndModify: true },
      (err, doc) => {
        if (!err) {
          return Response.ok(res, "OTP verified successfully");
        } else {
          return Response.error(res, "OTP verification failed.");
        }
      }
    );
  } else {
    Response.error(res, "OTP not matched.");
  }
};

const resendOTP = async (req, res) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var isExists = await userModel.isMobileExists(req.body.mobile);
  if (!isExists) return Response.error(res, "Mobile number is not exists.");
  var otp = Global.randomNumber(4);
  var userData = await userModel.findByMobile(req.body.mobile);
  var updateLog = await userModel.updateOTP(req.body.mobile, otp);
  if (updateLog === "true") {
    Global.sendMessage(
      req.body.mobile,
      MobileOTPMessage(userData.firstname + " " + userData.lastname, otp)
    );
    Global.sendEmail(
      userData.email,
      "OTP to verify your mobile number.",
      mobileVerificationTemplate(otp)
    );
    Response.ok(res, "OTP resent successfully.");
  } else {
    Response.error(res, updateLog);
  }
};

const verifyEmail = async (req, res) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var token = req.body.token;
  var user = getUserFromToken(res, token);

  var isExists = await userModel.isEmailExists(user.email);
  if (!isExists) return Response.error(res, "User is not exists.");
  var userData = await userModel.findByEmail(user.email);
  if (userData) {
    userModel.findOneAndUpdate(
      { email: user.email },
      { $set: { emailVerified: true } },
      { new: true, useFindAndModify: true },
      (err, doc) => {
        if (!err) {
          return Response.ok(res, "Email verified successfully");
        } else {
          return Response.error(res, "Email verification failed.");
        }
      }
    );
  } else {
    return Response.error(res, "Email verification failed.");
  }
};

const verifyAuthToken = async (req, res) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  if (req.user) {
    Response.ok(res, "Auth successfully matched.", { auth: true });
  } else {
    Response.error(res, "Auth match failed.", { auth: false });
  }
};

const changePassword = async (req, res) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }

  if (req.user) {
    var userData = await userModel.findByEmail(req.user.email);
    var oldpassword = false;
    oldpassword = await checkPassword(req.body.oldpassword, userData.password);
    if (oldpassword) {
      var password = await encryptPassword(req.body.newpassword);
      var updateLog = await userModel.updatePassword(req.user.email, password);
      if (updateLog === "true") {
        return Response.ok(res, "Password successfully changed.");
      } else {
        return Response.error(res, updateLog);
      }
    } else {
      return Response.error(res, "Old password is not matched.");
    }
  } else {
    return Response.unauthorize(res, "Unauthorized access.");
  }
};

const updateProfilePhoto = async (req, res) => {
  if (req.file) {
    var result = validationResult(req);
    if (!result.isEmpty()) {
      fs.unlink(path.resolve(req.file.path), (err) => {});
      return Response.error(res, result.array()[0].msg);
    }
    try {
      if (req.user) {
        var isExists = await userModel.findByEmail(req.user.email);
        if (isExists) {
          var updatedData = await userModel
            .findByIdAndUpdate(
              req.user._id,
              { profileImage: req.file ? req.file.path : "" },
              { new: true, useFindAndModify: true }
            )
            .exec();
          if (updatedData) {
            Response.ok(res, "Profile image updated successfully.");
          } else {
            Response.error(res, "Error in updating user profile.");
          }
        } else {
          Response.error(res, "User not found.");
        }
      } else {
        Response.error(res, "User not authorize to access.");
      }
    } catch (error) {
      Response.error(res, "Error", error);
    }
  } else {
    Response.error(res, "Please add profile image.");
  }
};

module.exports = {
  resgister,
  login,
  forgetPassword,
  resetPassword,
  getUserInfo,
  checkPassword,
  encryptPassword,
  generateToken,
  verifyAuth,
  verifyOTP,
  resendOTP,
  verifyEmail,
  verifyAuthToken,
  changePassword,
  updateProfilePhoto,
};
