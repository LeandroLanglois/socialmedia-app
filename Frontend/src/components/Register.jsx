import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/register',
        JSON.stringify({ name, email, password }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccessMessage('Usuário registrado com sucesso!');
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      console.log(response.data); // opcional
    } catch (err) {
      setError('Erro ao registrar usuário. Verifique os dados.');
      setSuccessMessage('');
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate('/login'); // Redireciona para a página de login após o registro
      }, 1000);

      return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
    }
  }, [successMessage, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registro</h2>

        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

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
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Registrar
        </button>

        {successMessage && (
          <p className="mt-4 text-green-600 text-sm text-center">{successMessage}</p>
        )}

        {error && (
          <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default Register;
