import type { SatoriOptions } from "satori";
import sharp from "sharp";

import firaSans from "~/assets/fonts/fira-sans-latin-400-normal.woff?inline";
import firaSansBold from "~/assets/fonts/fira-sans-latin-700-normal.woff?inline";
import merriweatherBold from "~/assets/fonts/merriweather-latin-700-normal.woff?inline";
import avatarSvg from "~/assets/icons/avatar.svg?raw";

const SUPERSAMPLE = 2;
const ACCENT = "#548e9b";
const AVATAR_BACKDROP = "#3b3c3d";
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

export interface Raster {
  src: string;
  width: number;
  height: number;
}

interface Box {
  width: number;
  height: number;
}

interface RasterOptions {
  fit?: "inside" | "contain";
  background?: string | { r: number; g: number; b: number; alpha: number };
}

const rasterize = async (
  source: Buffer,
  box: Box,
  { fit = "inside", background = TRANSPARENT }: RasterOptions = {},
): Promise<Raster> => {
  const target = {
    width: box.width * SUPERSAMPLE,
    height: box.height * SUPERSAMPLE,
  };
  const natural = await sharp(source).metadata();
  const ratio = Math.min(target.width / natural.width, target.height / natural.height);

  const png = await sharp(source, {
    density: Math.max(1, Math.ceil(72 * ratio)),
  })
    .resize({ ...target, fit, background })
    .png()
    .toBuffer();
  const rendered = await sharp(png).metadata();

  return {
    src: `data:image/png;base64,${png.toString("base64")}`,
    width: rendered.width / SUPERSAMPLE,
    height: rendered.height / SUPERSAMPLE,
  };
};

const decodeDataUri = (dataUri: string) =>
  Buffer.from(dataUri.slice(dataUri.indexOf(",") + 1), "base64");

export const fonts: SatoriOptions["fonts"] = [
  {
    name: "Merriweather",
    data: decodeDataUri(merriweatherBold),
    weight: 700,
    style: "normal",
  },
  {
    name: "Fira Sans",
    data: decodeDataUri(firaSans),
    weight: 400,
    style: "normal",
  },
  {
    name: "Fira Sans",
    data: decodeDataUri(firaSansBold),
    weight: 700,
    style: "normal",
  },
];

let avatar: Promise<Raster> | undefined;
export const loadAvatar = (size: number) =>
  (avatar ??= rasterize(
    Buffer.from(avatarSvg),
    { width: size, height: size },
    { fit: "contain", background: AVATAR_BACKDROP },
  ));

const squiggleSvg = (
  box: Box,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}" viewBox="0 0 ${box.width} ${box.height}">
  <defs>
    <pattern id="squiggle" width="20" height="10" patternUnits="userSpaceOnUse">
      <path d="M20 7.384c-4.999-.001-5-4.768-9.999-4.768C5 2.616 5 7.384 0 7.384" fill="none" stroke="${ACCENT}" stroke-width="3"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#squiggle)"/>
</svg>`;

let squiggle: Promise<Raster> | undefined;
export const loadSquiggle = (box: Box) =>
  (squiggle ??= rasterize(Buffer.from(squiggleSvg(box)), box));

const metaByFile = import.meta.glob<{ default: ImageMetadata }>("/src/assets/illustrations/*.svg", {
  eager: true,
});

const rawByFile = import.meta.glob<string>("/src/assets/illustrations/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
});

const sourceBySrc = new Map(
  Object.entries(metaByFile).map(([file, module]) => [module.default.src, rawByFile[file]]),
);

export const loadIllustration = (image: ImageMetadata, box: Box) => {
  const svg = sourceBySrc.get(image.src);
  if (!svg) throw new Error(`No SVG source behind '${image.src}'.`);

  return rasterize(Buffer.from(svg), box);
};
