import sharp from "sharp";

export interface ImageVariant {
  type: "thumbnail" | "medium" | "full";
  width: number;
  height?: number;
  quality: number;
}

const VARIANTS: Record<string, ImageVariant> = {
  thumbnail: { type: "thumbnail", width: 400, quality: 70 },
  medium: { type: "medium", width: 1000, quality: 75 },
  full: { type: "full", width: 2000, quality: 80 },
};

export async function processImage(
  buffer: Buffer,
  mimeType: string,
  format: "webp" | "jpeg" = "webp",
) {
  const variants: Array<{
    type: string;
    data: Buffer;
    width: number;
    height: number;
    size: number;
  }> = [];

  let originalMetadata;

  for (const [key, config] of Object.entries(VARIANTS)) {
    let pipeline = sharp(buffer, {
      failOnError: false,
      pages: -1,
    });

    // Auto-convert HEIC to processable format
    if (mimeType === "image/heic" || mimeType === "image/heif") {
      try {
        pipeline = sharp(buffer, {
          failOnError: false,
          pages: -1,
        });
      } catch {
        // sharp handles HEIC natively, continue with pipeline
      }
    }

    const actualPipeline = pipeline;

    if (!originalMetadata) {
      originalMetadata = await actualPipeline.metadata();
    }

    const resized = actualPipeline.resize(config.width, config.height, {
      fit: config.height ? "cover" : "inside",
      position: "center",
      withoutEnlargement: true,
    });

    let compressed;
    if (format === "webp") {
      compressed = resized.webp({ quality: config.quality });
    } else {
      compressed = resized.jpeg({ quality: config.quality, progressive: true });
    }

    const data = await compressed.toBuffer();
    const metadata = await sharp(data).metadata();

    variants.push({
      type: key,
      data,
      width: metadata.width || config.width,
      height: metadata.height || config.height || config.width,
      size: data.length,
    });
  }

  return {
    variants,
    originalWidth: originalMetadata?.width,
    originalHeight: originalMetadata?.height,
    format,
  };
}

export const VARIANT_DIMENSIONS = {
  thumbnail: { width: 400 },
  medium: { width: 1000 },
  full: { width: 2000 },
};
