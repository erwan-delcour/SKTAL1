"use server";

import { cookies } from "next/headers";

export const signInAction = async (initialData: {},formData: FormData) => {
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
        return {
            message: "Login successful",
            success: true,
        };
    } else {
        return {
            message: "Please enter your email and password",
            success: false,
        };
    }
}