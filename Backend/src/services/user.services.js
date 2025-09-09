import db from '../config/db.js';

export default class UserService {
  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM register_db WHERE email = $1', [email]);
    return result.rows[0];
  };

  static async createUser(name, email, hashedPassword) {
    await db.query(
      'INSERT INTO register_db (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );
  };

  static async createPost({ title, description }) {
    const result = await db.query(
      'INSERT INTO posts (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );

    return result.rows[0]; // retorna o post criado
  };

  static async getAllPosts() {
    const result = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    return result.rows;
  };

  static async getPostById(id) {
    console.log("Buscando post no banco com ID:", id); // 👈 debug
    const result = await db.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );
    console.log("Resultado do banco:", result.rows); // 👈 debug
    return result.rows[0];
  };

  static async likePost(userId, postId) {
    const result = await db.query(
      `INSERT INTO likes (user_id, post_id, value) 
         VALUES ($1, $2, 1) 
         ON CONFLICT (user_id, post_id) DO UPDATE SET value = 1
         RETURNING *`,
      [userId, postId]
    );
    return result.rows[0];
  };

  static async dislikePost(userId, postId) {
    const result = await db.query(
      `INSERT INTO likes (user_id, post_id, value) 
         VALUES ($1, $2, -1) 
         ON CONFLICT (user_id, post_id) DO UPDATE SET value = -1
         RETURNING *`,
      [userId, postId]
    );
    return result.rows[0];
  };

  static async removeLikeDislike(userId, postId) {
    const result = await db.query(
      `DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING *`,
      [userId, postId]
    );
    return result.rows[0];
  };

  static async addComment(userId, postId, content) {
    const result = await db.query(
      `INSERT INTO comments (user_id, post_id, content) 
         VALUES ($1, $2, $3) RETURNING *`,
      [userId, postId, content]
    );
    return result.rows[0];
  };

  static async getComments(postId) {
    const result = await db.query(
      `SELECT c.*, u.name as user_name 
         FROM comments c
         JOIN register_db u ON u.id = c.user_id
         WHERE c.post_id = $1 
         ORDER BY c.created_at ASC`,
      [postId]
    );
    return result.rows;
  };
}
