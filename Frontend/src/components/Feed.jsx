"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [userReactions, setUserReactions] = useState({})
  const [likingPosts, setLikingPosts] = useState(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get("http://localhost:3000/feed")
        setPosts(res.data)
        if (res.data.length === 0) {
          setError("Nenhuma publicação encontrada.")
        }
      } catch (err) {
        setError("Erro ao carregar o feed, tente novamente.")
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [])

  useEffect(() => {
    const fetchUserReactions = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await axios.get("http://localhost:3000/posts/user-reactions", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const reactionsMap = {}
        response.data.forEach((reaction) => {
          reactionsMap[reaction.post_id] = reaction.value
        })
        setUserReactions(reactionsMap)
      } catch (err) {
        console.error("Erro ao buscar reações do usuário:", err)
      }
    }
    fetchUserReactions()
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      // Refresh feed when user returns to the page
      const fetchFeed = async () => {
        try {
          const res = await axios.get("http://localhost:3000/feed")
          setPosts(res.data)
        } catch (err) {
          console.error("Erro ao recarregar feed:", err)
        }
      }
      fetchFeed()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  const handleLike = async (postId) => {
    if (likingPosts.has(postId)) return

    const currentReaction = userReactions[postId]

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        console.error("Token não encontrado. Faça login novamente.")
        navigate("/login")
        return
      }

      setLikingPosts((prev) => new Set([...prev, postId]))

      let response
      if (currentReaction === 1) {
        response = await axios.delete(`http://localhost:3000/post/${postId}/like`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserReactions((prev) => ({ ...prev, [postId]: null }))
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: Math.max(Number(p.likes || 0) - 1, 0) } : p)),
        )
      } else {
        response = await axios.post(
          `http://localhost:3000/post/${postId}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setUserReactions((prev) => ({ ...prev, [postId]: 1 }))
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              const newLikes = currentReaction === -1 ? Number(p.likes || 0) + 1 : Number(p.likes || 0) + 1
              const newDislikes =
                currentReaction === -1 ? Math.max(Number(p.dislikes || 0) - 1, 0) : Number(p.dislikes || 0)
              return { ...p, likes: newLikes, dislikes: newDislikes }
            }
            return p
          }),
        )
      }

      console.log("Like/Unlike realizado com sucesso")
    } catch (err) {
      console.error("Erro ao dar like:", err.response?.data || err.message)
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  const handleDislike = async (postId) => {
    if (likingPosts.has(postId)) return

    const currentReaction = userReactions[postId]

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        console.error("Token não encontrado. Faça login novamente.")
        navigate("/login")
        return
      }

      setLikingPosts((prev) => new Set([...prev, postId]))

      let response
      if (currentReaction === -1) {
        response = await axios.delete(`http://localhost:3000/post/${postId}/dislike`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserReactions((prev) => ({ ...prev, [postId]: null }))
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, dislikes: Math.max(Number(p.dislikes || 0) - 1, 0) } : p)),
        )
      } else {
        response = await axios.post(
          `http://localhost:3000/post/${postId}/dislike`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        setUserReactions((prev) => ({ ...prev, [postId]: -1 }))
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              const newDislikes = currentReaction === 1 ? Number(p.dislikes || 0) + 1 : Number(p.dislikes || 0) + 1
              const newLikes = currentReaction === 1 ? Math.max(Number(p.likes || 0) - 1, 0) : Number(p.likes || 0)
              return { ...p, dislikes: newDislikes, likes: newLikes }
            }
            return p
          }),
        )
      }

      console.log("Dislike/Undislike realizado com sucesso")
    } catch (err) {
      console.error("Erro ao dar dislike:", err.response?.data || err.message)
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
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
          </div>
        </div>
      </header>

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

        {!loading &&
          !error &&
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200 hover:shadow-lg transition"
            >
              <p className="text-sm text-gray-500 mb-2">Publicado por {post.author}</p>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-2">
                {post.description.length > 100 ? post.description.substring(0, 100) + "..." : post.description}
              </p>
              <button
                onClick={() => navigate(`/post/${post.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Visualizar
              </button>

              <div className="mt-4 flex space-x-4 text-gray-500">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`cursor-pointer transition-colors ${
                    userReactions[post.id] === 1 ? "text-blue-500 font-semibold" : "hover:text-blue-500"
                  } ${likingPosts.has(post.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={likingPosts.has(post.id)}
                >
                  👍 {post.likes || 0}
                </button>
                <button
                  onClick={() => handleDislike(post.id)}
                  className={`cursor-pointer transition-colors ${
                    userReactions[post.id] === -1 ? "text-red-500 font-semibold" : "hover:text-red-500"
                  } ${likingPosts.has(post.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={likingPosts.has(post.id)}
                >
                  👎 {post.dislikes || 0}
                </button>
                <button onClick={() => navigate(`/post/${post.id}`)} className="cursor-pointer hover:text-green-500">
                  💬 {post.comments || 0}
                </button>
              </div>
            </div>
          ))}
      </main>
    </div>
  )
}

export default Feed
