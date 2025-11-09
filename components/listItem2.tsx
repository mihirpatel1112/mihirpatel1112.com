import { TypographyH3, TypographyH4, TypographyP } from "./typography";
import { Separator } from "./ui/separator";
import { breakListIntoYears } from "@/utils/date";

interface Article {
  title: string;
  description: string;
  url: string;
  tags: Array<string>;
  dateRead: string;
}

interface ListItem2Props {
  list: Array<Article>;
}

export default function ListItem2({ list }: ListItem2Props) {
  return (
    <div>
      {breakListIntoYears(list, "dateRead").map((yearGroup, yearIdx) => (
        <div key={yearIdx}>
          <TypographyH3 className="text-center py-2 text-lg md:text-2xl md:py-4 font-extrabold">
            {yearGroup.year}
          </TypographyH3>
          {yearGroup.items.map((li: Article, idx: number) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2 sm:py-1"
            >
              <TypographyP className="shrink-0">{li.title}</TypographyP>
              <Separator className="hidden sm:block flex-1 bg-black" />
              <TypographyP className="text-sm sm:text-base text-muted-foreground sm:text-foreground flex-shrink-0">
                {li.dateRead}
              </TypographyP>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
