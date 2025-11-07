import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH2, TypographyH4 } from "./typography";
import { Button } from "./ui/button";
import { ArrowUpRightIcon } from "lucide-react";

export default function PreviewCard({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <TypographyH2>{title}</TypographyH2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <TypographyH4>{description}</TypographyH4>
        </CardDescription>
      </CardContent>
      <CardFooter>
        <CardAction>
          <Button variant="ghost" asChild>
            <a href={url}>
              See more <ArrowUpRightIcon />
            </a>
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
