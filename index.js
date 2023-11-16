const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cors = require("cors");

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

// const sendVerificationEmail = (email, token) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465, // hoặc 587
//     secure: true, // true cho SSL, false cho STARTTLS
//     auth: {
//       user: "tuttdenyt@gmail.com", // Địa chỉ email nguồn
//       pass: "Cuong123", // Mật khẩu email nguồn hoặc App Password
//     },
//   });

//   const mailOptions = {
//     from: "tuttdenyt@gmail.com", // Địa chỉ email gửi đi
//     to: email, // Địa chỉ email nhận
//     subject: "Xác minh tài khoản",
//     html: `<p>Nhấn vào <a href="http://localhost:3000/verify/${token}">đây</a> để xác minh tài khoản.</p>`,
//   };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Email xác minh đã được gửi: " + info.response);
//     }
//   });
// };

app.post("/register", async (req, res) => {
  try {
    //const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // const token = jwt.sign({ email: req.body.email }, "secret", {
    //   expiresIn: "1d",
    // }); // Tạo token xác minh email
    const newUser = new User({
      email: req.body.email,
      password: req.body.password, //hashedPassword,
    });
    await newUser.save();
    //sendVerificationEmail(req.body.email, token); // Gửi email xác minh
    res.send("Đăng ký thành công!");
  } catch {
    res.status(500).send("Lỗi khi đăng ký người dùng!");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (user) {
    //const match = password === user.password;
    if (password === user.password) {
      res.send("Đăng nhập thành công!");
    } else {
      res.send("Sai email hoặc mật khẩu!");
    }
  } else {
    res.send("không có user!");
  }
});

// Xác minh từ email
// app.get("/verify/:token", async (req, res) => {
//   const token = req.params.token;
//   try {
//     const decoded = jwt.verify(token, "secret");
//     const userEmail = decoded.email;

//     const user = await User.findOne({ email: userEmail });
//     if (user) {
//       user.isVerified = true; // Cập nhật trạng thái xác minh email
//       await user.save();
//       res.send("Tài khoản của bạn đã được xác minh thành công!");
//     } else {
//       res.send("Không tìm thấy người dùng!");
//     }
//   } catch {
//     res.send("Lỗi xác minh tài khoản!");
//   }
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
