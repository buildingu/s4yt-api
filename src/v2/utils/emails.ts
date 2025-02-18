import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const loadEmailTemplate = (filename: string) => {
  // Using workaround instead of `import.meta.dirname` because Webpack doesn't support the latter
  // and ES modules doesn't have __dirname
  // See https://github.com/webpack/webpack/issues/18320

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

 return fs.readFileSync(path.resolve(__dirname, '../emailTemplates', filename), 'utf8');
}

export const fillTemplate = (html: string, substitutions: [string, string][]) => {
  let newHtml = html;

  for (const sub of substitutions) {
    newHtml = newHtml.replace(sub[0], sub[1]);
  }

  return newHtml;
}