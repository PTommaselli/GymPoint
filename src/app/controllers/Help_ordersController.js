import Help_orders from '../models/Help_orders';
import User from '../models/User';
import Help_orderMail from '../jobs/Help_orderMail';
import Queue from '../../lib/Queue';
import Students from '../models/Students';

class Help_ordersController {
  async index(req, res) {
    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const help_orders = await Help_orders.findAll({
      where: { answer: null },
    });

    return res.json(help_orders);
  }

  async update(req, res) {
    const isAdm = await User.findOne({ where: { id: req.userId, adm: true } });
    if (!isAdm) {
      return res.status(401).json({ error: "You aren't administrator" });
    }

    const help_orders = await Help_orders.findOne({
      where: { id: req.params.id, answer: null },
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    const { answer } = req.body;
    const answerReply = await help_orders.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(Help_orderMail.key, {
      help_orders,
    });

    return res.json(answerReply);
  }
}

export default new Help_ordersController();
