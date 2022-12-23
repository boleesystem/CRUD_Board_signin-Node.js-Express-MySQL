const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const Comment = require("../models/comment.js");
const auth_middleware = require("../middlewares/auth-middleware.js");
const app = express();
app.use(cookieParser());

// 댓글 작성
router.post('/comments/:_postId', auth_middleware, async (req, res) => {
  const { _postId } = req.params;
  const { user, password, content } = req.body;

  if (!user || !password) {
    return res.status(400).json({
      success: false,
      message: '데이터 형식이 올바르지 않습니다.'
    });
  }
  if (!content) {
    return res.status(400).json({
      success: false,
      message: '댓글 내용을 입력해주세요.'
    });
  }
  await Comment.create([{ _postId, user, password, content }]);
  res.status(201).json({ message: '댓글을 생성하였습니다.' });
  }
);

// 댓글 상세 조회
router.get('/comments/:_commentId', async (req, res) => {
  try {
    const { _commentId } = req.params;
    const [data] = await Comment.find({ _id: _commentId });
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

// 댓글 수정
router.put('/comments/:_commentId', auth_middleware, async (req, res) => {
  const { _commentId } = req.params;
  const { password, content } = req.body;

  const updateComment = await Comment.find({ _id: _commentId });
  const pwd = updateComment[0].password;
  if (pwd === password) {
    await Comment.updateOne({ _id: _commentId }, { $set: { content } });
    return res.status(200).json({ message: '댓글을 수정하였습니다.' });
  } else {
    return res.status(400).json({ 
      success: false,
      message: "비밀번호가 틀렸습니다." });
  }
});

// 댓글 삭제
router.delete('/comments/:_commentId', auth_middleware, async (req, res) => {
  const { _commentId } = req.params;
  const { password } = req.body;
  const deleteComment = await Comment.find({ _id: _commentId });
  const pwd = deleteComment[0].password;

  if (password === pwd) {
    await Comment.deleteOne({ _id: _commentId });
    res.status(200).json({message: '댓글을 삭제하였습니다.'});
  } else {
    return res.status(400).json(
      { success: false,
        message: "비밀번호가 틀렸습니다." });
  }
    });

module.exports = router;