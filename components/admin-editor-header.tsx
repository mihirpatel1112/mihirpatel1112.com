"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AdminEditorHeader() {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <header className="flex items-center justify-between gap-4 py-4 border-b border-border mb-6 pt-8">
      <Link
        href="/admin/editor"
        className="text-lg font-semibold hover:underline"
      >
        Admin Panel
      </Link>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="size-4" />
        Logout
      </Button>
    </header>
  );
}
