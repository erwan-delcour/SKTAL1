"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface SignInState {
  message: string
  success: boolean
  redirect?: string
}

export const signInAction = async (
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> => {
    const login = formData.get("login") as string;
    const password = formData.get("password") as string;

        if (login && password) {
            const response = await fetch("http://localhost:3000/api/auth/signin", {
                method: "POST",
                body: JSON.stringify({ login, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

        if (!response.ok) {
            return {
                message: "Invalid credentials",
                success: false,
            };
        }
        const data = await response.json();
        const cookieStore = await cookies();
        cookieStore.set("token", data.token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "strict",
        });
        
        // Retourner le succès d'abord, puis rediriger dans le hook
        return {
            message: "Connexion réussie !",
            success: true,
            redirect: "/dashboard/employee"
        };
    } else {
        return {
            message: "Please enter your email and password",
            success: false,
        };
    }
}