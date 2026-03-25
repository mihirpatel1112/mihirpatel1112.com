import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Paper from "@/components/paper";
import ProjectCard from "@/components/projectCard";
import { TypographyH2 } from "@/components/typography";
import { getProjectsData } from "@/lib/projects";
import { isPageEnabled } from "@/lib/page-settings";

export const metadata = {
  title: "Projects",
};

export default async function Page() {
  if (!(await isPageEnabled("projects"))) notFound();
  const { heading, projects } = await getProjectsData();

  return (
    <Paper>
      <div className="flex flex-col gap-6 pt-8">
        {heading && (
          <TypographyH2 className="text-center md:text-left">
            {heading}
          </TypographyH2>
        )}
        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, idx) => (
              <ProjectCard key={idx} {...project} />
            ))}
          </div>
        ) : null}
      </div>
    </Paper>
  );
}
