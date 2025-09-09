import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("=== AUTH MIDDLEWARE ===");
  console.log("Authorization Header recebido:", authHeader);

  const token = authHeader && authHeader.split(" ")[1]; // "Bearer token"
  console.log("Token extraído:", token);

  if (!token) {
    console.log("Nenhum token foi enviado no header.");
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    console.log("JWT_SECRET usado:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado com sucesso:", decoded);

    req.user = decoded; // aqui vai ter { id: user.id }
    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error.message);
    return res.status(403).json({ message: "Token inválido", error: error.message });
  }
};

