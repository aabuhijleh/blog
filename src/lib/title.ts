import { SITE_TITLE } from "~/consts";

const TITLE_SEPARATOR = "|";

export function formatTitle(title: string): string {
  if (title === SITE_TITLE) return SITE_TITLE;
  return `${title} ${TITLE_SEPARATOR} ${SITE_TITLE}`;
}
