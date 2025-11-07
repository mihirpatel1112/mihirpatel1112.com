import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
} from "@/components/typography";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Paper from "@/components/paper";
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
import { Label } from "@/components/ui/label";
import PreviewCard from "@/components/previewCard";
import Hero from "@/components/hero";
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
import ListItem from "@/components/listItem";

const navItems = [
  { title: "Blog", link: "/blog" },
  { title: "Article", link: "/article" },
  { title: "Project", link: "/project" },
  { title: "About", link: "/about" },
];

const articlesPreview = [
  { title: "Sample Item 1", description: "This is a sample description for item 1", url: "/item-1" },
  { title: "Sample Item 2", description: "This is a sample description for item 2", url: "/item-2" },
  { title: "Sample Item 3", description: "This is a sample description for item 3", url: "/item-3" },
];


export default function Home() {
  return (
    <Paper>
      
      <Nav items={navItems} />

      <Hero />

      <ListItem list={articlesPreview} />

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
