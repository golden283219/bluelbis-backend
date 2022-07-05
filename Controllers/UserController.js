const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var userModel = require("../Models/UserModel");
const Response = require("../Helpers/Response");
const { validationResult } = require("express-validator");
const Global = require("../Helpers/Global");
var objectID = mongoose.Types.ObjectId;

const getCustomerInfo = async (req, res, next) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var userData = await userModel.findByEmail(req.user.email);
  userData = Global.convertObject(userData);
  if (userData.role === "Customer") {
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
  } else {
    Response.unauthorize(res, "Unauthorized user access.", userDataFinal);
  }
};

const getProviderInfo = async (req, res, next) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var userData = await userModel.findByEmail(req.user.email);
  userData = Global.convertObject(userData);
  if (userData.role === "Provider") {
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
  } else {
    Response.unauthorize(res, "Unauthorized user access.", userDataFinal);
  }
};

const getUserInfo = async (req, res, next) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  var userData = await userModel.findByEmail(req.user.email);
  userData = Global.convertObject(userData);
  if (userData.role === req.user.role) {
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
  } else {
    Response.unauthorize(res, "Unauthorized user access.", userDataFinal);
  }
};

const updateUserProfile = async (req, res, next) => {
  var result = validationResult(req);
  if (!result.isEmpty()) {
    return Response.error(res, result.array()[0].msg);
  }
  if (req.user) {
    var isExists = await userModel.findByEmail(req.user.email);
    if (isExists) {
      var updatedData = await userModel
        .findByIdAndUpdate(
          req.user._id,
          {
            firstname: req.body.firstname || isExists.firstname,
            lastname: req.body.lastname || isExists.lastname,
            dob: req.body.dob || isExists.dob,
            offersAccepted: req.body.offersAccepted,
          },
          { new: true, useFindAndModify: true }
        )
        .exec();
      if (updatedData) {
        Response.ok(res, "Profile updated successfully.");
      } else {
        Response.error(res, "Error in updating user profile.");
      }
    } else {
      Response.error(res, "User not found.");
    }
  } else {
    Response.error(res, "User not authorize to access.");
  }
};

module.exports = {
  getCustomerInfo,
  getProviderInfo,
  getUserInfo,
  updateUserProfile,
};
