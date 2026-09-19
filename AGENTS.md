# Blog

I'm Abed, a software engineer who works mostly with web technologies. This blog is where I share my learnings. It's built with Astro and Tailwind CSS.

## Code comments

- Start with no comments. Names and structure carry the intent.
- If you need a paragraph to explain the code, rewrite the code to make it self-explanatory.
- If a comment is still needed, keep it to one short line and keep it up to date.

## Colocation

- Colocation is the default.
- Styles, logic, or subcomponents used by only one component should be owned by that component and live in its folder.
- Expose only the parts consumers need through an `index.ts` file, and keep the rest private to the folder.
- Promote a file to a shared folder like `~/lib` once a second owner needs it.

## Single source of truth

- When constants, values, or logic are used in more than one place, move them to a shared location such as `~/consts.ts`.

## File structure

- All files and directories should be in kebab-case.

## Styling

- Use `cn` from `~/lib/cn` for all conditional class lists. Never use string interpolation or `class:list`.
- Use the project's design tokens set in `~/styles/global.css`, not arbitrary values.
- Use mobile-first, fully responsive styling to ensure the blog looks good on all devices.

## Logos

- Use [svgl](https://svgl.app) to find and download logos.
