const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cors = require("cors");
// hello bà con
const app = express();
const port = 3000;
app.use(cors());
// connect database shopee fake
mongoose.connect(
  "mongodb+srv://duongtank:1@cluster0.sbyqazo.mongodb.net/shopeeFake?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  try {
    const userFound = await User.findOne({ email: req.body.email });

    if (userFound) {
      res.status(500).send("email da ton tai!");
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password, //hashedPassword,
      });

      await newUser.save();

      res.send("Đăng ký thành công!");
    }
  } catch {
    res.status(500).send("Lỗi khi đăng ký người dùng!");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (user) {
    if (password === user.password) {
      res.send("Đăng nhập thành công!");
    } else {
      res.send("Sai email hoặc mật khẩu!");
    }
  } else {
    res.send("không có user!");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
