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
  };

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
  };

  static async getFeed(req, res) {
    try {
      // Buscar postagens do usuário ou do  geral
      const posts = await UserService.getAllPosts(); // implementa no service

      return res.json({ posts });
    } catch (err) {
      return res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  };

  static async createPost(req, res) {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: "Título e descrição são obrigatórios" });
      }

      const newPost = await UserService.createPost({ title, description });

      return res.status(201).json(newPost);
    } catch (err) {
      console.error("Erro no createPost:", err);
      return res.status(500).json({ message: "Erro interno", error: err.message });
    }
  }

  static async getAllPosts(req, res) {
    try {
      const posts = await UserService.getAllPosts();
      return res.json(posts);
    } catch (err) {
      return res.status(500).json({ message: "Erro interno", error: err.message });
    }
  };

  static async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await UserService.getPostById(id);

      if (!post) {
        return res.status(404).json({ message: 'Post não encontrado.' });
      }

      return res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao buscar o post.' });
    }
  };

}
