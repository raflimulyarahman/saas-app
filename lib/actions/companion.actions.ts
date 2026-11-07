"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "../client";

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = createClient();

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, author })
    .select();

  if (error || !data)
    throw new Error(error?.message || "failed to create a companion");

  return data[0];
};
