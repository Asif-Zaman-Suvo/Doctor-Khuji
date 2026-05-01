"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    const session = await fetch("/api/auth/session").then((r) => r.json());
    const role = session?.user?.role;

    const redirectMap: Record<string, string> = {
      ADMIN: "/dashboard/admin",
      DOCTOR: "/dashboard/doctor",
      PATIENT: "/dashboard/patient",
    };

    router.push(redirectMap[role] ?? "/dashboard");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1" data-testid="login-form">
        <section className="mb-10 space-y-3">
          <h1 className="header">Welcome back 👋</h1>
          <p className="text-dark-700">Sign in to your DoctorKhuji account.</p>
        </section>

        {registered && (
          <div className="rounded-md bg-[#24AE7C]/10 border border-[#24AE7C]/30 px-4 py-3 text-sm text-[#24AE7C]">
            Account created successfully! Please sign in.
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Email</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-xl border border-app-border-2 bg-app-surface-2 input-wrapper">
                  <Image
                    src="/assets/icons/email.svg"
                    alt="email"
                    width={20}
                    height={20}
                    className="ml-3 shrink-0"
                  />
                  <Input
                    {...field}
                    type="email"
                    placeholder="john@example.com"
                    data-testid="login-email"
                    className="border-0 bg-transparent text-app-text placeholder:text-dark-600 focus-visible:ring-0 focus-visible:outline-none"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Password</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-xl border border-app-border-2 bg-app-surface-2 input-wrapper pr-3">
                  <Image
                    src="/assets/icons/user.svg"
                    alt="password"
                    width={20}
                    height={20}
                    className="ml-3 shrink-0"
                  />
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    data-testid="login-password"
                    className="border-0 bg-transparent text-app-text placeholder:text-dark-600 focus-visible:ring-0 focus-visible:outline-none flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-app-muted hover:text-app-text transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />

        {error && (
          <p data-testid="login-error" className="rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          data-testid="login-submit"
          className="w-full bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold py-5 cursor-pointer transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-center text-sm text-app-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#24AE7C] hover:underline font-medium">
            Create one
          </Link>
        </p>
      </form>
    </Form>
  );
}
