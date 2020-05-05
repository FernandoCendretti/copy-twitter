import Comments from '../models/Comments';
import User from '../models/User';
import Post from '../models/Post';

class CommentsController {
  async store(req, res) {
    const { comment, user_id, post_id } = req.body;

    if (comment.length > 250) {
      return res.status(403).json({ error: 'characters exceeded' });
    }

    if (user_id !== req.userId) {
      return res.status(401).json({ error: 'User not exist in session' });
    }

    if (!(await Post.findByPk(post_id))) {
      return res.status(403).json({ error: 'This post not exists' });
    }
    await Comments.create(req.body);

    return res.json({ comment, user_id, post_id });
  }

  async update(req, res) {
    const { id } = req.params;

    const comments = await Comments.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id'],
        },
      ],
    });

    if (!comments) {
      return res.status(400).json({ error: 'This comment not exists' });
    }

    if (comments.user.id !== req.userId) {
      res.status(401).json({ error: 'Comments does not belong to the user' });
    }

    const { comment } = await comments.update(req.body);

    return res.json({ comment });
  }
}

export default new CommentsController();
