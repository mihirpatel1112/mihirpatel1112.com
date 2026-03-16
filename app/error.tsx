"use client";

import { Wrench } from "lucide-react";
import { useEffect } from "react";

import Paper from "@/components/paper";
import { TypographyH2, TypographyP } from "@/components/typography";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Paper>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 px-4">
        <div className="rounded-full bg-muted p-6">
          <Wrench className="size-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <TypographyH2 className="text-center">Under maintenance</TypographyH2>
          <TypographyP className="text-muted-foreground max-w-md text-center">
            The site is temporarily unavailable — likely because the database is
            sleeping to save cost. Check back in a few moments.
          </TypographyP>
        </div>
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
      </div>
    </Paper>
  );
}
