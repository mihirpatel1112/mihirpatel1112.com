import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
} from "@/components/typography";
import Nav from "@/components/nav";

const navItems = [
  { title: 'Blogs', link: '/blogs' },
  { title: 'Articles', link: '/articles' },
  { title: 'Projects', link: '/projects' },
  { title: 'Books', link: '/books' },
  { title: 'Contact', link: '/contact' }
]

export default function Home() {
  return (
    <div className="p-8 space-y-4">
      
      <Nav items={navItems}/>
      
      {/* <TypographyH1>Heading 1 Sample</TypographyH1>
      <TypographyH2>Heading 2 Sample</TypographyH2>
      <TypographyH3>Heading 3 Sample</TypographyH3>
      <TypographyH4>Heading 4 Sample</TypographyH4>
      <TypographyP>This is a paragraph sample text.</TypographyP> */}
    </div>
  );
}
