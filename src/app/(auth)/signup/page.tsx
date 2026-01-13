"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock, Phone, User, Building2 } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { PHONE_REGEX } from "@/lib/utils";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(PHONE_REGEX, "Phone number must be 11-13 digits (country code + number) without + sign"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  department: z.string().optional(),
  // For UI purposes only
  orgName: z.string().optional(),
  orgCode: z.string().optional(),
});

export default function SignupPage() {
  const { signup, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"create" | "join">("create");

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      department: "",
      orgName: "",
      orgCode: "",
    },
  });

  useEffect(() => {
    const orgId = searchParams.get("org_id");
    if (orgId) {
      setMode("join");
      form.setValue("orgCode", orgId);
    }
  }, [searchParams, form]);

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      // Map orgName or orgCode to department if needed, or just send what the API expects
      // The API expects: name, phone, password, department, org_name OR org_id
      const payload = {
        name: values.name,
        phone: values.phone,
        password: values.password,
        department: "",
        org_name: mode === "create" ? values.orgName : undefined,
        org_id: mode === "join" ? parseInt(values.orgCode || "0") : undefined,
      };
      await signup(payload);
    } catch (err: any) {
      console.error("Signup error:", err);
    }
  }

  return (
    <Card className="w-full border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white">
          Create an account
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Enter your information to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={mode}
          className="w-full mb-6"
          onValueChange={(v) => setMode(v as "create" | "join")}
        >
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50">
            <TabsTrigger value="create">Create Organization</TabsTrigger>
            <TabsTrigger value="join">Join Organization</TabsTrigger>
          </TabsList>
        </Tabs>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        placeholder="John Doe"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                      <Input
                        placeholder="15551234567"
                        className="border-zinc-800 bg-zinc-900/50 pl-9 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "create" ? (
              <FormField
                control={form.control}
                name="orgName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Organization Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                          placeholder="Acme Inc."
                          className="border-zinc-800 bg-zinc-900/50 pl-9 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="orgCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Organization ID</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                          placeholder="e.g. 1"
                          type="number"
                          className="border-zinc-800 bg-zinc-900/50 pl-9 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account</>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <p className="w-full text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-white underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
        <Link
          href="/policy"
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Privacy Policy
        </Link>
      </CardFooter>
    </Card>
  );
}
