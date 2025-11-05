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

const navItems = [
  { title: 'Blog', link: '/blog' },
  { title: 'Article', link: '/article' },
  { title: 'Project', link: '/project' },
  { title: 'About', link: '/about' },
]

export default function Home() {
  return (
    <Paper>

      <Footer />
      
      {/* <Nav items={navItems}/> */}
      
      {/* <TypographyH1>Heading 1 Sample</TypographyH1>
      <TypographyH2>Heading 2 Sample</TypographyH2>
      <TypographyH3>Heading 3 Sample</TypographyH3>
      <TypographyH4>Heading 4 Sample</TypographyH4>
      <TypographyP>This is a paragraph sample text.</TypographyP> */}
    </Paper>
  );
}
