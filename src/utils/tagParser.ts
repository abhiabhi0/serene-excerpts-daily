import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';

export const getTags = () => {
  const tagsPath = path.join(process.cwd(), 'public', 'tags', 'tags.html');
  const content = fs.readFileSync(tagsPath, 'utf8');
  const $ = load(content);

  const tags = [];
  $('.tag').each((_, element) => {
    const text = $(element).text().trim();
    const [name, countStr] = text.split('(');
    const count = parseInt(countStr.replace(')', ''));
    
    tags.push({
      name: name.trim(),
      count: count
    });
  });

  return tags;
};
