import Students from '../models/Students';
import Help_orders from '../models/Help_orders';

class QuestionsStudentsController {
  async index(req, res) {
    const { student_id } = req.params;

    const studentExists = await Students.findOne({
      where: { id: student_id },
    });

    if (!studentExists) {
      return res.status(400).json({ error: 'User not exists' });
    }

    const questions = await Help_orders.findAll({
      where: { student_id },
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email', 'weight', 'height'],
        },
      ],
    });

    return res.json(questions);
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

    const { question } = req.body;

    const help_order = await Help_orders.create({
      student_id,
      question,
    });

    return res.json(help_order);
  }
}

export default new QuestionsStudentsController();
