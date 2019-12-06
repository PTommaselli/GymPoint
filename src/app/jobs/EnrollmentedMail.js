import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class EnrollmentedMail {
  get key() {
    return 'EnrollmentedMail';
  }

  async handle({ data }) {
    const { enrollment, student, plan } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Você foi Matriculado!',
      template: 'enrollmented',
      context: {
        student: student.name,
        start_date: format(parseISO(enrollment.start_date), "dd'/'M'/'yyyy"),
        end_date: format(parseISO(enrollment.end_date), "dd'/'M'/'yyyy"),
        plan: plan.title,
        plan_duration: plan.duration,
        price: enrollment.price,
      },
    });
  }
}

export default new EnrollmentedMail();
