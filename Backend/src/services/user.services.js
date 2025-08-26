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

  static async createPost({ title, description }) {
    const result = await db.query(
      'INSERT INTO posts (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );

    return result.rows[0]; // retorna o post criado
  }

  static async getAllPosts() {
    const result = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    return result.rows;
  }

  static async getPostById(id) {
  console.log("Buscando post no banco com ID:", id); // 👈 debug
  const result = await db.query(
    'SELECT * FROM posts WHERE id = $1',
    [id]
  );
  console.log("Resultado do banco:", result.rows); // 👈 debug
  return result.rows[0];
}
}
