import * as Yup from 'yup';
import { startOfDay, parseISO, isBefore, addMonths } from 'date-fns';

import Enrollments from '../models/Enrollments';
import User from '../models/User';
import Plans from '../models/Plans';
import Students from '../models/Students';

class EnrollmentsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const { start_date, plan_id, student_id } = req.body;

    const startDayEnrollment = startOfDay(parseISO(start_date));

    if (isBefore(startDayEnrollment, new Date())) {
      return res.status(400).json({ error: 'You can not begin on today date' });
    }

    const student = await Students.findOne({
      where: { id: student_id },
      attributes: ['id', 'name', 'email'],
    });

    const plan = await Plans.findOne({
      where: { id: plan_id },
      attributes: ['id', 'title', 'duration', 'price'],
    });

    const endDayEnrollment = addMonths(startDayEnrollment, plan.duration);

    const totalPrice = plan.duration * plan.price;

    const enrollment = await Enrollments.create({
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
}

export default new EnrollmentsController();
