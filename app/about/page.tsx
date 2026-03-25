import { notFound } from "next/navigation";
import { Award, BookOpen, ExternalLink, Link2, Sparkles } from "lucide-react";
import type { Metadata } from "next";

import Paper from "@/components/paper";
import { SocialLinkIcon } from "@/components/social-link-icon";
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAboutData } from "@/lib/about";
import { isPageEnabled } from "@/lib/page-settings";

export const metadata = {
  title: "About",
};

export default async function Page() {
  if (!(await isPageEnabled("about"))) notFound();
  const { intro, hobbies, books, socialLinks, certifications } =
    await getAboutData();

  return (
    <Paper>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto pt-8">
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
              <SectionHeading
                title="Things I Like to Do"
                IconComponent={Sparkles}
              />
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
              <SectionHeading
                title="Books I've Been Reading"
                IconComponent={BookOpen}
              />
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

        {certifications.length > 0 && (
          <>
            <Separator />
            {/* Certifications Section */}
            <div className="flex flex-col gap-4">
              <SectionHeading title="Certifications" IconComponent={Award} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {certifications.map((cert, idx) => (
                  <Card
                    key={idx}
                    className="flex flex-col justify-between gap-0"
                  >
                    <CardHeader className="pb-3">
                      {cert.url && (
                        <div className="flex justify-end">
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Verify ${cert.name}`}
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <ExternalLink size={15} />
                          </a>
                        </div>
                      )}
                      <CardTitle className="text-base leading-snug">
                        {cert.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {cert.issuer}
                      </CardDescription>
                    </CardHeader>

                    {(cert.issuedDate || cert.credentialId) && (
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                          {cert.issuedDate && (
                            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {cert.issuedDate}
                            </span>
                          )}
                          {cert.credentialId && (
                            <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                              {cert.credentialId}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    )}
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
              <SectionHeading title="Connect With Me" IconComponent={Link2} />
              <div className="flex flex-wrap gap-3 justify-start">
                {socialLinks.map((link, idx) => (
                  <div
                    key={`${link.url}-${idx}`}
                    className="flex items-center justify-center rounded-xl border bg-card p-3 sm:p-4 transition-colors hover:bg-accent"
                  >
                    <SocialLinkIcon
                      url={link.url}
                      size={32}
                      className="sm:w-10 sm:h-10"
                    />
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
    className?: string;
  }>;
}) {
  return (
    <div className="flex flex-row items-center gap-3">
      <div className="flex shrink-0 items-center justify-center rounded-lg bg-muted/80 p-2">
        <IconComponent size={20} className="text-muted-foreground" />
      </div>
      <TypographyH3>{title}</TypographyH3>
    </div>
  );
}
