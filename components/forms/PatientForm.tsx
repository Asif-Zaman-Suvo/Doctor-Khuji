"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import CustomFormField from "../CustomFormField";
import { Form } from "@/components/ui/form";


export enum FormFieldTypes {
  USERNAME = "username",
  EMAIL = "email",
  PHONE = "phone",
  INPUT = "input",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  PHONE_INPUT = "phone-input",
  DATE_PICKER = "date-picker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const formSchema = z.object({
  username: z.string().min(2, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

const PatientForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there,</h1>
          <p className="text-dark-700">Get Started with Appointments.</p>
        </section>
        <CustomFormField
          name="name"
          label="Username"
          placeholder="Enter your username"
          iconSrc="/assets/icons/user.svg"
          fieldType={FormFieldTypes.INPUT}
          control={form.control}
          iconAlt="user"
        />
         <CustomFormField
          name="email"
          label="Email"
          placeholder="Enter your email"
          iconSrc="/assets/icons/email.svg"
          fieldType={FormFieldTypes.INPUT}
          control={form.control}
          iconAlt="email"
        />
        <CustomFormField
          name="phone"
          label="Phone"
          placeholder="Enter your phone number"
          iconSrc="/assets/icons/phone.svg"
          fieldType={FormFieldTypes.PHONE_INPUT}
          control={form.control}
          iconAlt="phone"
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
