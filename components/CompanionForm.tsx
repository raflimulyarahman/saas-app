"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createCompanion } from "@/lib/actions/companion.actions"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 characters."),
  subject: z.string().min(1, "Please select a subject."),
  topic: z.string().min(1, "Topic must be at least 1 characters."),
  voice: z.string().min(1, "Voice must be at least 1 characters."),
  style: z.string().min(1, "Style must be at least 1 characters."),
  duration: z.coerce.number().min(1, "Duration is required."),
})

const subjects = [
  { label: "Maths", value: "maths" },
  { label: "Science", value: "science" },
  { label: "Language", value: "language" },
  { label: "History", value: "history" },
  { label: "Coding", value: "coding" },
  { label: "Economics", value: "economics" },
]

type FormValues = z.input<typeof formSchema>
type FormOutput = z.output<typeof formSchema>

const CompanionForm = () => {
  const router = useRouter()
  const STORAGE_KEY = "companion_form_draft"

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
  })

  // 1. Baca draft dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY)
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        form.reset(parsed)
      } catch (e) {
        console.error("Failed to parse saved form draft:", e)
      }
    }
  }, [form])

  // 2. Simpan otomatis setiap ada perubahan di form
  useEffect(() => {
    const subscription = form.watch((values) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const companion = await createCompanion(values)

    if (companion) {
      localStorage.removeItem(STORAGE_KEY) // Hapus draft jika sudah berhasil dibuat
      router.push(`/companions/${companion.id}`)
    } else {
      console.log("Error: Failed to create a companion")
      router.push("/")
    }
  }

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
              className="input !h-auto min-h-24 py-2"
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
                  <SelectItem value="casual">Casual</SelectItem>
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

      <Button
        type="submit"
        className="w-full cursor-pointer !h-10 !bg-black hover:!bg-black/80 !text-white rounded-lg mb-20"
      >
        Build Your Companion
      </Button>
    </form>
  )
}

export default CompanionForm
