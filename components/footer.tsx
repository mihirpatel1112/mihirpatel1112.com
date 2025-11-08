import { CopyrightIcon } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { TypographyH4, TypographyP } from "./typography";
import { socialLinks } from "@/constants/socialLinks";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="container flex flex-row justify-between items-center py-12">
      <Link href="/" className="flex flex-row items-center space-x-2 hover:opacity-80 transition-opacity">
        <CopyrightIcon size={16} className="text-muted-foreground" />
        <TypographyP>Mihir Patel</TypographyP>
      </Link>

      <div className="flex flex-row items-center space-x-2">
        {socialLinks.map((sl, idx) => (
          <SocialIcon
            key={idx}
            url={sl.url}
            style={{ height: 32, width: 32 }}
            bgColor="#000000"
            fgColor="#ffffff"
            target="_blank"
            rel="noopener noreferrer"
          />
        ))}
      </div>
    </div>
  );
}
