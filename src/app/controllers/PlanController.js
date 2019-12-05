import * as Yup from 'yup';

import User from '../models/User';
import Plans from '../models/Plans';

class PlanController {
  async index(req, res) {
    const plans = await Plans.findAll({
      order: ['duration'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't adiministrator" });
    }

    const { title, duration, price } = await Plans.create(req.body);
    return res.json({
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    const planExists = await Plans.findOne({ where: { id: req.params.id } });
    if (!planExists) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't adiministrator" });
    }

    const { id, title, duration, price } = await planExists.update(req.body);
    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const planExists = await Plans.findOne({ where: { id: req.params.id } });
    if (!planExists) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't adiministrator" });
    }

    await planExists.destroy();
    return res.json({
      planExists,
      Deleted: 'All dates deleted',
    });
  }
}

export default new PlanController();
