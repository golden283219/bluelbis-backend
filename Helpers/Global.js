const nodemailer = require("nodemailer");

module.exports = class Global {
  static randomNumber(length = 4) {
    var text = "";
    var possible = "123456789";
    for (var i = 0; i < length; i++) {
      var sup = Math.floor(Math.random() * possible.length);
      text += i > 0 && sup == i ? "0" : possible.charAt(sup);
    }
    return Number(text);
  }

  static sendEmail = async (sendto, subject, message) => {
    try {
      let testAccount = await nodemailer.createTestAccount();
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "help.bluelbis@gmail.com",
          pass: "Admin@012458",
        },
      });

      let info = await transporter.sendMail({
        from: subject,
        to: sendto, // list of receivers
        subject: subject, // Subject line
        html: message, // html body
      });
    } catch (err) {
      console.log(err);
    }
  };

  static sendMessage(mobile, message) {
    var request = require("request");
    request(
      "https://platform.clickatell.com/messages/http/send?apiKey=v1b_3Mx8RDuktD_uaeUK-g==&to=" +
        mobile +
        "&content=" +
        message,
      function (error, response) {
        if (response.statusCode == 202) {
          return true;
        }
      }
    );
  }

  static omit(obj, keys) {
    if (obj && keys.length > 0) {
      keys.forEach((e) => {
        delete obj[e];
      });
    }
    return obj;
  }

  static select(obj, keys) {
    var result = {};
    Object.entries(obj).map(([key, value]) => {
      keys.forEach((e) => {
        if (key === e) {
          if (e === "_id") {
            result["access_token"] = value;
          } else {
            result[key] = value;
          }
        }
      });
    });
    return result;
  }

  static convertObject(data) {
    var result = null;
    var us1 = JSON.stringify(data);
    var us2 = JSON.parse(us1);
    result = us2;
    return result;
  }
};
