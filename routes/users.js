const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const app = express();
app.use(cookieParser());
const SECRET_KEY = `boleesystem`;

// 회원가입
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  const existsUsers = await User.findOne({
    $or: [{ nickname }],
  });
  if (existsUsers) {
    res.status(400).send({
      errorMessage: "닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const checkNickname = /^[a-zA-Z0-9]{3,}$/g;
  if (!checkNickname.test(nickname)) {
    return res
      .status(412)
      .json({ errorMessage: '닉네임 형식이 올바르지 않습니다.' });
  }

  const checkPassword = /^.{4,}$/;
  if (!checkPassword.test(password) || password === nickname) {
    return res
      .status(412)
      .json({ errorMessage: '패스워드 형식이 올바르지 않습니다.' });
  }

  const user = new User({ nickname, password });
  await user.save();

  res.status(201).send({});
});

// 로그인
router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await User.findOne({ nickname });

  if (!user || password !== user.password) {
    res.status(400).send({
      errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
    });
    return;
  }

  res.send({
    token: jwt.sign({ userId: user.userId }, SECRET_KEY),
  });
});

module.exports = router;