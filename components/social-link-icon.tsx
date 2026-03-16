"use client";

import {
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  type LucideIcon,
  Twitter,
  Youtube,
} from "lucide-react";

const URL_TO_ICON: Array<{ pattern: RegExp; Icon: LucideIcon }> = [
  { pattern: /github\.com/i, Icon: Github },
  { pattern: /linkedin\.com/i, Icon: Linkedin },
  { pattern: /(?:twitter|x)\.com/i, Icon: Twitter },
  { pattern: /instagram\.com/i, Icon: Instagram },
  { pattern: /youtube\.com/i, Icon: Youtube },
];

function getIconForUrl(url: string): LucideIcon {
  for (const { pattern, Icon } of URL_TO_ICON) {
    if (pattern.test(url)) return Icon;
  }
  return ExternalLink;
}

interface SocialLinkIconProps {
  url: string;
  size?: number;
  className?: string;
  /** When true, render only the icon (for use inside an existing link) */
  iconOnly?: boolean;
}

export function SocialLinkIcon({
  url,
  size = 32,
  className = "",
  iconOnly = false,
}: SocialLinkIconProps) {
  const Icon = getIconForUrl(url);
  const iconEl = <Icon size={size} className={className} />;
  if (iconOnly) return iconEl;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex hover:opacity-80 transition-opacity ${className}`}
      aria-label={`Open ${url}`}
    >
      {iconEl}
    </a>
  );
}
