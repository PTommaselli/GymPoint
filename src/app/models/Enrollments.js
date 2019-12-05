import Sequelize, { Model } from 'sequelize';

class Enrollments extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Enrollments;
