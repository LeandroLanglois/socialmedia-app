import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Post = () => {
  const { id } = useParams();   
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/post/${id}`);
        setPost(res.data);
        if (!res.data) {
          setError("Publicação não encontrada.");
        }
      } catch (err) {
        setError("Erro ao carregar a publicação, tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Carregando...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Recarregar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
      >
        Voltar
      </button>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-sm text-gray-500 mb-2">Publicado por {post.author}</p>
        <p className="text-sm text-gray-400 mb-4">
          {new Date(post.created_at).toLocaleDateString("pt-BR")}
        </p>
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-700">{post.description}</p>
      </div>
    </div>
  );
};

export default Post;
