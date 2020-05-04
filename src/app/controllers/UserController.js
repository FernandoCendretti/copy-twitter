import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(403).json({ error: 'Validation Fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async get(req, res) {
    const { name, email } = await User.findByPk(req.userId);

    return res.json({ name, email });
  }

  async update(req, res) {
    const { oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const { name, email } = await user.update(req.body);

    return res.json({ name, email });
  }

  async delete(req, res) {
    await User.destroy({
      where: {
        id: req.userId,
      },
    });

    return res.json({ message: 'User deleted' });
  }
}

export default new UserController();
