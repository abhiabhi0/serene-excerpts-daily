import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function extractTagsFromHtml(htmlContent) {
    const dom = new JSDOM(htmlContent);
    const tagElements = dom.window.document.querySelectorAll('.tag');
    const title = dom.window.document.querySelector('title').textContent;
    const date = dom.window.document.querySelector('time')?.getAttribute('datetime');
    
    return {
        tags: Array.from(tagElements).map(tag => tag.textContent),
        title,
        date
    };
}

function generateTagsIndex() {
    const articlesDir = join(__dirname, 'public', 'articles');
    const tagsDir = join(__dirname, 'public', 'tags');
    const tagMap = new Map();

    // Create tags directory if it doesn't exist
    if (!existsSync(tagsDir)) {
        mkdirSync(tagsDir, { recursive: true });
    }

    // Read all HTML files and extract tags
    readdirSync(articlesDir).forEach(file => {
        if (file.endsWith('.html')) {
            const htmlContent = readFileSync(join(articlesDir, file), 'utf8');
            const { tags, title, date } = extractTagsFromHtml(htmlContent);
            
            tags.forEach(tag => {
                if (!tagMap.has(tag)) {
                    tagMap.set(tag, []);
                }
                tagMap.get(tag).push({
                    title,
                    fileName: file,
                    date: date || new Date().toISOString()
                });
            });
        }
    });

    // Generate single tags page
    generateTagsPage(tagMap, tagsDir);
}  function generateTagPages(tagMap, tagsDir) {
      tagMap.forEach((articles, tag) => {
          const tagFileName = `tag_${tag.toLowerCase().replace(/\s+/g, '_')}.html`;
          const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Articles tagged with ${tag}</title>
      <link rel="stylesheet" href="../assets/blog.css">
      <style>
          body {
              background: linear-gradient(to bottom right, #0A1929, #0F2942, #1A4067);
              color: #ffffff;
          }
      </style>
  </head>
  <body>
      <div class="blog-container">
          <h1>Articles tagged with "${tag}"</h1>
          <div class="articles-list">
              ${articles.map(article => `
                  <div class="article-item">
                      <a href="../articles/${article.fileName}">${article.title}</a>
                      <time>${new Date(article.date).toLocaleDateString()}</time>
                  </div>
              `).join('\n')}
          </div>
          <p><a href="index.html">← All Tags</a></p>
      </div>
  </body>
  </html>`;

          writeFileSync(join(tagsDir, tagFileName), html);
      });
  }

  function generateTagsPage(tagMap, tagsDir) {
      const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Article Tags</title>
      <link rel="stylesheet" href="../assets/blog.css">
      <style>
          body {
              background: linear-gradient(to bottom right, #0A1929, #0F2942, #1A4067);
              color: #ffffff;
          }
          .tag-section {
              margin: 2rem 0;
              padding: 1rem;
              border-radius: 8px;
          }
          .tag-title {
              color: #FFD700;
              margin-bottom: 1rem;
          }
      </style>
  </head>
  <body>
      <div class="blog-container">
          <h1>Article Tags</h1>
        
          <!-- Tags Index -->
          <div class="tags-cloud">
              ${Array.from(tagMap.entries()).map(([tag, articles]) => `
                  <a href="#${tag.toLowerCase().replace(/\s+/g, '_')}" class="tag">
                      ${tag} (${articles.length})
                  </a>
              `).join(' ')}
          </div>

          <!-- Individual Tag Sections -->
          ${Array.from(tagMap.entries()).map(([tag, articles]) => `
              <div id="${tag.toLowerCase().replace(/\s+/g, '_')}" class="tag-section">
                  <h2 class="tag-title">${tag}</h2>
                  <div class="articles-list">
                      ${articles.map(article => `
                          <div class="article-item">
                              <a href="../articles/${article.fileName}">${article.title}</a>
                              <time>${new Date(article.date).toLocaleDateString()}</time>
                          </div>
                      `).join('\n')}
                  </div>
              </div>
          `).join('\n')}
      </div>
  </body>
  </html>`;

      writeFileSync(join(tagsDir, 'tags.html'), html);
  }
// Run the tag generation
generateTagsIndex();
