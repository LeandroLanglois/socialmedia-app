import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get("http://localhost:3000/feed");
        setPosts(res.data);
        if (res.data.length === 0) {
          setError("Nenhuma publicação encontrada.");
        }
      } catch (err) {
        setError("Erro ao carregar o feed, tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

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
    <div className="max-w-3xl mx-auto p-4">
      {/* Botão para criar nova publicação */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/newpost")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Criar publicação
        </button>
      </div>

      {/* Lista de publicações */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma publicação encontrada.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
