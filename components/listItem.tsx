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
import { TypographyH1, TypographyH2 } from "./typography";
import { Badge } from "./ui/badge";
import { sortListDateLatest } from "@/utils/date";

interface Article {
  title: string;
  description: string;
  url: string;
  tags: Array<string>;
  dateRead: string;
}

interface ListItemProps {
  list: Array<Article>;
  title: string;
  variant?: string;
}

export default function ListItem({
  list,
  title,
  variant = "muted",
}: ListItemProps) {
  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <TypographyH2>{title}</TypographyH2>
      {sortListDateLatest(list, "dateRead")
        .slice(0, 5)
        .map((li: Article, idx: number) => (
          <Item key={idx} variant={variant as "muted" | "default" | "outline"}>
            <ItemContent>
              <ItemTitle>{li.title}</ItemTitle>
              <ItemDescription>{li.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="sm" asChild>
                <a href={li.url} target="_blank" rel="noopener noreferrer">
                  See more <ArrowUpRightIcon />
                </a>
              </Button>
            </ItemActions>
            <ItemFooter>
              <div className="flex w-full flex-wrap gap-2">
                {li?.tags?.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </ItemFooter>
          </Item>
        ))}
    </div>
  );
}
