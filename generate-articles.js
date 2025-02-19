import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
  function generateArticle(jsonData) {
      console.log('Processing JSON data:', JSON.stringify(jsonData, null, 2));
    
      const { metadata, excerpts } = jsonData;
      if (!metadata || !excerpts) {
          console.error('Invalid JSON structure. Expected metadata and excerpts properties.');
          return null;
      }

      let html = `<!DOCTYPE html>
  <html lang="${metadata.language || 'en'}">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Excerpts from ${metadata.title}</title>
      <link rel="stylesheet" href="../assets/articles.css">
  </head>
  <body>
      <div class="excerpts-container w-[98%] mx-auto space-y-4">

      <h1>Excerpts from ${metadata.title}</h1>`;

      let subtitle = metadata.title;
      if (metadata.author) subtitle += ` by ${metadata.author}`;
      if (metadata.translator) subtitle += ` (Translated by ${metadata.translator})`;
      html += `<h2>${subtitle}</h2>`;
      if (metadata.amazonLink) {
          html += `<a href="${metadata.amazonLink}" style="color: #FFD700;">Buy book on Amazon</a>\n`;
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
              html += `
              <div class="ads-card">
                  <div class="ads-card-content">
                      <h3 class="text-xl font-bold mb-2" style="color: #FFD700;">Discover Daily Wisdom</h3>
                      <p class="text-white mb-4">Start your day with inspiring wisdom and cultivate gratitude through daily journaling</p>
                      <a href="/" class="inline-block px-6 py-2 bg-[#FFD700] text-[#1A4067] font-bold rounded-full hover:bg-opacity-90 transition-colors style="color: #87CEEB;">
                          Begin Your Journey
                      </a>
                  </div>
              </div>`;
          }    });

      if (metadata.amazonLink) {
          html += `<p><a href="${metadata.amazonLink}" style="color: #FFD700;">Buy book on Amazon</a></p>\n`;
      }

      // Add Support and Footer sections
      html += `
      <div class="mt-8 text-center">
          ${readFileSync(join(__dirname, 'public', 'support.html'), 'utf8')}
          <br>
          ${readFileSync(join(__dirname, 'public', 'footer.html'), 'utf8')}
      </div>`;

      html += '</div>\n</body>\n</html>';
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
