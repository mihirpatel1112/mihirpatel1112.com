import { CopyrightIcon, LinkedinIcon, GithubIcon } from "lucide-react";
import { TypographyP } from "./typography";

export default function Footer() {
  return (
    <div className="container flex flex-row justify-between">
      <div className="flex flex-row items-center space-x-2">
        <CopyrightIcon size={16} />
        <TypographyP>Mihir Patel</TypographyP>
      </div>

      <div className="flex flex-row items-center space-x-2">
        <a
          href="https://www.linkedin.com/in/mihir-patel-7b220422a/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-100 p-2 rounded-full hover:shadow-2xl outline"
        >
          <LinkedinIcon size={20} strokeWidth={1.5} />
        </a>
        <a
          href="https://github.com/mihirpatel1112"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-100 p-2 rounded-full hover:shadow-2xl outline"
        >
          <GithubIcon size={20} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  );
}
