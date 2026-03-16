import Footer from "@/components/footer";
import Hero from "@/components/hero";
import ListItem from "@/components/listItem";
import Nav from "@/components/nav";
import Paper from "@/components/paper";
import PreviewCard from "@/components/previewCard";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
} from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { getArticlesData } from "@/lib/articles";

export default async function Home() {
  const { heading, articles } = await getArticlesData();

  return (
    <Paper>
      <Hero />

      <ListItem title={heading} variant="outline" list={articles} />

      {/* <PreviewCard title="test" description="test" url="/"/> */}

      {/* <Footer /> */}

      {/* <TypographyH1>Heading 1 Sample</TypographyH1>
      <TypographyH2>Heading 2 Sample</TypographyH2>
      <TypographyH3>Heading 3 Sample</TypographyH3>
      <TypographyH4>Heading 4 Sample</TypographyH4>
      <TypographyP>This is a paragraph sample text.</TypographyP> */}
    </Paper>
  );
}
