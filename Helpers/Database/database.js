var mongoose = require("mongoose");

mongoose.connect(
  // "mongodb://127.0.0.1:51064/bluelbis",
  "mongodb://localhost:27017/bluelbis",
  { useNewUrlParser: false, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("Database connected successfully.");
    else
      console.log(
        "Error while connecting database : " + JSON.stringify(err.message)
      );
  }
);
