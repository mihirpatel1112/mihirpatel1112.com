import type { Metadata } from "next";
import Paper from "@/components/paper";
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from "@/components/typography";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAboutData } from "@/lib/about";
import { SocialLinkIcon } from "@/components/social-link-icon";

export const metadata = {
  title: "About",
};

export default async function Page() {
  const { intro, hobbies, books, socialLinks } = await getAboutData();

  return (
    <Paper>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center md:text-left">
          <TypographyH2>About Me</TypographyH2>
          {intro && (
            <TypographyP className="mt-4 text-muted-foreground">
              {intro}
            </TypographyP>
          )}
        </div>

        {hobbies.length > 0 && (
          <>
            <Separator />
            {/* Hobbies Section */}
            <div className="flex flex-col gap-4">
              <TypographyH3>Things I Like to Do</TypographyH3>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-sm px-4 py-2"
                  >
                    {hobby}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {books.length > 0 && (
          <>
            <Separator />
            {/* Books Section */}
            <div className="flex flex-col gap-4">
              <TypographyH3>Books I&apos;ve Been Reading</TypographyH3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {books.map((book, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-4">
              <TypographyH3>Connect With Me</TypographyH3>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {socialLinks.map((link, idx) => (
                  <div
                    key={`${link.url}-${idx}`}
                    className="flex items-center justify-center rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
                  >
                    <SocialLinkIcon url={link.url} size={40} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Paper>
  );
}

function SectionHeading({
  title,
  IconComponent,
}: {
  title: string;
  IconComponent: React.ComponentType<{
    fill?: string;
    stroke?: string;
    size?: number;
  }>;
}) {
  return (
    <div className="flex flex-row items-center gap-4">
      <IconComponent size={32} />
      <TypographyH3>{title}</TypographyH3>
    </div>
  );
}
