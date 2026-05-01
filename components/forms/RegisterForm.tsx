"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Eye, EyeOff, Stethoscope, UserRound } from "lucide-react";
import { registerUser } from "@/app/actions/auth";

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["PATIENT", "DOCTOR"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "PATIENT",
    },
  });

  const selectedRole = form.watch("role");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError("");
    const result = await registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      role: values.role,
    });
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex-1" data-testid="register-form">
        <section className="mb-8 space-y-3">
          <h1 className="header">Create your account</h1>
          <p className="text-dark-700">Join DoctorKhuji as a patient or doctor.</p>
        </section>

        {/* Role Selector */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">I am a</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-3">
                  {(["PATIENT", "DOCTOR"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      data-testid={`role-${role.toLowerCase()}`}
                      onClick={() => field.onChange(role)}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all cursor-pointer font-medium ${
                        selectedRole === role
                          ? "border-[#24AE7C] bg-[#24AE7C]/10 text-[#24AE7C]"
                          : "border-app-border-2 bg-app-surface-2 text-app-muted hover:border-[#24AE7C]/50 hover:text-app-text"
                      }`}
                    >
                      {role === "PATIENT" ? (
                        <UserRound size={20} className={selectedRole === role ? "text-[#24AE7C]" : ""} />
                      ) : (
                        <Stethoscope size={20} className={selectedRole === role ? "text-[#24AE7C]" : ""} />
                      )}
                      <span className="font-medium capitalize">
                        {role === "PATIENT" ? "Patient" : "Doctor"}
                      </span>
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Full Name</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-xl border border-app-border-2 bg-app-surface-2 input-wrapper">
                  <Image src="/assets/icons/user.svg" alt="user" width={20} height={20} className="ml-3 shrink-0" />
                  <Input {...field} placeholder="John Doe" data-testid="register-name" className="border-0 bg-transparent text-app-text placeholder:text-dark-600 focus-visible:ring-0 focus-visible:outline-none" />
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Email</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-xl border border-app-border-2 bg-app-surface-2 input-wrapper">
                  <Image src="/assets/icons/email.svg" alt="email" width={20} height={20} className="ml-3 shrink-0" />
                  <Input {...field} type="email" placeholder="john@example.com" data-testid="register-email" className="border-0 bg-transparent text-app-text placeholder:text-dark-600 focus-visible:ring-0 focus-visible:outline-none" />
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Password</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-xl border border-app-border-2 bg-app-surface-2 input-wrapper pr-3">
                  <Image src="/assets/icons/user.svg" alt="lock" width={20} height={20} className="ml-3 shrink-0" />
                  <Input {...field} type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" data-testid="register-password" className="border-0 bg-transparent text-app-text placeholder:text-dark-600 focus-visible:ring-0 focus-visible:outline-none flex-1" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-app-muted hover:text-app-text transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Confirm Password</FormLabel>
              <FormControl>
                <div className="flex items-center rounded-xl border border-app-border-2 bg-app-surface-2 input-wrapper pr-3">
                  <Image src="/assets/icons/user.svg" alt="lock" width={20} height={20} className="ml-3 shrink-0" />
                  <Input {...field} type={showConfirm ? "text" : "password"} placeholder="Re-enter password" data-testid="register-confirm-password" className="border-0 bg-transparent text-app-text placeholder:text-dark-600 focus-visible:ring-0 focus-visible:outline-none flex-1" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-app-muted hover:text-app-text transition-colors">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )}
        />

        {error && (
          <p data-testid="register-error" className="rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          data-testid="register-submit"
          className="w-full bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold py-5 cursor-pointer transition-colors"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-app-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-[#24AE7C] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
}
