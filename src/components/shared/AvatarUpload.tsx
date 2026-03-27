"use client";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase";

type Props = {
  userId: string;
  name: string;
  currentUrl?: string;
  onUpdate: (url: string) => void;
};

export default function AvatarUpload({ userId, name, currentUrl, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      // Fixed path per user — upsert always replaces the same object
      const path = `${userId}/avatar`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        setError("Upload failed: " + uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      // Cache-bust so the browser fetches the new image
      const urlWithBust = `${publicUrl}?t=${Date.now()}`;

      await supabase
        .from("profiles")
        .update({ avatar_url: urlWithBust })
        .eq("id", userId);

      onUpdate(urlWithBust);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-slate-200 dark:ring-[#1e3356] hover:ring-[#2563eb] dark:hover:ring-[#3b82f6] transition-all group cursor-pointer"
        title="Change profile picture"
      >
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#2563eb] dark:bg-[#3b82f6] flex items-center justify-center text-white font-bold text-xl select-none">
            {initials}
          </div>
        )}
        {/* Hover / loading overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {uploading ? (
            <svg
              className="w-5 h-5 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </div>
      </button>
      {error && <p className="text-xs text-red-500 text-center max-w-[120px]">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
