"use client";
import { getMe } from "@/lib/api/auth";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

type User = { id: string; name: string; email: string };

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const checkAuth = async () => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!storedToken) {
            setIsAuthenticated(false);
            return;
        }
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {}
        }

        try {
            const response = await getMe();
            if (response) {
                setUser(response);
                setIsAuthenticated(true);
            } else {
                logout();
                setIsAuthenticated(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Session expired. Please log in again.");
        }
    };

    return <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, setIsAuthenticated }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const const_ctx = useContext(AuthContext);
    if (!const_ctx) throw new Error("useAuth must be used within an AuthProvider");
    return const_ctx;
}
