"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { signInAction } from "./action";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const initialState = {
    message: '',
    success: false,
    token: undefined as string | undefined,
}

export default function SignInForm() {
    const [state, action] = useActionState(signInAction, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            router.push("/dashboard"); // change la route selon ton app
        }
    }, [state.success, router]);


}

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Connexion en cours..." : "Se connecter"}
        </Button>
    );
};
