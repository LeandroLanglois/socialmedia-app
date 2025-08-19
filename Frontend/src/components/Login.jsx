import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/login',
        { email, password }, // axios já converte para JSON
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // se estiver usando cookie
        }
      );

      setUser(response.data.user); // ajusta se no backend retorna { user, token }
      setError('');
    } catch (err) {
      setError('Credenciais inválidas');
      setUser(null);
    }
  };

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        navigate('/feed');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Entrar
        </button>

        {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

        {user && (
          <p className="mt-4 text-green-600 text-sm text-center">
            Bem-vindo, {user.name || 'usuário'}
          </p>
        )}

        <p className="mt-6 text-sm text-center">
          Não tem conta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
