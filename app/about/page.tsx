import Paper from "@/components/paper";
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from "@/components/typography";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const booksReading = [
  { title: "Man's Search for Meaning", author: "Viktor Frankl" },
  { title: "Outliers", author: "Malcolm Gladwell" },
  { title: "Steve Jobs", author: "Walter Isaacson" },
  { title: "Sherlock Holmes", author: "Arthur Conan Doyle" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
  { title: "The Blind Watchmaker", author: "Richard Dawkins" },
  { title: "Cosmos", author: "Carl Sagan" },
];

const hobbies = [
  "Reading",
  "Coding",
  "Cloud Technologies",
  "Problem Solving",
  "Learning New Tech",
  "System Architecture",
];

const experience = [
  {
    role: "Junior Software Developer",
    company: "Funeral Tech (HParsons Pty Ltd)",
    period: "Nov 2024 - Present",
    description:
      "Managing and optimising AWS cloud infrastructure for deployment, scalability, and security of all web applications, ensuring high availability and reliability. Maintaining and enhancing internal CRM software and websites by developing clean, modular PHP backends (MVC) and modern React frontends. Working in Agile team, contributing to project timelines, documentation, knowledge base, system flow diagrams, and supporting the full development lifecycle from coding and testing to launching and post-launch support.",
  },
  {
    role: "Web Application Intern",
    company: "Luxury Chauffeur and Tours Pty Ltd",
    period: "Aug 2024 - Nov 2024",
    description:
      "Developed and deployed a modern travel booking system using Next.js, replacing the legacy WordPress setup. Implemented CI/CD pipelines via Vercel and GitHub, achieving a 65% reduction in page load time and improved website performance and user experience. Collaborated with the SEO team to restructure and optimise website content, leading to a 40% increase in organic traffic and improving SERP rankings from page 3 to page 1 for high-value service keywords.",
  },
];

export default function Page() {
  return (
    <Paper>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center md:text-left">
          <TypographyH2>About Me</TypographyH2>
          <TypographyP className="mt-4 text-muted-foreground">
            Hi! I&apos;m Mihir Patel, a computer science graduate from the
            University of Wollongong with a major in Cybersecurity. I&apos;m
            currently working as a Junior Software Developer, specializing in
            full-stack development, cloud infrastructure, and modern web
            technologies. I hold multiple cloud certifications including AWS
            Solutions Architect Associate and Azure AI Engineer Associate. When
            I&apos;m not coding, you&apos;ll find me reading books on
            technology, psychology, and science, or experimenting with new cloud
            technologies and system architectures.
          </TypographyP>
        </div>

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

        <Separator />

        {/* Experience Section */}
        <div className="flex flex-col gap-6">
          <TypographyH3>Experience & Work</TypographyH3>
          <div className="flex flex-col gap-4">
            {experience.map((job, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-xl">{job.role}</CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="font-medium">{job.company}</span>
                    <span className="text-xs">{job.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Books Section */}
        <div className="flex flex-col gap-4">
          <TypographyH3>Books I&apos;ve Been Reading</TypographyH3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {booksReading.map((book, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Paper>
  );
}
