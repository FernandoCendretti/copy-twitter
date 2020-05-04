import Sequelize, { Model } from 'sequelize';

class Comments extends Model {
  static init(sequelize) {
    super.init(
      {
        comment: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Comments;
