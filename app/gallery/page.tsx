import { notFound } from "next/navigation";

import GalleryGrid from "@/components/gallery-grid";
import Paper from "@/components/paper";
import { TypographyH2 } from "@/components/typography";
import { getGalleryData } from "@/lib/gallery";
import { isPageEnabled } from "@/lib/page-settings";

export const metadata = {
  title: "Gallery",
};

export default async function Page() {
  if (!(await isPageEnabled("gallery"))) notFound();
  const { heading, photos } = await getGalleryData();

  return (
    <Paper>
      <div className="flex flex-col gap-8 pt-8">
        {heading && (
          <TypographyH2 className="text-center md:text-left">
            {heading}
          </TypographyH2>
        )}
        <GalleryGrid photos={photos} />
      </div>
    </Paper>
  );
}
