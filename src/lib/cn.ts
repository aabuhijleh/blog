import { createCn } from 'cn/config';

export const cn = createCn({
  extend: {
    classGroups: {
      'font-size': [{ text: ['body', 'h1', 'h2', 'h3', 'h4'] }],
    },
  },
});
