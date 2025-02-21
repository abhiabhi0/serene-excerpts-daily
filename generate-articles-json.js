import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';

const articlesDir = path.join(process.cwd(), 'public', 'articles');
const articlesJsonPath = path.join(process.cwd(), 'src', 'articles.json');
const blogTsxPath = path.join(process.cwd(), 'src', 'pages', 'Blog.tsx');

const getArticles = () => {
  return fs.readdirSync(articlesDir)
    .filter(file => file.endsWith('.html'))
    .map(file => {
      const filePath = path.join(articlesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const $ = load(content);
    
      const title = $('h1').text() || file.replace(/_/g, ' ').replace(/\.html$/, '');
      let date = $('time[datetime]').attr('datetime');
    
      if (!date) {
        date = $('article time').text();
      }
    
      if (!date) {
        const stats = fs.statSync(filePath);
        date = stats.birthtime.toISOString();
      }

      return {
        title,
        url: `/articles/${file}`,
        date
      };
    });
};

const updateFiles = () => {
  const articles = getArticles();
  
  // Update articles.json
  fs.writeFileSync(articlesJsonPath, JSON.stringify(articles, null, 2), 'utf8');

  // Read existing Blog.tsx
  let blogTsxContent = fs.readFileSync(blogTsxPath, 'utf8');

  // Create articles array string
  const articlesString = JSON.stringify(articles, null, 2);

  // Updated regex pattern for Windows
  const newBlogContent = blogTsxContent.replace(
    /const articles = \[\r\n\s*{[\s\S]*?}\r\n\s*\]\.sort/m,
    `const articles = ${articlesString}.sort`
  );

  // Write updated Blog.tsx
  fs.writeFileSync(blogTsxPath, newBlogContent, 'utf8');
  
  console.log('Files updated successfully');
};
updateFiles();