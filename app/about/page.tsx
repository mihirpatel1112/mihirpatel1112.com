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
import {
  CircleUserIcon,
  HeadphonesIcon,
  BriefcaseBusinessIcon,
  BookIcon,
  NetworkIcon,
} from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { socialLinks } from "@/constants/socialLinks";

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
    period: {
      start: "Nov 2024",
      end: "Present",
    },
    description: [
      "Managing and optimising AWS cloud infrastructure for deployment, scalability, and security of all web applications, ensuring high availability and reliability.",
      "Maintaining and enhancing internal CRM software and websites by developing clean, modular PHP backends (MVC) and modern React frontends.",
      "Working in Agile team, contributing to project timelines, documentation, knowledge base, system flow diagrams, and supporting the full development lifecycle from coding and testing to launching and post-launch support.",
    ],
  },
  {
    role: "Web Application Intern",
    company: "Luxury Chauffeur and Tours Pty Ltd",
    period: {
      start: "Aug 2024",
      end: "Nov 2024",
    },
    description: [
      "Developed and deployed a modern travel booking system using Next.js, replacing the legacy WordPress setup.",
      "Implemented CI/CD pipelines via Vercel and GitHub, achieving a 65% reduction in page load time and improved website performance and user experience.",
      "Collaborated with the SEO team to restructure and optimise website content, leading to a 40% increase in organic traffic and improving SERP rankings from page 3 to page 1 for high-value service keywords.",
    ],
  },
];

const aboutMe = `Hi! I'm Mihir Patel, a computer science graduate from the
            University of Wollongong with a major in Cybersecurity. I'm
            currently working as a Junior Software Developer, specializing in
            full-stack development, cloud infrastructure, and modern web
            technologies. I hold multiple cloud certifications including AWS
            Solutions Architect Associate and Azure AI Engineer Associate. When
            I'm not coding, you'll find me reading books on
            technology, psychology, and science, or experimenting with new cloud
            technologies and system architectures.`;

export default function Page() {
  return (
    <Paper>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="text-center md:text-left">
          <SectionHeading title="About Me" IconComponent={CircleUserIcon} />
          <TypographyP className="mt-4 text-muted-foreground">
            {aboutMe}
          </TypographyP>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <SectionHeading
            title="Things I Like to Do"
            IconComponent={HeadphonesIcon}
          />
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

        <div className="flex flex-col gap-6">
          <SectionHeading
            title="Experience & Work"
            IconComponent={BriefcaseBusinessIcon}
          />
          <div className="flex flex-col gap-4">
            {experience.map((job, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-xl">{job.role}</CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="font-medium">{job.company}</span>
                    <span className="text-xs">
                      {job.period.start} - {job.period.end}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {job.description.map((des, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-muted-foreground leading-relaxed"
                      >
                        {des}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <SectionHeading
            title="Books I've Been Reading"
            IconComponent={BookIcon}
          />
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

        <div className="flex flex-col gap-4">
          <SectionHeading title="Connect With Me" IconComponent={NetworkIcon} />
          <div className="flex flex-row items-center gap-4">
            {socialLinks.map((sl, idx) => (
              <div key={idx} className="rounded-full border-2 border-black">
                <SocialIcon
                  url={sl.url}
                  style={{ height: 48, width: 48 }}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Paper>
  );
}

function SectionHeading({
  title,
  IconComponent,
}: {
  title: string;
  IconComponent: React.ComponentType<{
    fill?: string;
    stroke?: string;
    size?: number;
  }>;
}) {
  return (
    <div className="flex flex-row items-center gap-4">
      <IconComponent size={32} />
      <TypographyH3>{title}</TypographyH3>
    </div>
  );
}
