import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { JSDOM } from 'jsdom';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
  function generateArticle(jsonData) {
      const { metadata, excerpts } = jsonData;
    
      // Get filename that will be generated
      const articleFilename = `excerpts_from_${metadata.title.toLowerCase().replace(/\s+/g, '_')}.html`;
      const articlePath = join(__dirname, 'public', 'articles', articleFilename);
    
      // Extract existing date if file exists
      let existingDate = '';
      if (existsSync(articlePath)) {
          const dom = new JSDOM(readFileSync(articlePath, 'utf8'));
          const timeElement = dom.window.document.querySelector('time');
          existingDate = timeElement?.getAttribute('datetime') || '';
      }

      // Use existing date or leave empty
      const publishDate = existingDate;

      // Add these default meta values at the top of generateArticle function
      const defaultMetaDescription = "Explore spiritual wisdom, meditation insights, and philosophical excerpts from ancient texts and modern thinkers. Discover transformative ideas from Indian philosophy and beyond.";

      const defaultKeywords = "spirituality, meditation, philosophy, indian philosophy, vedanta, buddhism, yoga, mindfulness, wisdom, consciousness, self-realization, ancient wisdom, spiritual growth, eastern philosophy";

      // Create meta description and format date
      const metaDescription = metadata.description || excerpts[0]?.text.substring(0, 160) || '';
    
      // Create subtitle before HTML template
      let subtitle = metadata.title;
      if (metadata.author) subtitle += ` by ${metadata.author}`;
      if (metadata.translator) subtitle += ` (Translated by ${metadata.translator})`;

      // Now we can use subtitle in our HTML template
      let html = `<!DOCTYPE html>
  <html lang="${metadata.language || 'en'}">
  <head>
      <meta charset="UTF-8">
      <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-MFBQ1NPQF8"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-MFBQ1NPQF8');
    </script>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="${metadata.description || metaDescription || defaultMetaDescription}">
      <meta name="keywords" content="${metadata.keywords || defaultKeywords}">
      <meta property="og:title" content="Excerpts from ${metadata.title}">
      <meta property="og:description" content="${metadata.description || metaDescription || defaultMetaDescription}">
      <meta property="article:published_time" content="${publishDate}">
      <meta property="og:type" content="article">
      ${metadata.tags ? `<meta name="article:tag" content="${metadata.tags.join(', ')}">` : ''}
      <title>Excerpts from ${metadata.title}</title>
      <link rel="stylesheet" href="../assets/articles.css">
  </head>
  <body>
      <div class="excerpts-container w-[98%] mx-auto space-y-4">
          <h1>Excerpts from ${metadata.title}</h1>
          <h2>${subtitle}</h2>
      
          <div class="article-meta">
              <time datetime="${publishDate}">${new Date(publishDate).toLocaleDateString()}</time>
              ${metadata.tags ? `
              <div class="tags">
                  ${metadata.tags.map(tag => 
                      `<a href="../tags/tags.html#${tag.toLowerCase().replace(/\s+/g, '_')}" class="tag">${tag}</a>`
                  ).join(' ')}
              </div>
              ` : ''}
          </div>`;      if (metadata.amazonLink) {          html += `<a href="${metadata.amazonLink}" style="color: #FFD700;">Buy book on Amazon</a>\n`;
      }

      let excerptCount = 0;
      excerpts.forEach(excerpt => {
          html += '<div class="card">\n';
    
          if (excerpt.commentary) {
              html += `<p><em>Commentary:</em></p>\n`;
          }

          html += `<p>${excerpt.text.replace(/\n/g, '<br>')}</p>\n`;

          Object.entries(excerpt).forEach(([key, value]) => {
              if (key !== 'text' && key !== 'commentary' && value) {
                  html += `<em>${key}: ${value}  </em>`;
              }
          });
          html += '</div>\n';

          excerptCount++;
          if (excerptCount % 3 === 0) {
              html += `<div class="ads-container"></div>`;
          }
      });
      if (metadata.amazonLink) {
          html += `<p><a href="${metadata.amazonLink}" style="color: #FFD700;">Buy book on Amazon</a></p>\n`;
      }
          // Add Support and Footer sections
          html += `
        <div id="support-container"></div>
        <div id="footer-container"></div>
        </div>
    </body>

    <script src="../assets/components.js"></script>

    </html>`;
          return html;
      }
function processJsonFiles() {
    const dataDir = join(__dirname, 'public', 'data');
    const articlesDir = join(__dirname, 'public', 'articles');

    console.log('Reading from directory:', dataDir);

    if (!existsSync(dataDir)) {
        console.error('Data directory does not exist:', dataDir);
        return;
    }

    if (!existsSync(articlesDir)) {
        mkdirSync(articlesDir, { recursive: true });
    }

    readdirSync(dataDir).forEach(file => {
        if (extname(file) === '.json') {
            console.log('Processing file:', file);
            try {
                const jsonContent = readFileSync(join(dataDir, file), 'utf8');
                const jsonData = JSON.parse(jsonContent);
                const articleHtml = generateArticle(jsonData);
                
                if (articleHtml) {
                    const articleFilename = `excerpts_from_${jsonData.metadata.title.toLowerCase().replace(/\s+/g, '_')}.html`;
                    writeFileSync(join(articlesDir, articleFilename), articleHtml);
                    console.log('Generated article:', articleFilename);
                }
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
            }
        }
    });
}

processJsonFiles();
