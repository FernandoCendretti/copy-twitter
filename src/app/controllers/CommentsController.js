import Comments from '../models/Comments';

class CommentsController {
  async store(req, res) {
    const { comment, user_id, post_id } = req.body;

    if (comment.length > 250) {
      return res.status(403).json({ error: 'characters exceeded' });
    }

    if (user_id !== req.userId) {
      return res.status(401).json({ error: 'User not exist in session' });
    }

    await Comments.create(req.body);

    return res.json({ comment, user_id, post_id });
  }
}

export default new CommentsController();
