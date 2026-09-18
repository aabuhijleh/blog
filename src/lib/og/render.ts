import satori from "satori";
import sharp from "sharp";

import { SITE_AUTHOR } from "~/consts";
import { fonts, loadAvatar, loadIllustration, loadSquiggle } from "~/lib/og/assets";
import {
  AVATAR_SIZE,
  CARD_HEIGHT,
  CARD_WIDTH,
  ILLUSTRATION_BOX,
  ogCard,
  SQUIGGLE_BOX,
} from "~/lib/og/card";

export interface OgImageInput {
  title: string;
  site: URL;
  subtitle?: string;
  pubDate?: Date;
  tags?: Array<string>;
  illustration?: ImageMetadata;
}

const monthAndYear = (date: Date) =>
  date.toLocaleDateString("en-us", { month: "long", year: "numeric" });

export const renderOgImage = async ({
  title,
  site,
  subtitle,
  pubDate,
  tags = [],
  illustration,
}: OgImageInput) => {
  const [avatar, squiggle, rasterizedIllustration] = await Promise.all([
    loadAvatar(AVATAR_SIZE),
    loadSquiggle(SQUIGGLE_BOX),
    illustration ? loadIllustration(illustration, ILLUSTRATION_BOX) : undefined,
  ]);

  const card = ogCard({
    title,
    siteLabel: site.host,
    author: SITE_AUTHOR,
    avatar,
    squiggle,
    subtitle,
    dateLabel: pubDate && monthAndYear(pubDate),
    tagsLine: tags.slice(0, 3).join(" • "),
    illustration: rasterizedIllustration,
  });

  const svg = await satori(card, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts,
  });

  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
};
