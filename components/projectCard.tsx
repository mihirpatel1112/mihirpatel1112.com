import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH3, TypographyP } from "./typography";
import { Badge } from "./ui/badge";
import { SocialIcon } from "react-social-icons";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  year?: string;
}

export default function ProjectCard({
  title,
  description,
  tags,
  githubUrl,
  liveUrl,
  year,
}: ProjectCardProps) {
  return (
    <Card className="relative w-full overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-4 bg-black" />

      <CardHeader className="pt-8">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="flex-1">
            <TypographyH3 className="text-2xl md:text-3xl font-extrabold">
              {title}
            </TypographyH3>
          </CardTitle>
          {year && (
            <div className="shrink-0">
              <Badge variant="outline" className="font-bold text-sm">
                {year}
              </Badge>
            </div>
          )}
        </div>
        <CardDescription className="pt-4">
          <TypographyP className="text-base md:text-lg text-muted-foreground leading-relaxed !mt-0">
            {description}
          </TypographyP>
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 text-xs font-semibold"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {(githubUrl || liveUrl) && (
        <CardFooter className="gap-3 pt-4 border-t justify-end">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-2 py-1 bg-black text-white rounded-md hover:opacity-80 transition-opacity"
            >
              <SocialIcon
                url={githubUrl}
                style={{ height: 32, width: 32 }}
                bgColor="transparent"
                fgColor="#ffffff"
                as="span"
              />
              <span className="text-sm font-medium">View Code</span>
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-2 py-1 bg-black text-white rounded-md hover:opacity-80 transition-opacity"
            >
              <SocialIcon
                url={liveUrl}
                style={{ height: 32, width: 32 }}
                bgColor="transparent"
                fgColor="#ffffff"
                as="span"
              />
              <span className="text-sm font-medium">View Live</span>
            </a>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
