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
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 characters."),
  subject: z.string().min(1, "Please select a subject."),
  topic: z.string().min(1, "Topic must be at least 1 characters."),
  voice: z.string().min(1, "Voice must be at least 1 characters."),
  style: z.string().min(1, "Style must be at least 1 characters."),
  duration: z.coerce.number().min(1, "Duration is required."),
});

const subjects = [
  { label: "Math", value: "math" },
  { label: "Science", value: "science" },
  { label: "Language", value: "language" },
  { label: "History", value: "history" },
  { label: "Coding", value: "coding" },
];

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
            <FieldLabel htmlFor="name">Companion name</FieldLabel>
            <Input
              id="name"
              placeholder="Enter the companion name"
              {...field}
              className="input"
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="subject"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="subject">Subject</FieldLabel>

            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="input capitalize">
                <SelectValue placeholder="Select the subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {subjects.map((subject) => (
                    <SelectItem
                      key={subject.value}
                      value={subject.value}
                      className="capitalize"
                    >
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="topic"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="topic">
              What should the companion help with?
            </FieldLabel>
            <Textarea
              id="topic"
              placeholder="Ex. Derivates & Integrals"
              {...field}
              className="input"
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="voice"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="voice">Voice</FieldLabel>

            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="input">
                <SelectValue placeholder="Select the voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="style"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="style">Style</FieldLabel>

            <Select
              value={field.value}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="input">
                <SelectValue placeholder="Select the style" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="duration"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="duration">
              Estimated duration (minutes)
            </FieldLabel>
            <Input
              type="number"
              id="duration"
              placeholder="15"
              {...field}
              className="input"
              value={field.value as number}
            />
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Button type="submit" className="w-full cursor-pointer">
        Build Your Companion
      </Button>
    </form>
  );
};

export default CompanionForm;
