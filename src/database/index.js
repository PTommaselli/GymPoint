import Sequelize from 'sequelize';

import User from '../app/models/User';
import Students from '../app/models/Students';
import Plans from '../app/models/Plans';
import Enrollments from '../app/models/Enrollments';
import Checkins from '../app/models/Checkins';
import Help_orders from '../app/models/Help_orders';

import databaseConfig from '../config/database';

const models = [User, Students, Plans, Enrollments, Checkins, Help_orders];

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
