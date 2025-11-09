import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function Paper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main
        className={twMerge(
          "flex-1 container mx-auto px-4 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
