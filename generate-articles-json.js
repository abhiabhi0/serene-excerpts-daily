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
      
        // Get title from h1 or filename
        const title = $('h1').text() || file.replace(/_/g, ' ').replace(/\.html$/, '');
      
        // Get date from datetime tag
        let date = $('time[datetime]').attr('datetime');
      
        // If no datetime found, try article date
        if (!date) {
          date = $('article time').text();
        }
      
        // Fallback to file stats if no date found
        if (!date) {
          const stats = fs.statSync(filePath);
          date = stats.birthtime.toISOString().split('T')[0];
        }

        return {
          title,
          url: `/articles/${file}`,
          date
        };
      });
  };

  const articles = getArticles();

  fs.writeFileSync(articlesJsonPath, JSON.stringify(articles, null, 2), 'utf8');
  console.log('Articles JSON file generated successfully.');