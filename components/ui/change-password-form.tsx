"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { changePassword } from "@/app/actions/auth";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError("");
    setSuccess(false);
    const res = await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      form.reset();
    }
    setLoading(false);
  }

  const inputCls = "border-0 bg-transparent text-app-text placeholder:text-app-subtle focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 shadow-none";

  const eye = (key: keyof typeof show) => (
    <button
      type="button"
      onClick={() => setShow((s) => ({ ...s, [key]: !s[key] }))}
      className="text-app-muted hover:text-app-text transition-colors pr-1"
    >
      {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div className="bg-app-surface border border-app-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Lock size={18} className="text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-app-text">Change Password</h2>
          <p className="text-xs text-app-subtle">Keep your account secure</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="currentPassword" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted text-sm">Current Password</FormLabel>
              <FormControl>
                <div className="flex items-center border border-[#24AE7C]/30 rounded-xl bg-app-surface-2 pr-3 focus-within:border-[#24AE7C]/60 transition-colors">
                  <Input
                    {...field}
                    type={show.current ? "text" : "password"}
                    placeholder="Enter current password"
                    className={inputCls}
                  />
                  {eye("current")}
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )} />

          <FormField control={form.control} name="newPassword" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted text-sm">New Password</FormLabel>
              <FormControl>
                <div className="flex items-center border border-[#24AE7C]/30 rounded-xl bg-app-surface-2 pr-3 focus-within:border-[#24AE7C]/60 transition-colors">
                  <Input
                    {...field}
                    type={show.new ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className={inputCls}
                  />
                  {eye("new")}
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )} />

          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted text-sm">Confirm New Password</FormLabel>
              <FormControl>
                <div className="flex items-center border border-[#24AE7C]/30 rounded-xl bg-app-surface-2 pr-3 focus-within:border-[#24AE7C]/60 transition-colors">
                  <Input
                    {...field}
                    type={show.confirm ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className={inputCls}
                  />
                  {eye("confirm")}
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )} />

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-[#24AE7C] bg-[#24AE7C]/10 border border-[#24AE7C]/20 rounded-xl px-4 py-2.5">
              <CheckCircle size={15} /> Password updated successfully!
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-7 cursor-pointer"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
