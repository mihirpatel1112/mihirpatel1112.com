"use client";

import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import ThemeToggle from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function Nav({
  items,
}: {
  items: Array<{ title: string; link: string }>;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/home";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            {!isHomePage && (
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="flex flex-row gap-2 justify-center items-center"
                >
                  <ChevronLeftIcon /> Back
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-3">
        <NavigationMenu>
          <NavigationMenuList>
            {items.map((it, idx) => (
              <NavigationMenuItem key={idx}>
                <NavigationMenuLink asChild>
                  <Link href={it.link}>{it.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <ThemeToggle />
      </div>
    </div>
  );
}
