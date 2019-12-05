import {} 'date-fns';

import Enrollments from '../models/Enrollments';

class EnrollmentsController {
  async store(req, res) {
    const {
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    } = req.body
  }
}

export default new EnrollmentsController();
