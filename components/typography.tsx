import { twMerge } from "tailwind-merge";

export function TypographyH1({
  children,
  align = "text-left",
  className,
}: {
  children: string;
  align?: string;
  className?: string;
}) {
  return (
    <h1
      className={twMerge(
        "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
        align,
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({
  children,
  align = "text-left",
  className,
}: {
  children: string;
  align?: string;
  className?: string;
}) {
  return (
    <h2
      className={twMerge(
        "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
        align,
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({
  children,
  align = "text-left",
  className,
}: {
  children: string;
  align?: string;
  className?: string;
}) {
  return (
    <h3
      className={twMerge(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        align,
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({
  children,
  align = "text-left",
  className,
}: {
  children: string;
  align?: string;
  className?: string;
}) {
  return (
    <h4
      className={twMerge(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        align,
        className,
      )}
    >
      {children}
    </h4>
  );
}

export function TypographyP({
  children,
  align = "text-left",
  className,
}: {
  children: string;
  align?: string;
  className?: string;
}) {
  return (
    <p
      className={twMerge(
        "leading-7 [&:not(:first-child)]:mt-6)",
        align,
        className,
      )}
    >
      {children}
    </p>
  );
}
