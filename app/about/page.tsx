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
  { title: "Atomic Habits", author: "James Clear" },
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt" },
  { title: "Deep Work", author: "Cal Newport" },
];

const hobbies = [
  "Photography",
  "Hiking",
  "Reading",
  "Coding",
  "Coffee Brewing",
  "Travel",
];

const experience = [
  {
    role: "Senior Software Engineer",
    company: "Tech Corp",
    period: "2023 - Present",
    description:
      "Leading development of scalable web applications using modern technologies. Mentoring junior developers and architecting solutions for complex problems.",
  },
  {
    role: "Full Stack Developer",
    company: "StartUp Inc",
    period: "2021 - 2023",
    description:
      "Built and maintained multiple web applications. Collaborated with cross-functional teams to deliver high-quality software products.",
  },
  {
    role: "Junior Developer",
    company: "Digital Solutions",
    period: "2019 - 2021",
    description:
      "Developed responsive web interfaces and worked on various client projects. Gained experience in modern web technologies and best practices.",
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
            Hi! I&apos;m a passionate software engineer who loves building
            elegant solutions to complex problems. When I&apos;m not coding,
            you&apos;ll find me exploring new places, reading books, or
            experimenting with new technologies. I believe in continuous
            learning and sharing knowledge with the community.
          </TypographyP>
        </div>

        <Separator />

        {/* Books Section */}
        <div className="flex flex-col gap-4">
          <TypographyH3>Books I&apos;m Reading</TypographyH3>
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
      </div>
    </Paper>
  );
}
