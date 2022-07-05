const express = require("express");
const auth = require("../Controllers/AuthController");
const categoryController = require("../Controllers/CategoryController");
const validator = require("../Helpers/Validations/Validator");
const {
    imageUpload,
    checkAndUploadImage,
  } = require("../Helpers/FileUploader/fileuploader");
var router = express.Router();

router.get("/all", categoryController.getall);
router.get("/list", categoryController.getNameList);
router.put(
  "/edit:id",
  [imageUpload.single("image"), validator.reqStringValidator("name")],
  categoryController.getNameList
);
router.get("/:id", categoryController.getInfo);

module.exports = router;
