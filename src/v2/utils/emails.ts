import fs from 'fs';
import path from 'path';

export const loadEmailTemplate = (filename: string) => {
  // Using `path.dirname(process.argv[1])` instead of `import.meta.dirname` because Webpack doesn't support the latter
  // and ES modules doesn't have __dirname
  // See https://github.com/webpack/webpack/issues/18320
  return fs.readFileSync(path.resolve(path.dirname(process.argv[1]), 'emailTemplates', filename), 'utf8');
}

export const fillTemplate = (html: string, substitutions: [string, string][]) => {
  let newHtml = html;

  for (const sub of substitutions) {
    newHtml = newHtml.replace(sub[0], sub[1]);
  }

  return newHtml;
}