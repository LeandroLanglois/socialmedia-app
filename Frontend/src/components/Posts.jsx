import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/post/${id}`);
        setPost(res.data);

        const commentsRes = await axios.get(`http://localhost:3000/post/${id}/comments`);
        setComments(commentsRes.data);
      } catch (err) {
        setError("Erro ao carregar a publicação, tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:3000/post/${id}/comment`,
        { content: newComment },
        { withCredentials: true }
      );
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Erro ao comentar", err);
    }
  };

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
        <p className="text-gray-700 mb-6">{post.description}</p>

        {/* Comentários */}
        <h2 className="text-lg font-semibold mb-4">Comentários</h2>
        <form onSubmit={handleCommentSubmit} className="mb-6 flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Enviar
          </button>
        </form>

        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-gray-500">Nenhum comentário ainda.</p>
          )}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b pb-2 border-gray-200"
            >
              <p className="text-sm font-semibold">{comment.user_name}</p>
              <p className="text-gray-600">{comment.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(comment.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
