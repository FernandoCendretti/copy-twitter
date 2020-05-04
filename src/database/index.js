import Sequelize from 'sequelize';

import User from '../app/models/User';
import Post from '../app/models/Post';
import Comments from '../app/models/Comments';

import databaseConfig from '../config/database';

const models = [User, Post, Comments];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
