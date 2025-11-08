import Paper from "@/components/paper";
import { TypographyH2 } from "@/components/typography";
import { articles, heading } from "@/constants/articles";

export default function Page() {
  return (
    <Paper>
      <TypographyH2>{heading}</TypographyH2>
    </Paper>
  );
}
