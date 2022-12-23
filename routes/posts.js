const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const Post = require("../models/post.js");
const auth_middleware = require("../middlewares/auth-middleware.js");
const app = express();
app.use(cookieParser());

// 게시글 작성
router.post('/posts', auth_middleware, async (req, res) => {
  const { user, password, title, content } = req.body;
  const user_id = req.decoded.userId;
  if (!user || !password || !title || !content) {
    return res.status(400).json({
      success: false,
      message: '데이터 형식이 올바르지 않습니다.'
    });
  }
  await Post.create([{ user, password, title, content }]);
  res.status(201).json({ message: '게시글을 생성하였습니다.' });
  }
);

// 게시글 조회
router.get("/posts", async (req, res) => {
  const result = await Post.find();
  res.json(result);
});

// 게시글 상세 조회
router.get('/posts/:_postId', async (req, res) => {
  try {
    const { _postId } = req.params;
    const [data] = await Post.find({ _id: _postId });
    res.status(200).json({ data });
  } catch (err) {
    if (!req.params || !req.body) {
      res.status(400).json({
        success: false,
        message: '데이터 형식이 올바르지 않습니다.'
      });
      return;
    }
  }
});

// 게시글 수정
router.put('/posts/:_postId', authMiddleWare, async (req, res) => {
  const { _postId } = req.params;
  const { password, title, content } = req.body;

  const updatePost = await Post.find({ _id: _postId });
  const pwd = updatePost[0].password;
  if (pwd === password) {
    await Post.updateOne({ _id: _postId }, { $set: { title, content } });
    return res.status(200).json({ message: '게시글을 수정하였습니다.' });
  } else {
    return res.status(400).json({ 
      success: false,
      message: "비밀번호가 틀렸습니다." });
  }
});

// 게시글 삭제
router.delete('/posts/:_postId', authMiddleWare, async (req, res) => {
  const { _postId } = req.params;
  const { password } = req.body;
  const deletePost = await Post.find({ _id: _postId });
  const pwd = deletePost[0].password;

  if (password === pwd) {
    await Post.deleteOne({ _id: _postId });
    res.status(200).json({message: '게시글을 삭제하였습니다.'});
  } else {
    return res.status(400).json(
      { success: false,
        message: "비밀번호가 틀렸습니다." });
  }
    });

module.exports = router;