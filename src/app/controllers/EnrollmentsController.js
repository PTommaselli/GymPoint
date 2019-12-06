import * as Yup from 'yup';
import { startOfDay, parseISO, isBefore, addMonths } from 'date-fns';

import Queue from '../../lib/Queue';
import Enrollments from '../models/Enrollments';
import User from '../models/User';
import Plans from '../models/Plans';
import Students from '../models/Students';
import EnrollmentedMail from '../jobs/EnrollmentedMail';

class EnrollmentsController {
  async index(req, res) {
    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const enrollments = await Enrollments.findAll({
      where: { canceled_at: null },
      order: ['id'],
      attributes: ['id', 'start_date', 'end_date', 'price', 'canceled_at'],
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plans,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const { start_date, plan_id, student_id } = req.body;

    const student = await Students.findOne({
      where: { id: student_id },
      attributes: ['id', 'name', 'email'],
    });

    const plan = await Plans.findOne({
      where: { id: plan_id },
      attributes: ['id', 'title', 'duration', 'price'],
    });

    if (!plan && !student) {
      return res
        .status(400)
        .json({ error: 'Plan and Student does not exists' });
    }

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const startDayEnrollment = startOfDay(parseISO(start_date));

    if (isBefore(startDayEnrollment, new Date())) {
      return res.status(400).json({ error: 'You can not begin on today date' });
    }

    const endDayEnrollment = addMonths(startDayEnrollment, plan.duration);

    const totalPrice = plan.duration * plan.price;

    const enrollment = await Enrollments.create({
      student_id,
      plan_id,
      start_date: startDayEnrollment,
      end_date: endDayEnrollment,
      price: totalPrice,
    });

    await Queue.add(EnrollmentedMail.key, {
      enrollment,
      student,
      plan,
    });

    return res.json({
      enrollment,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const EnrollmentExists = await Enrollments.findOne({
      where: { id: req.params.id, canceled_at: null },
    });

    if (!EnrollmentExists) {
      return res.status(400).json({ error: 'Enrollment does not exists' });
    }

    const { start_date, plan_id, student_id } = req.body;

    const student = await Students.findOne({
      where: { id: student_id },
      attributes: ['id', 'name', 'email'],
    });

    const plan = await Plans.findOne({
      where: { id: plan_id },
      attributes: ['id', 'title', 'duration', 'price'],
    });

    if (!plan && !student) {
      return res
        .status(400)
        .json({ error: 'Plan and Student does not exists' });
    }

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const startDayEnrollment = startOfDay(parseISO(start_date));

    if (isBefore(startDayEnrollment, new Date())) {
      return res.status(400).json({ error: 'You can not begin on today date' });
    }

    const endDayEnrollment = addMonths(startDayEnrollment, plan.duration);

    const totalPrice = plan.duration * plan.price;

    const enrollment = await EnrollmentExists.update({
      student_id,
      plan_id,
      start_date: startDayEnrollment,
      end_date: endDayEnrollment,
      price: totalPrice,
    });

    return res.json({
      enrollment,
    });
  }

  async delete(req, res) {
    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const enrollment = await Enrollments.findOne({
      where: { id: req.params.id, canceled_at: null },
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plans,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exists' });
    }

    enrollment.canceled_at = new Date();

    await enrollment.save();

    return res.json(enrollment);
  }
}

export default new EnrollmentsController();
