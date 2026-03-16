"use client";

import { ChevronLeftIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import ThemeToggle from "@/components/theme-toggle";

export default function Nav({
  items,
}: {
  items: Array<{ title: string; link: string }>;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/home";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <nav className="w-full bg-background">
      <div className="mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {!isHomePage && (
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Back
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {items.map((it) => {
            const active = pathname === it.link;

            return (
              <Link
                key={it.link}
                href={it.link}
                className={`text-sm transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {it.title}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>

        <div
          ref={menuRef}
          className="relative flex items-center gap-2 md:hidden"
        >
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {open && (
            <div className="absolute right-0 top-11 z-50 min-w-[180px] rounded-2xl bg-background p-2 shadow-lg ring-1 ring-black/5">
              <div className="flex flex-col">
                {items.map((it) => {
                  const active = pathname === it.link;

                  return (
                    <Link
                      key={it.link}
                      href={it.link}
                      className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {it.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
