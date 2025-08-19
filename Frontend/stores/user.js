import { create } from 'zustand';
const useUserStore = create((set) => ({
    isAuthenticated: true,
    setIsAuthenticated: (status) => set({ isAuthenticated: status }),
    username: '',
    setUsername: (name) => set({ username: name }),
}))

export { useUserStore }