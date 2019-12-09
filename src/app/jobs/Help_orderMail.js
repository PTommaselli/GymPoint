import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class EnrollmentedMail {
  get key() {
    return 'Help_orderMail';
  }

  async handle({ data }) {
    const { help_orders } = data;

    await Mail.sendMail({
      to: `${help_orders.student.name} <${help_orders.student.email}>`,
      subject: 'Uma pedido de auxílio seu foi respondido!',
      template: 'answerReplay',
      context: {
        student: help_orders.student.name,
        question: help_orders.question,
        answer: help_orders.answer,
        answer_date: format(parseISO(help_orders.answer_at), "dd'/'M'/'yyyy"),
      },
    });
  }
}

export default new EnrollmentedMail();
