import Sequelize, { Model } from 'sequelize';

class Enrollments extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        price: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Students, {
      foreignKey: 'student_id',
      as: 'student',
    });
    this.belongsTo(models.Plans, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Enrollments;
