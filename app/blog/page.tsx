import type { Metadata } from "next";
import Paper from "@/components/paper";

export const metadata: Metadata = {
  title: "Blog",
};

export default function Page() {
  return <Paper>Blog</Paper>;
}
