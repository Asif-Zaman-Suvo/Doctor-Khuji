"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

const PatientForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#ABB8C4]">Full name</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image src="/assets/icons/user.svg" alt="user" width={20} height={20} />
                  </span>
                  <Input
                    {...field}
                    className="w-full rounded-md border border-[#363A3D] px-10 py-2 text-white bg-transparent"
                    placeholder="Adrian Hajdin"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#ABB8C4]">Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image src="/assets/icons/email.svg" alt="email" width={20} height={20} />
                  </span>
                  <Input
                    {...field}
                    className="w-full rounded-md border border-[#363A3D] px-10 py-2 text-white bg-transparent"
                    placeholder="user@gmail.com"
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
              <FormLabel className="text-[#ABB8C4]">Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image src="/assets/icons/user.svg" alt="phone" width={20} height={20} />
                  </span>
                  <Input
                    {...field}
                    className="w-full rounded-md border border-[#363A3D] px-10 py-2 text-white bg-transparent"
                    placeholder="+00 0342 0453 34"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#24AE7C] text-white py-2 rounded mt-4 font-semibold cursor-pointer"
        >
          Get Started
        </Button>
      </form>
    </Form>
  );
};

export default PatientForm;
