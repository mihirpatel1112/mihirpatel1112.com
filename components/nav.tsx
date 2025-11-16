"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

export default function Nav({
  items,
}: {
  items: Array<{ title: string; link: string }>;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/home";

  return (
    <div className="flex justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            {!isHomePage && (
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="flex flex-row gap-2 justify-center items-center"
                >
                  <ChevronLeftIcon /> Back to home
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
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
    </div>
  );
}
