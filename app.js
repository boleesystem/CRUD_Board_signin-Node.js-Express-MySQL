const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const userRouters = require('./models/user');
const postRouters = require('./models/post');
const commentRouters = require('./models/comment');
app.use("/", [userRouters, postRouters, commentRouters])

const port = 4000;
app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸습니다.");
});