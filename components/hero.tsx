import { getHeroContent } from "@/lib/hero";

export default async function Hero() {
  const { greeting, name, bio } = await getHeroContent();

  return (
    <div className="container">
      <div className="py-24">
        <p className="text-muted-foreground text-lg font-medium">{greeting}</p>
        <h1 className="scroll-m-20 text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight">
          {name}
        </h1>

        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed border-l-4 border-border pl-2 md:pl-4 sm:pl-6 my-4">
          <p>{bio}</p>
        </div>
      </div>
    </div>
  );
}
