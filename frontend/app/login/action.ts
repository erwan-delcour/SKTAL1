"use server";

import { cookies } from "next/headers";

export const signInAction = async (initialData: {}, formData: FormData) => {
    const login = formData.get("login") as string;
    const password = formData.get("password") as string;
    const cookieStore = await cookies();

    if (!login || !password) {
        return {
            message: "Veuillez remplir tous les champs",
            success: false,
        };
    }

    const response = await fetch(`http://localhost:3000/api/signin`, {
        method: "POST",
        body: JSON.stringify({ login, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        return {
            message: "Erreur lors de l'authentification, veuillez réessayer",
            success: false,
        };
    }

    const data = await response.json();
    const token = data.token;

    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: "/",
    });

    return {
        message: "Connexion réussie",
        success: true,
    };
};

export const logoutAction = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { success: true };
};
