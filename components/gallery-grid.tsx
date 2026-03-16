"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface Photo {
  id: number;
  url: string;
  caption: string;
  altText: string;
}

export default function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  if (!photos?.length) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        No photos yet.
      </p>
    );
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setSelected(photo)}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-muted/20 text-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.altText || photo.caption || "Gallery photo"}
              loading="lazy"
              className="h-auto w-full rounded-2xl object-cover transition duration-300 group-hover:scale-[1.015]"
            />

            {photo.caption && (
              <div className="px-1 pt-2">
                <p className="text-sm text-muted-foreground">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div className="flex min-h-full items-center justify-center">
            <div
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.url}
                  alt={selected.altText || selected.caption || "Gallery photo"}
                  className="max-h-[88vh] w-full rounded-2xl object-contain"
                />
              </div>

              {selected.caption && (
                <p className="mt-3 text-center text-sm text-white/80">
                  {selected.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
