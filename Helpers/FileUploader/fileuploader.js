const multer = require("multer");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const Global = require("../Global");
const Response = require("../Response");

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "./uploads/images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "x" +
        Global.randomNumber(6) +
        "c" +
        Date.now() +
        path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const videoStorage = multer.diskStorage({
  // Destination to store image
  destination: "./uploads/videos",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "x" +
        Global.randomNumber(6) +
        "c" +
        Date.now() +
        path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const pdfStorage = multer.diskStorage({
  // Destination to store image
  destination: "./uploads/files",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "x" +
        Global.randomNumber(6) +
        "c" +
        Date.now() +
        path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

var imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      return cb(new Error("Please upload a video"));
    }
    cb(undefined, true);
  },
});

// const pdfFilter = (req, file, cb) => {
//   if (file.mimetype.split("/")[1] === "pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Not a PDF File!!"), false);
//   }
// };

const pdfUpload = multer({
  storage: pdfStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error("Please upload a pdf file."));
    }
    cb(undefined, true);
  },
});

// --------------------------------------
const _uploadDir_image = "uploads/images/";
const _uploadDir_videos = "uploads/videos/";
const _uploadDir_files = "uploads/files/";
const checkAndUploadImage = (req, res, next, fieldInfo, fieldsToCheck = []) => {

  console.log(req.body)
  const form = new formidable.IncomingForm({ multiples: true });
  form.parse(req, function (err, fields, files) {
    console.log("Files : ", files[fieldInfo.name].length);

    var _next = true;
    if (fieldsToCheck.length > 0) {
      fieldsToCheck.forEach((element) => {
        let _minLength = element.minLength ? element.minLength : 3;
        // check validations
        if (!fields[element.name] || fields[element.name] === "") {
          _next = false;
          return Response.error(res, element.name + " is required");
        }
        if (fields[element.name] && fields[element.name].length < _minLength) {
          console.log(fields[element.name].length);
          _next = false;
          return Response.error(
            res,
            element.name +
              " minimum length should be " +
              _minLength +
              " character long."
          );
        }
        // end of check validations
      });
    }
    if (_next) {
      if (files[fieldInfo.name].length > 0) {
        let _uploadedPaths = [];
        let uploadDone = false;
        files[fieldInfo.name].forEach((fileElement, index) => {
          if (index < fieldInfo.maxCount) {
            if (isFileValid(fileElement)) {
              var oldPath = fileElement.filepath;
              var newPath = _uploadDir_image + getFileName(fileElement);
              fs.readFile(oldPath, (err, data) => {
                if (err) return Response.error(res, err);
                fs.writeFile(newPath, data, function (err) {
                  if (err) return Response.error(res, err);
                  _uploadedPaths.push(newPath);
                  if (
                    index === fieldInfo.maxCount - 1 ||
                    index === files[fieldInfo.name].length - 1
                  ) {
                    uploadDone = true;
                  }
                  if (uploadDone && _uploadedPaths.length > 0) {
                    if (fieldInfo.maxCount === 1) {
                      req.body = fields;
                      req.uploadedPath = _uploadedPaths[0];
                    } else {
                      req.body = fields;
                      req.uploadedPath = _uploadedPaths;
                    }
                    next();
                    return true;
                  } else {
                    next();
                    return true;
                  }
                });
              });
            }else{
              Response.error(res, "Please upload image file.");
            }
          } else {
          }
        });
      }
    }
  });
};

const isFileValid = (file) => {
  if (!file.originalFilename.match(/\.(png|jpg|jpeg)$/)) {
    return false;
  }
  return true;
};

const getFileName = (file) => {
  return (
    "image_" +
    Global.randomNumber(6) +
    Date.now() +
    path.extname(file.originalFilename)
  );
};
// --------------------------------------

module.exports = {
  imageUpload,
  videoUpload,
  pdfUpload,
  checkAndUploadImage,
};
