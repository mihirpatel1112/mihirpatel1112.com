import Paper from "@/components/paper";
import ProjectCard from "@/components/projectCard";
import { TypographyH2 } from "@/components/typography";
import { projects } from "@/constants/projects";

export default function Page() {
  return (
    <Paper>
      <div className="flex flex-col gap-6">
        <TypographyH2 className="text-center md:text-left">
          Projects I&apos;ve Done or Been Doing
        </TypographyH2>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, idx) => (
            <ProjectCard key={idx} {...project} />
          ))}
        </div>
      </div>
    </Paper>
  );
}
