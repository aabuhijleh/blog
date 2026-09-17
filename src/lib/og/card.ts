import type { Raster } from "~/lib/og/assets";

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;
export const AVATAR_SIZE = 84;
export const SQUIGGLE_BOX = { width: 200, height: 10 };
export const ILLUSTRATION_BOX = { width: 460, height: 340 };

const palette = {
  canvas: "#202122",
  ink: "#ffffff",
  muted: "#9ba1a4",
  accent: "#548e9b",
};

type Style = Record<string, string | number>;
type Child = Element | string | false | undefined;

interface Element {
  type: string;
  props: Record<string, unknown>;
}

const h = (type: string, style: Style, ...children: Array<Child>): Element => ({
  type,
  props: { style, children: children.filter(Boolean) },
});

const img = (raster: Raster, style: Style = {}): Element => ({
  type: "img",
  props: { ...raster, style },
});

const glow = (placement: Style, size: number, alpha: number) =>
  h("div", {
    display: "flex",
    position: "absolute",
    ...placement,
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: `rgba(84, 142, 155, ${alpha})`,
  });

const titleSize = (title: string) => {
  if (title.length > 52) return 44;
  if (title.length > 32) return 52;
  return 62;
};

export interface CardProps {
  title: string;
  siteLabel: string;
  author: string;
  avatar: Raster;
  squiggle: Raster;
  subtitle?: string;
  dateLabel?: string;
  tagsLine?: string;
  illustration?: Raster;
}

export const ogCard = ({
  title,
  siteLabel,
  author,
  avatar,
  squiggle,
  subtitle,
  dateLabel,
  tagsLine,
  illustration,
}: CardProps): Element =>
  h(
    "div",
    {
      display: "flex",
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      padding: "44px 48px",
      backgroundColor: palette.canvas,
      fontFamily: "Fira Sans",
      color: palette.muted,
    },
    glow({ top: -90, right: -80 }, 360, 0.13),
    glow({ bottom: -130, left: -120 }, 420, 0.09),
    h(
      "div",
      {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
      },
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        h(
          "div",
          {
            display: "flex",
            padding: "9px 18px",
            borderRadius: 999,
            border: "1px solid rgba(255, 255, 255, 0.18)",
            fontSize: 24,
            letterSpacing: "0.04em",
          },
          siteLabel,
        ),
        dateLabel &&
          h(
            "div",
            {
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: palette.accent,
            },
            dateLabel,
          ),
      ),
      h(
        "div",
        {
          display: "flex",
          alignItems: "stretch",
          gap: 40,
          height: 350,
          marginTop: 18,
        },
        h(
          "div",
          {
            display: "flex",
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
            flexDirection: "column",
            justifyContent: "space-between",
          },
          h(
            "div",
            { display: "flex", flexDirection: "column" },
            h(
              "div",
              {
                display: "flex",
                fontFamily: "Merriweather",
                fontWeight: 700,
                fontSize: titleSize(title),
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                color: palette.ink,
              },
              title,
            ),
            subtitle &&
              h(
                "div",
                {
                  display: "flex",
                  marginTop: 20,
                  fontSize: 28,
                  lineHeight: 1.5,
                },
                subtitle,
              ),
          ),
          img(squiggle),
        ),
        illustration &&
          h(
            "div",
            {
              display: "flex",
              width: illustration.width,
              alignItems: "center",
              justifyContent: "center",
            },
            img(illustration),
          ),
      ),
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
        h(
          "div",
          { display: "flex", alignItems: "center", fontSize: 28 },
          img(avatar, {
            borderRadius: "50%",
            marginRight: 16,
            border: "2px solid rgba(84, 142, 155, 0.45)",
          }),
          h("span", { display: "flex", marginRight: 8 }, "by"),
          h(
            "span",
            { display: "flex", fontWeight: 700, color: palette.accent },
            author,
          ),
        ),
        tagsLine &&
          h(
            "div",
            { display: "flex", fontSize: 22, letterSpacing: "0.04em" },
            tagsLine,
          ),
      ),
    ),
  );
