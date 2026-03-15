import type { Metadata } from "next";
import Paper from "@/components/paper";
import { TypographyH2 } from "@/components/typography";
import { getArticlesData } from "@/lib/articles";
import ListItem2 from "@/components/listItem2";

export const metadata = {
  title: "Articles",
};

export default async function Page() {
  const { heading, articles } = await getArticlesData();

  return (
    <Paper>
      <div className="flex flex-col justify-center text-center pt-8">
        <TypographyH2 className="text-center md:text-left">
          {heading}
        </TypographyH2>
        <ListItem2 list={articles} />
      </div>
    </Paper>
  );
}
