"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePatientProfile, updateUserInfo } from "@/app/actions/patient";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultValues: FormValues;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["Male", "Female", "Other", "Prefer not to say"];

export default function PatientProfileForm({ defaultValues }: Props) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setSuccess(false);
    await updateUserInfo({ name: values.name, phone: values.phone });
    await updatePatientProfile({
      dateOfBirth: values.dateOfBirth,
      bloodGroup: values.bloodGroup,
      gender: values.gender,
      address: values.address,
    });
    setSuccess(true);
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#ABB8C4]">Full Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-[#1A1D21] border-[#363A3D] text-white placeholder:text-[#76828D] focus-visible:ring-[#24AE7C]" />
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />

          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#ABB8C4]">Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="+880..." className="bg-[#1A1D21] border-[#363A3D] text-white placeholder:text-[#76828D] focus-visible:ring-[#24AE7C]" />
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />

          <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#ABB8C4]">Date of Birth</FormLabel>
              <FormControl>
                <Input {...field} type="date" className="bg-[#1A1D21] border-[#363A3D] text-white focus-visible:ring-[#24AE7C] [color-scheme:dark]" />
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />

          <FormField control={form.control} name="bloodGroup" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#ABB8C4]">Blood Group</FormLabel>
              <FormControl>
                <select {...field} className="w-full h-10 rounded-md bg-[#1A1D21] border border-[#363A3D] text-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#24AE7C]">
                  <option value="">Select blood group</option>
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />

          <FormField control={form.control} name="gender" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#ABB8C4]">Gender</FormLabel>
              <FormControl>
                <select {...field} className="w-full h-10 rounded-md bg-[#1A1D21] border border-[#363A3D] text-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#24AE7C]">
                  <option value="">Select gender</option>
                  {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />

          <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className="text-[#ABB8C4]">Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your full address" className="bg-[#1A1D21] border-[#363A3D] text-white placeholder:text-[#76828D] focus-visible:ring-[#24AE7C]" />
              </FormControl>
              <FormMessage className="text-red-400 text-sm" />
            </FormItem>
          )} />
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-[#24AE7C]/10 border border-[#24AE7C]/30 rounded-xl px-4 py-3 text-sm text-[#24AE7C]">
            <CheckCircle size={16} /> Profile updated successfully!
          </div>
        )}

        <Button type="submit" disabled={loading} className="bg-[#24AE7C] hover:bg-[#1d9268] text-white font-semibold px-8 py-2.5 cursor-pointer">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
