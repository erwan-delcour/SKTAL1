"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { decodeTokenUnsafe, getRoleFromToken } from "@/lib/jwt";

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

        if (response.status === 500) {
            return {
                message: "Internal server error",
                success: false,
            };
        }
        
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
            path: "/",
        });
          // Décoder le token pour obtenir le rôle et rediriger vers le bon dashboard
        const userRole = getRoleFromToken(data.token);
        
        let redirectPath = "/dashboard/employee"; // défaut
        
        if (userRole) {
            // Rediriger selon le rôle
            switch (userRole) {
                case 'manager':
                    redirectPath = "/dashboard/manager";
                    break;
                case 'secretary':
                    redirectPath = "/dashboard/secretary";
                    break;
                case 'user':
                default:
                    redirectPath = "/dashboard/employee";
                    break;
            }
        }
        
        // Redirection immédiate côté serveur après définition du cookie
        redirect(redirectPath);
    } else {
        return {
            message: "Please enter your email and password",
            success: false,
        };
    }
}