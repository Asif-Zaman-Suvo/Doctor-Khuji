"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateDoctorProfile } from "@/app/actions/doctor";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  specialty: z.string().min(2, "Required"),
  qualifications: z.string().min(2, "Required"),
  bio: z.string().optional(),
  consultationFee: z.coerce.number().min(1, "Required"),
  experience: z.coerce.number().min(0, "Required"),
  availableDays: z.array(z.string()).min(1, "Select at least one day"),
});

type FormValues = z.infer<typeof schema>;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Props { defaultValues: Partial<FormValues> }

export default function DoctorProfileForm({ defaultValues }: Props) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      specialty: defaultValues.specialty ?? "",
      qualifications: defaultValues.qualifications ?? "",
      bio: defaultValues.bio ?? "",
      consultationFee: defaultValues.consultationFee ?? 0,
      experience: defaultValues.experience ?? 0,
      availableDays: defaultValues.availableDays ?? [],
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setSuccess(false);
    await updateDoctorProfile(values);
    setSuccess(true);
    setLoading(false);
  }

  const inputCls = "bg-app-surface-2 border-app-border-2 text-app-text placeholder:text-app-subtle focus-visible:ring-[#24AE7C]";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <FormField control={form.control} name="specialty" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Specialty</FormLabel>
              <FormControl><Input {...field} placeholder="e.g. Cardiologist" className={inputCls} /></FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />

          <FormField control={form.control} name="qualifications" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Qualifications</FormLabel>
              <FormControl><Input {...field} placeholder="e.g. MBBS, MD" className={inputCls} /></FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />

          <FormField control={form.control} name="consultationFee" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Consultation Fee ($)</FormLabel>
              <FormControl><Input {...field} type="number" min={0} className={inputCls} /></FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />

          <FormField control={form.control} name="experience" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-app-muted">Experience (years)</FormLabel>
              <FormControl><Input {...field} type="number" min={0} className={inputCls} /></FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />

          <FormField control={form.control} name="bio" render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className="text-app-muted">Bio</FormLabel>
              <FormControl>
                <textarea {...field} rows={3} placeholder="Tell patients about yourself..." className="w-full rounded-md bg-app-surface-2 border border-app-border-2 text-app-text placeholder:text-app-subtle px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#24AE7C] resize-none" />
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />
        </div>

        {/* Available Days */}
        <FormField control={form.control} name="availableDays" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-app-muted">Available Days</FormLabel>
            <FormControl>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => {
                  const selected = field.value?.includes(day);
                  return (
                    <button key={day} type="button"
                      onClick={() => {
                        const newVal = selected
                          ? field.value.filter((d: string) => d !== day)
                          : [...(field.value || []), day];
                        field.onChange(newVal);
                      }}
                      className={`text-sm px-4 py-2 rounded-xl border-2 transition-all cursor-pointer ${
                        selected ? "border-[#24AE7C] bg-[#24AE7C]/10 text-[#24AE7C]" : "border-app-border text-app-muted hover:border-app-border-2"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage className="text-red-400 text-sm" />
          </FormItem>
        )} />

        {success && (
          <div className="flex items-center gap-2 bg-[#24AE7C]/10 border border-[#24AE7C]/30 rounded-xl px-4 py-3 text-sm text-[#24AE7C]">
            <CheckCircle size={16} /> Profile updated! Awaiting admin approval if not yet approved.
          </div>
        )}

        <Button type="submit" disabled={loading} className="bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-8 cursor-pointer">
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
