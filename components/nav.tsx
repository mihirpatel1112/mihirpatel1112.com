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

export default function Nav({
  items,
}: {
  items: Array<{ title: string; link: string }>;
}) {
  return (
    <div className="flex justify-end">
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
