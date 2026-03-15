import Paper from "@/components/paper";
import ProjectCard from "@/components/projectCard";
import { TypographyH2 } from "@/components/typography";
import { getProjectsData } from "@/lib/projects";

export default async function Page() {
  const { heading, projects } = await getProjectsData();

  return (
    <Paper>
      <div className="flex flex-col gap-6">
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
