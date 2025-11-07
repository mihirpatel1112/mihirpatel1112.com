import { CopyrightIcon } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import { TypographyP } from "./typography";

export default function Footer() {
  return (
    <div className="container flex flex-row justify-between">
      <div className="flex flex-row items-center space-x-2">
        <CopyrightIcon size={16} />
        <TypographyP>Mihir Patel</TypographyP>
      </div>

      <div className="flex flex-row items-center space-x-2">
        <SocialIcon url="https://www.linkedin.com/in/mihir-patel-7b220422a/" />
        <SocialIcon url="https://github.com/mihirpatel1112" />
      </div>
    </div>
  );
}
