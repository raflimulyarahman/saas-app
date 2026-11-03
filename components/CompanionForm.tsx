"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 characters."),
  subject: z.string().min(1, "Subject must be at least 1 characters."),
  topic: z.string().min(1, "Topic must be at least 1 characters."),
  voice: z.string().min(1, "Voice must be at least 1 characters."),
  style: z.string().min(1, "Style must be at least 1 characters."),
  duration: z.coerce.number().min(1, "Duration is required."),
});

type FormValues = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const CompanionForm = () => {
  const form = useForm<FormValues, any, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: 15,
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="name">Companion Name</FieldLabel>
            <Input
              id="name"
              placeholder="e.g. Neura the Brainy Explorer"
              {...field}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Button type="submit" className="w-full">
        Build Your Companion
      </Button>
    </form>
  );
};

export default CompanionForm;
