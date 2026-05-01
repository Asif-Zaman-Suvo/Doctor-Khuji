"use server";

import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateUserAvatar } from "@/app/actions/auth";

export async function uploadAvatarAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided" };

  if (file.size > 5 * 1024 * 1024) return { error: "File must be under 5 MB" };
  if (!file.type.startsWith("image/")) return { error: "Only image files allowed" };

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${session.user.id}-${Date.now()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) return { error: uploadError.message };

  const { data: publicData } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(data.path);

  const result = await updateUserAvatar(publicData.publicUrl);
  if (result?.error) return { error: result.error };

  return { success: true, url: publicData.publicUrl };
}
