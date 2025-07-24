import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserService from '../services/user.services.js';

export default class UserController {
  static async register(req, res) {
    const { name, email, password } = req.body;

    try {
      const userExists = await UserService.findByEmail(email);
      if (userExists) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await UserService.createUser(name, email, hashedPassword);

      return res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (err) {
      return res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserService.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Email não encontrado' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Senha inválida' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (err) {
      return res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  }
}
