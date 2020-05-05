import Post from '../models/Post';
import User from '../models/User';
import Comments from '../models/Comments';

class PostController {
  async store(req, res) {
    const { content, user_id } = req.body;

    if (content.length > 250) {
      return res.status(403).json({ error: 'characters exceeded' });
    }

    if (user_id !== req.userId) {
      return res.status(401).json({ error: 'User not exist in session' });
    }

    await Post.create(req.body);

    return res.json({ content, user_id });
  }

  async getAll(req, res) {
    const posts = await Post.findAll({
      attributes: ['id', 'content'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
        {
          model: Comments,
          as: 'comments',
          attributes: ['id', 'comment'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.json(posts);
  }

  async update(req, res) {
    const { id } = req.params;
    const { content } = req.body;

    if (content.length > 250) {
      return res.status(403).json({ error: 'characters exceeded' });
    }

    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id'],
        },
      ],
    });

    if (!post) {
      return res.status(400).json({ error: 'This post not exists' });
    }

    if (post.user.id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'This post does not belong to this user' });
    }

    await post.update(req.body);

    return res.json({ content });
  }

  async delete(req, res) {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id'],
        },
      ],
    });

    if (!post) {
      return res.status(400).json({ error: 'This post not exists' });
    }

    if (post.user.id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'This post does not belong to this user' });
    }

    await Post.destroy({ where: { id } });

    return res.json({ message: 'Post deleted' });
  }

  async getUserPost(req, res) {
    const posts = await Post.findAll({
      where: { user_id: req.userId },
      attributes: ['id', 'content'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
        {
          model: Comments,
          as: 'comments',
          attributes: ['id', 'comment'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.json(posts);
  }
}

export default new PostController();
