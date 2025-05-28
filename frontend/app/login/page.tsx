"use client";

import { useActionState, useEffect } from "react";
import { signInAction } from "./action";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Car } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

const initialState = {
    message: '',
    success: false,
}

export default function LoginPage() {
    const [state, action] = useActionState(signInAction, initialState);

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-100 absolute left-4 top-4 md:left-8 md:top-8"
      >
        Back
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        <Card >
          <form action={action} className="space-y-6">
            <CardHeader>
              <CardTitle className="text-xl">Identify yourself</CardTitle>
              <CardDescription>Access the parking reservation system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
            <Label htmlFor="login">Login</Label>
            <Input
              id="login"
              type="login"
              placeholder="Enter your login"
              name="login"
              required
            />
              </div>
              <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
            />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <SubmitButton/>
              {state?.success === false && (
              <div className="text-red-500 text-sm text-center">{state?.message}</div>
            )}
            </CardFooter>
          </form>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <span className="text-muted-foreground">For demo purposes:</span> <br />
          <code className="text-xs">employee</code> - Employee view
          <br />
          <code className="text-xs">secretary</code> - Secretary view
          <br />
          <code className="text-xs">manager</code> - Manager view
        </p>
            </div>
        </div>
    );
}


const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full">
      {pending ? "Connexion en cours..." : "Se connecter"}
    </Button>
  );
};