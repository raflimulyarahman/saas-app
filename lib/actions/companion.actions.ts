"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase.admin"

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth()
  if (!author) throw new Error("Unauthorized")

  const { data, error } = await supabaseAdmin
    .from("companions")
    .insert({ ...formData, author })
    .select()

  if (error || !data)
    throw new Error(error?.message || "failed to create a companion")

  return data[0]
}

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = supabaseAdmin
  const { userId } = await auth()

  let query = supabase.from("companions").select()

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`)
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
  }

  query = query.range((page - 1) * limit, page * limit - 1)

  const { data: companions, error } = await query

  if (error) throw new Error(error.message)

  if (!userId || !companions?.length) {
    return companions.map((companion) => ({ ...companion, bookmarked: false }))
  }

  const companionIds = companions.map(({ id }) => id)

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("companion_id")
    .eq("user_id", userId)
    .in("companion_id", companionIds)

  const bookmarkedIds = new Set(bookmarks?.map((b) => b.companion_id) || [])

  return companions.map((companion) => ({
    ...companion,
    bookmarked: bookmarkedIds.has(companion.id),
  }))
}

export const getCompanion = async (id: string) => {
  const supabase = supabaseAdmin

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id)

  if (error) throw new Error(error.message)

  return data[0]
}

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth()
  const supabase = supabaseAdmin
  const { data, error } = await supabase
    .from("session_history")
    .insert({ companion_id: companionId, user_id: userId })

  if (error) throw new Error(error.message)

  return data
}

export const getRecentSessions = async (limit = 10) => {
  const supabase = supabaseAdmin
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions: companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return data.map(({ companions }) => companions)
}

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = supabaseAdmin
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions: companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return data.map(({ companions }) => companions)
}

export const getUserCompanions = async (userId: string) => {
  const supabase = supabaseAdmin
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("author", userId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data
}

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth()
  const supabase = supabaseAdmin

  let limit = 0

  if (has({ plan: "pro" })) {
    return true
  } else if (has({ feature: "3_companion_limit" })) {
    limit = 3
  } else if (has({ feature: "10_companion_limit" })) {
    limit = 10
  }

  const { data, error } = await supabase
    .from("companions")
    .select("id", { count: "exact" })
    .eq("author", userId)

  if (error) throw new Error(error.message)

  const companionCount = data?.length

  if (companionCount >= limit) {
    return false
  } else {
    return true
  }
}

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth()
  if (!userId) return

  const supabase = supabaseAdmin
  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      companion_id: companionId,
      user_id: userId,
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(path)
  return data
}

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth()
  if (!userId) return

  const supabase = supabaseAdmin
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(path)
  return data
}

export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = supabaseAdmin
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data.map(({ companions }) => companions)
}
