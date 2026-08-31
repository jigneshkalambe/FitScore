"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [mode, setMode] = useState<"login" | "register">("login");

    const handleSuccess = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{mode === "login" ? "Log in" : "Create an account"}</DialogTitle>
                    <DialogDescription>{mode === "login" ? "Log in to save and revisit your resume analyses." : "Sign up to start saving your resume analyses."}</DialogDescription>
                </DialogHeader>

                {mode === "login" ? (
                    <LoginForm onSuccess={handleSuccess} onSwitchToRegister={() => setMode("register")} />
                ) : (
                    <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={() => setMode("login")} />
                )}
            </DialogContent>
        </Dialog>
    );
}
