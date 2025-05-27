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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-center text-2xl text-center">
                    Connectez-vous à votre compte
                </CardTitle>
                <CardDescription>
                    Entrez votre pseudo et votre mot de passe ci-dessous pour vous connecter à votre compte.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={action}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="login">Pseudo</Label>
                            <Input
                                id="login"
                                type="text"
                                name="login"
                                placeholder="Votre pseudo"
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Votre mot de passe"
                                required
                            />
                        </div>
                        {state?.success === false && (
                            <div className="text-red-500 text-sm text-center">{state?.message}</div>
                        )}
                        <div className="flex flex-col gap-3">
                            <SubmitButton />
                        </div>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Vous n'avez pas de compte ?{" "}
                        <Link href="/signup" className="underline underline-offset-4">
                            S'inscrire
                        </Link>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground mt-6">
                        <span className="text-muted-foreground font-medium">Identifiants de démonstration :</span> <br />
                        <code className="text-xs">employee@company.com</code> – vue employé
                        <br />
                        <code className="text-xs">secretary@company.com</code> – vue secrétaire
                        <br />
                        <code className="text-xs">manager@company.com</code> – vue manager
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Connexion en cours..." : "Se connecter"}
        </Button>
    );
};
