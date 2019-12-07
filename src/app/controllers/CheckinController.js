import Checkins from '../models/Checkins';
import Students from '../models/Students';

class CheckinController {
  async index(req, res) {
    const { student_id } = req.params;

    const studentExists = await Students.findOne({
      where: { id: student_id },
    });

    if (!studentExists) {
      return res.status(400).json({ error: 'User not exists' });
    }

    const checkinStudent = await Checkins.findAll({
      where: { student_id },
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email', 'weight', 'height'],
        },
      ],
    });

    return res.json({
      checkinStudent,
    });
  }

  async store(req, res) {
    const { student_id } = req.params;

    const studentExists = await Students.findOne({
      where: { id: student_id },
      attributes: ['id', 'name', 'email', 'weight'],
    });

    if (!studentExists) {
      return res.status(400).json({ error: 'User not exists' });
    }

    const checkin = await Checkins.create({
      student_id,
    });

    return res.json({
      checkin,
      studestudentExists,
    });
  }
}

export default new CheckinController();
