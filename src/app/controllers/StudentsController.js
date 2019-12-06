import * as Yup from 'yup';

import Students from '../models/Students';
import User from '../models/User';

class StudentsController {
  async index(req, res) {
    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const students = await Students.findAll({
      where: { canceled_at: null },
      order: ['id'],
    });

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.string().required(),
      weight: Yup.string().required(),
      height: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });

    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const userExists = await Students.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, age, weight, height } = await Students.create(
      req.body
    );
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.string(),
      weight: Yup.string(),
      height: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const { email } = req.body;

    const studentExists = await Students.findOne({
      where: {
        id: req.params.id,
        canceled_at: null,
      },
    });

    if (!studentExists) {
      return res.status(400).json({ error: 'Students not exists' });
    }

    if (studentExists.canceled_at !== null) {
      return res.status(400).json({ error: 'Students was cancelled' });
    }

    if (email === studentExists.email) {
      const studentEmail = await Students.findOne({ where: { email } });

      if (!studentEmail) {
        return res.status(400).json({ error: 'Email be already used' });
      }
    }

    const { id, name, age, weight, height } = await studentExists.update(
      req.body
    );
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async delete(req, res) {
    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const student = await Students.findOne({
      where: { id: req.params.id, canceled_at: null },
    });

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    student.canceled_at = new Date();

    await student.save();

    return res.json(student);
  }
}

export default new StudentsController();
