"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = { id: string; name: string; email: string };

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const const_ctx = useContext(AuthContext);
    if (!const_ctx) throw new Error("useAuth must be used within an AuthProvider");
    return const_ctx;
}
