"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateDoctorUserInfo } from "@/app/actions/doctor";
import { CheckCircle, Settings } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().optional(),
});

interface Props {
  defaultValues: { name: string; phone: string };
}

export default function DoctorSettingsInfoForm({ defaultValues }: Props) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setLoading(true);
    setSuccess(false);
    await updateDoctorUserInfo(values);
    setSuccess(true);
    setLoading(false);
  }

  const inputCls = "bg-app-surface-2 border-app-border-2 text-app-text placeholder:text-app-subtle focus-visible:ring-[#24AE7C]";

  return (
    <div className="bg-app-surface border border-app-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#24AE7C]/10 flex items-center justify-center">
          <Settings size={20} className="text-[#24AE7C]" />
        </div>
        <h2 className="text-base font-semibold text-app-text">Personal Information</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Full Name</FormLabel>
              <FormControl><Input {...field} className={inputCls} /></FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Phone</FormLabel>
              <FormControl><Input {...field} placeholder="+880..." className={inputCls} /></FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />
          {success && (
            <div className="flex items-center gap-2 bg-[#24AE7C]/10 border border-[#24AE7C]/30 rounded-xl px-4 py-3 text-sm text-[#24AE7C]">
              <CheckCircle size={16} /> Settings saved!
            </div>
          )}
          <Button type="submit" disabled={loading} className="bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-8 cursor-pointer">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
