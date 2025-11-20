"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock, Phone, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { DEMO_CREDENTIALS } from "@/lib/mock-data";

const loginSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    try {
      await login(values);
    } catch (err: any) {
      console.error("Login error:", err);
    }
  }

  const quickLogin = (phone: string, password: string) => {
    form.setValue("phone", phone);
    form.setValue("password", password);
  };

  return (
    <div className="space-y-6">
      {/* Demo Credentials Banner */}
      <Card className="border-blue-500/20 bg-blue-950/20 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-400" />
            <CardTitle className="text-sm font-medium text-blue-400">
              Demo Mode - Quick Login
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-zinc-400 mb-3">
            Click any account below to auto-fill credentials:
          </p>
          <div className="grid gap-2">
            {Object.entries(DEMO_CREDENTIALS).map(([key, creds]) => (
              <button
                key={key}
                type="button"
                onClick={() => quickLogin(creds.phone, creds.password)}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-left text-sm transition-all hover:border-blue-500/50 hover:bg-zinc-900"
              >
                <div>
                  <div className="font-medium text-white">{creds.name}</div>
                  <div className="text-xs text-zinc-500">{creds.phone}</div>
                </div>
                <div className="text-xs text-zinc-500">
                  Password: {creds.password}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login Form */}
      <Card className="w-full border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">
            Welcome back
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your phone number and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                          placeholder="+1234567890"
                          className="border-zinc-800 bg-zinc-900/50 pl-9 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="border-zinc-800 bg-zinc-900/50 pl-9 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-zinc-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="w-full text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}