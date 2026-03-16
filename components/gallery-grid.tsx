"use client";

import { useState } from "react";

interface Photo {
  id: number;
  url: string;
  caption: string;
  altText: string;
}

export default function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);

  if (photos.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        No photos yet. Add some from the admin panel.
      </p>
    );
  }

  return (
    <>
      <div
        className="columns-2 gap-3 sm:columns-3 lg:columns-4"
        style={{ columnFill: "balance" }}
      >
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            className="mb-3 break-inside-avoid block w-full cursor-pointer text-left"
            onClick={() => setSelected(photo)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.altText || "Gallery photo"}
              className="w-full rounded-lg"
            />
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-white/80 hover:text-white"
            onClick={() => setSelected(null)}
            aria-label="Close"
          >
            <svg
              className="size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.url}
            alt={selected.altText || "Gallery photo"}
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
