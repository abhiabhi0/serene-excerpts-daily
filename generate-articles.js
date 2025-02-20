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
    <script>
      function bringToMain(text, bookTitle) {
        const excerpt = {
          text: text,
          bookTitle: bookTitle,
          isLocal: true
        };
        
        if (window.location.pathname === '/') {
          // If we're already on the main page, use the data directly
          window.dispatchEvent(new CustomEvent('setExcerpt', { detail: excerpt }));
        } else {
          // Otherwise, navigate to main page with parameters
          window.location.href = '/?text=' + encodeURIComponent(text) + '&bookTitle=' + encodeURIComponent(bookTitle) + '&isFromArticle=true';
        }
      }
    </script>
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
        </div>`;
      if (metadata.amazonLink) {          html += `<a href="${metadata.amazonLink}" style="color: #FFD700;">Buy book on Amazon</a>\n`;
      }

      let excerptCount = 0;
      excerpts.forEach(excerpt => {
          html += generateExcerptCard(excerpt);

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

function generateExcerptCard(excerpt) {
  const text = excerpt.text || '';
  const chapter = excerpt.chapter ? `<em>chapter: ${excerpt.chapter}  </em>` : '';
  const verse = excerpt.verse ? `<em>verse: ${excerpt.verse}  </em>` : '';
  const commentary = excerpt.commentary ? `<p><em>Commentary:</em></p>` : '';

  return `<div class="card">
${commentary}<p>${text}</p>${chapter}${verse}
<button 
    class="bring-to-main" 
    onclick="bringToMain(${JSON.stringify(text)}, ${JSON.stringify(excerpt.bookTitle || 'Unknown')})"
>
    <img 
        src="/lovable-uploads/ic_launcher_round.png" 
        alt="Bring to Main" 
    />
    Bring to Main
</button>
</div>`;
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
