import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:3000/newpost", {
        title,
        description,
      });

      setSuccess("Post criado com sucesso!");
      setTitle("");
      setDescription("");

      // Redireciona para o feed após 1 segundo
      setTimeout(() => {
        navigate("/feed");
      }, 1000);
    } catch (err) {
      setError("Erro ao criar post. Tente novamente.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md"
      >
        {/* Botão de voltar */}
        <button
          type="button"
          onClick={() => navigate("/feed")}
          className="text-sm text-blue-500 hover:underline mb-4"
        >
          &larr; Voltar para o feed
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center">Criar Novo Post</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border p-2 mb-3 rounded-md"
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border p-2 mb-3 rounded-md min-h-[100px]"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Publicar
        </button>
      </form>
    </div>
  );
};

export default NewPost;
