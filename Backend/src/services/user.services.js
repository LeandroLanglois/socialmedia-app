import db from '../config/db.js';

export default class UserService {
  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM register_db WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async createUser(name, email, hashedPassword) {
    await db.query(
      'INSERT INTO register_db (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );
  }
}
