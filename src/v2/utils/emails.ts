import fs from 'fs';
import path from 'path';

export const loadEmailTemplate = (filename: string) => {
 return fs.readFileSync(path.resolve(import.meta.dirname, '../emailTemplates', filename), 'utf8');
}

export const fillTemplate = (html: string, substitutions: [string, string][]) => {
  let newHtml = html;

  for (const sub of substitutions) {
    newHtml = newHtml.replace(sub[0], sub[1]);
  }

  return newHtml;
}