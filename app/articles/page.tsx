import Paper from "@/components/paper";
import { TypographyH2 } from "@/components/typography";
import { articles, heading } from "@/constants/articles";
import ListItem2 from "@/components/listItem2";

export default function Page() {
  return (
    <Paper>
      <div className="flex flex-col justify-center text-center">
        <TypographyH2 className="text-center md:text-left">
          {heading}
        </TypographyH2>
        <ListItem2 list={articles} />
      </div>
    </Paper>
  );
}
