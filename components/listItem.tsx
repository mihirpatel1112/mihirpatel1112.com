import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "./ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import { TypographyH1 } from "./typography";

export default function ListItem({
  list,
}: {
  list: Array<{ title: string; description: string; url: string }>;
}) {
  return (
    <div className="flex flex-col gap-6 max-w-xl">
        <TypographyH1>Articles</TypographyH1>
      {list.map((li, idx) => (
        <Item key={idx} variant="muted">
          <ItemContent>
            <ItemTitle>{li.title}</ItemTitle>
            <ItemDescription>{li.description}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="sm" asChild>
              <a href={li.url}>
                See more <ArrowUpRightIcon />
              </a>
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}
