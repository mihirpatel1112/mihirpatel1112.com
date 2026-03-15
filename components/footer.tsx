"use client";

import { CopyrightIcon } from "lucide-react";
import { SocialLinkIcon } from "@/components/social-link-icon";
import { TypographyP } from "./typography";
import { socialLinks } from "@/constants/socialLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAboutPage = pathname === "/about";

  return (
    <div className="container flex flex-row justify-between items-center py-12">
      <Link
        href="/"
        className="flex flex-row items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <CopyrightIcon size={16} className="text-muted-foreground" />
        <TypographyP>Mihir Patel</TypographyP>
      </Link>

      <div className="flex flex-row items-center space-x-4">
        {socialLinks.map((sl, idx) => (
          <SocialLinkIcon key={idx} url={sl.url} size={24} />
        ))}
      </div>
    </div>
  );
}
