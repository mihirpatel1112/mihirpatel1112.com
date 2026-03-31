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
    <nav className="bg-background w-full">
      <div className="flex justify-between items-center mx-auto px-4 h-14">
        <div className="flex items-center gap-3">
          {!isHomePage && (
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Home
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6">
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
          className="md:hidden relative flex items-center gap-2"
        >
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex justify-center items-center hover:bg-muted rounded-md w-9 h-9 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {open && (
            <div className="top-11 right-0 z-50 absolute bg-background shadow-lg p-2 border border-border rounded-2xl min-w-[180px]">
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
