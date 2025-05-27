"use client";

import SignInForm from "@app/login/loginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1 items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <SignInForm/>
                </div>
            </div>
        </div>
    );
}