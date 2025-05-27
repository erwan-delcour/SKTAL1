"use client";

import { useActionState, useEffect } from "react";
import { signInAction } from "./action";
import { redirect } from "next/navigation";

const initialState = {
    message: '',
    success: false,
}

export default function LoginPage() {
    const [state, action] = useActionState(signInAction, initialState);

    useEffect(() => {
        if (state.success) {
            redirect('/dashboard/employee');
        }
    }, [state.success]);

    return (
        <div className="flex items-center justify-center h-screen flex-col gap-4">
            <h1>Hello from Login /login</h1>
            <form action={action} className="flex flex-col gap-4 w-96">
            <input id="login" name="login" type="text" placeholder="Enter your login" className="border border-gray-300 p-2 rounded" />
            <input id="password" name="password" type="password" placeholder="Enter your password" className="border border-gray-300 p-2 rounded" />
            <button type="submit" className="border border-gray-300 p-2 rounded">Login</button>
            </form>
            {state?.message && (
            <div className={`p-2 rounded ${state.success ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                {state.message}
            </div>
            )}
        </div>
    );
}