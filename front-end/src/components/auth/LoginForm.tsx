"use client";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/lib/api/auth";

export default function LoginForm({ onSuccess, onSwitchToRegister }: { onSuccess: () => void; onSwitchToRegister: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { token, user } = await loginUser({ email, password });
            login(token, user);
            onSuccess();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="mt-2">
                {loading ? "Logging in..." : "Log in"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
                Don't have an account?{" "}
                <button type="button" onClick={onSwitchToRegister} className="text-foreground underline underline-offset-2">
                    Sign up
                </button>
            </p>
        </form>
    );
}
