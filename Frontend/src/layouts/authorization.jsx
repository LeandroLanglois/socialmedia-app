import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useUserStore } from "../../stores/user";
const AuthorizationRoute = () => {
    const { isAuthenticated, setIsAuthenticated } = useUserStore();
    useEffect(() => {
        console.log("x")
        // Aqui você pode adicionar lógica para verificar a autenticação
        // Por exemplo, verificar se o token JWT é válido ou se o usuário está logado q
    }, [])
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }
    return <Outlet />
}

export default AuthorizationRoute;