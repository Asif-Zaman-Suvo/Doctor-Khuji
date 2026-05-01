"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, CheckCircle, X } from "lucide-react";
import { uploadAvatarAction } from "@/app/actions/upload";

interface AvatarUploadProps {
  currentImage?: string | null;
  name?: string | null;
  size?: number;
}

export function AvatarUpload({ currentImage, name, size = 96 }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { setError("File must be under 5 MB"); return; }
    if (!file.type.startsWith("image/")) { setError("Only image files are allowed"); return; }

    setError("");
    setSuccess(false);
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAvatarAction(formData);

      if (result?.error) {
        setError(result.error);
        setPreview(currentImage ?? null);
      } else {
        setPreview(result.url ?? null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("Upload failed. Please try again.");
      setPreview(currentImage ?? null);
    } finally {
      setUploading(false);
      // reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative cursor-pointer group"
        style={{ width: size, height: size }}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <div
          className="w-full h-full rounded-full overflow-hidden border-2 border-app-border bg-app-surface-2 flex items-center justify-center relative"
        >
          {preview ? (
            <Image
              src={preview}
              alt={name ?? "Avatar"}
              fill
              className="object-cover rounded-full"
              unoptimized
            />
          ) : (
            <span className="text-[#24AE7C] font-bold" style={{ fontSize: size * 0.35 }}>
              {initials}
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {uploading
            ? <Loader2 size={20} className="text-white animate-spin" />
            : <Camera size={20} className="text-white" />
          }
        </div>

        {/* Success tick */}
        {success && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#24AE7C] flex items-center justify-center border-2 border-app-surface">
            <CheckCircle size={13} className="text-white" />
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <div className="text-center space-y-0.5">
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
          className="text-sm text-[#24AE7C] hover:underline font-medium disabled:opacity-50 cursor-pointer"
        >
          {uploading ? "Uploading..." : "Change Photo"}
        </button>
        <p className="text-xs text-app-subtle">JPG, PNG, WebP · max 5 MB</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-red-400 max-w-[200px] text-center">
          <X size={13} className="shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
