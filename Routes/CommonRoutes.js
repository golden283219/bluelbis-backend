const express = require("express");
const auth = require("../Controllers/AuthController");
const userController = require("../Controllers/UserController");
const validator = require("../Helpers/Validations/Validator");
const {
  imageUpload,
  checkAndUploadImage,
} = require("../Helpers/FileUploader/fileuploader");
var router = express.Router();

router.post(
  "/register",
  validator.emailValidator,
  validator.mobileValidator,
  validator.emailUserValidator,
  validator.mobileUserValidator,
  validator.reqStringValidator("firstname", 3),
  validator.reqPassword("password", 8),
  validator.reqStringValidator("role"),
  validator.reqBoolean("offersAccepted"),
  validator.reqStringValidator("emailVerificationLink", 3),
  auth.resgister
);

router.post(
  "/login",
  validator.reqStringValidator("userid", 3),
  validator.reqPassword("password", 8),
  auth.login
);

router.post("/verifyAuth", auth.verifyAuth, auth.verifyAuthToken);

router.post(
  "/forgetPassword",
  validator.reqStringValidator("email", 3),
  validator.reqStringValidator("resetLink", 3),
  auth.forgetPassword
);

router.post(
  "/resetPassword",
  validator.reqStringValidator("token", 35),
  validator.reqPassword("password", 8),
  auth.resetPassword
);

router.post(
  "/changePassword",
  auth.verifyAuth,
  validator.reqPassword("oldpassword", 8),
  validator.reqPassword("newpassword", 8),
  auth.changePassword
);

router.post(
  "/getUserInfo",
  auth.verifyAuth,
  validator.reqStringValidator("email"),
  auth.getUserInfo
);

router.post(
  "/getCustomerInfo",
  auth.verifyAuth,
  userController.getCustomerInfo
);

router.post(
  "/getProviderInfo",
  auth.verifyAuth,
  userController.getProviderInfo
);

router.post("/getUserInfo", auth.verifyAuth, userController.getUserInfo);

router.post(
  "/verifyOTP",
  validator.reqStringValidator("mobile", 10),
  validator.reqStringValidator("otp", 4),
  auth.verifyOTP
);

router.post(
  "/resendOTP",
  validator.reqStringValidator("mobile", 10),
  auth.resendOTP
);

router.post(
  "/verifyEmail",
  validator.reqStringValidator("token", 35),
  auth.verifyEmail
);

router.post(
  "/updateProfilePhoto",
  auth.verifyAuth,
  [imageUpload.single("image")],
  auth.updateProfilePhoto
);
router.post(
  "/updateUserProfile",
  auth.verifyAuth,
  validator.reqStringValidator("firstname", 3),
  validator.reqStringValidator("lastname", 3),
  validator.reqBoolean("offersAccepted"),
  validator.reqDate("dob"),
  userController.updateUserProfile
);

module.exports = router;
