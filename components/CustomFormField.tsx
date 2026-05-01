/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { FormFieldTypes } from "./forms/PatientForm";
import { Input } from "./ui/input";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldTypes;
  iconAlt?: string;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const { iconSrc, iconAlt, fieldType, placeholder } = props;
  switch (fieldType) {
    case FormFieldTypes.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-[#000]">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt || "icon"}
              width={24}
              height={24}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              value={field.value || ""}
              className="border-0 bg-transparent text-app-text placeholder:text-dark-600 focus-visible:ring-0 focus-visible:outline-none"
            />
          </FormControl>
        </div>
      );

    case FormFieldTypes.PHONE_INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-[#000]">
          <FormControl>
            <PhoneInput
              defaultCountry="BD"
              international
              withCountryCallingCode
              value={field.value || ""}
              placeholder={placeholder}
              {...field}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
              className="border-0 py-2 px-3 bg-transparent text-app-text placeholder:text-dark-600 w-full focus-visible:ring-0 focus-visible:outline-none"
            />
          </FormControl>
        </div>
      );

    default:
      break;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldTypes.CHECKBOX && label && (
            <FormLabel className="text-app-muted">{label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className="text-red-500 text-sm" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
