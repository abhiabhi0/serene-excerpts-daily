import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';

const articlesDir = path.join(process.cwd(), 'public', 'articles');
const articlesJsonPath = path.join(process.cwd(), 'src', 'articles.json');

const getArticles = () => {
  return fs.readdirSync(articlesDir)
    .filter(file => file.endsWith('.html'))
    .map(file => {
      const filePath = path.join(articlesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const $ = load(content);
      const title = $('h1').text() || file.replace(/_/g, ' ').replace(/\.html$/, '');
      return {
        title,
        url: `/articles/${file}`
      };
    });
};

const articles = getArticles();

fs.writeFileSync(articlesJsonPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('Articles JSON file generated successfully.');