import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
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

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
            Socialmedia App
          </h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => navigate("/newpost")}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Criar publicação
            </button>
            <div className="relative">
              <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
                Perfil
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg hidden group-hover:block">
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto p-4 pt-24">
        {loading && <p className="text-center mt-10 text-gray-500">Carregando...</p>}

        {error && !loading && (
          <div className="text-center mt-10 text-red-500">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Recarregar
            </button>
          </div>
        )}

        {!loading && !error && filteredPosts.length === 0 && (
          <p className="text-center text-gray-500">Nenhuma publicação encontrada.</p>
        )}

        {!loading &&
          !error &&
          filteredPosts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200 hover:shadow-lg transition"
            >
              {/* Nome do autor */}
              <p className="text-sm text-gray-500 mb-2">Publicado por {post.author}</p>

              {/* Título e descrição */}
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">
                {post.description.length > 100
                  ? post.description.substring(0, 100) + "..."
                  : post.description}
              </p>

              {/* Botão para visualizar publicação completa */}
              <button
                onClick={() => navigate(`/post/${post.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Visualizar
              </button>
            </div>
          ))}
      </main>
    </div>
  );
};

export default Feed;
