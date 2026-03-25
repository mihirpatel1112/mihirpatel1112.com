import { notFound } from "next/navigation";
import ListItem2 from "@/components/listItem2";
import Paper from "@/components/paper";
import { TypographyH2 } from "@/components/typography";
import { getArticlesData } from "@/lib/articles";
import { isPageEnabled } from "@/lib/page-settings";

export const metadata = {
  title: "Articles",
};

export default async function Page() {
  if (!(await isPageEnabled("articles"))) notFound();
  const { heading, articles } = await getArticlesData();

  return (
    <Paper>
      <div className="flex flex-col justify-center pt-8 text-center">
        <TypographyH2 className="md:text-left text-center">
          {heading}
        </TypographyH2>
        <ListItem2 list={articles} />
      </div>
    </Paper>
  );
}
