const express = require("express");
const { check } = require("express-validator");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const auth = require("../Controllers/AuthController");
const categoryController = require("../Controllers/CategoryController");
const {
  imageUpload,
  checkAndUploadImage,
} = require("../Helpers/FileUploader/fileuploader");
const Global = require("../Helpers/Global");
const Response = require("../Helpers/Response");
const upload = imageUpload.fields([{ name: "image", maxCount: 1 }]);
const validator = require("../Helpers/Validations/Validator");
var router = express.Router();

router.post(
  "/category/insert",
  [imageUpload.single("image"), validator.reqStringValidator("name")],
  categoryController.insert
);

router.put("/category/remove/:id", categoryController.remove);


module.exports = router;
