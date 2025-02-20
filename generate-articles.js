import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateArticle(jsonData) {
  const metadata = jsonData.metadata || {};
  const excerpts = jsonData.excerpts || [];
  const subtitle = metadata.subtitle || metadata.title;
  const publishDate = metadata.publishDate || new Date().toISOString();
  const defaultMetaDescription = excerpts[0]?.text?.slice(0, 200) || '';
  const defaultKeywords = 'spirituality, meditation, philosophy, indian philosophy, vedanta, buddhism, yoga, mindfulness, wisdom, consciousness, self-realization, ancient wisdom, spiritual growth, eastern philosophy';
  const metaDescription = excerpts[0]?.text?.slice(0, 200);

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
        const event = new CustomEvent('setExcerpt', {
          detail: {
            text: text,
            bookTitle: bookTitle,
            isLocal: true
          }
        });
        
        if (window.location.pathname === '/') {
          // If we're already on the main page, dispatch the event
          window.dispatchEvent(event);
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

  if (metadata.amazonLink) {
    html += `<a href="${metadata.amazonLink}" style="color: #FFD700;">Buy book on Amazon</a>`;
  }

  excerpts.forEach((excerpt, index) => {
    html += generateExcerptCard(excerpt);
    if ((index + 1) % 3 === 0) {
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
    }
  });

  if (metadata.amazonLink) {
    html += `<p><a href="${metadata.amazonLink}" style="color: #FFD700;">Buy book on Amazon</a></p>`;
  }

  html += `
      <div class="mt-8 text-center">
          <div class="p-4 sm:p-6 text-center bg-[#0A1929] rounded-lg shadow-lg max-w-2xl mx-auto">
    <h2 class="text-lg font-semibold mb-4 text-white">Support Atmanam Viddhi</h2>
    <div class="flex flex-col items-center gap-4">
        <a href="https://www.buymeacoffee.com/botman1001" target="_blank" rel="noopener noreferrer">
            <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a book&emoji=📖&slug=botman1001&button_colour=BD5FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" alt="Buy me a book" />
        </a>
        
        <div class="mt-4 p-4 bg-white/5 rounded-lg w-full max-w-sm">
            <h3 class="text-sm font-medium mb-2 text-white">UPI Payment (India)</h3>
            <div class="flex items-center justify-between gap-2 w-full px-4 py-2 bg-[#1A4067] hover:bg-[#1A4067]/80 rounded-md transition-colors">
                <span class="text-white font-medium">atmanamviddhi@axl</span>
                <button
                    onclick="navigator.clipboard.writeText('atmanamviddhi@axl')"
                    class="text-white/70 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
          <br>
          <footer class="mt-8 pb-4 text-center relative z-10 transition-opacity duration-300">
    <div class="flex justify-center gap-4 text-xs text-muted-foreground">
        <a href="/" class="hover:text-primary transition-colors">Home</a>
        <a href="/about" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">About</a>
        <a href="/blog" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">Blog</a>
        <a href="https://www.termsfeed.com/live/cecc03b1-3815-4a4e-b8f8-015d7679369d" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">Privacy Policy</a>
    </div>
    <div class="flex justify-center gap-4 text-xs text-muted-foreground mt-4">
        <span>
            We welcome your feedback and suggestions. Please email us at 
            <a href="mailto:thinkinglatenite@gmail.com" class="hover:text-primary transition-colors">thinkinglatenite@gmail.com</a>
        </span>
    </div>
</footer>

      </div></div>
</body>
</html>`;

  return html;
}

function generateExcerptCard(excerpt) {
  const text = excerpt.text || '';
  const bookTitle = excerpt.bookTitle || 'Unknown';
  const chapter = excerpt.chapter ? `<em>chapter: ${excerpt.chapter}  </em>` : '';
  const verse = excerpt.verse ? `<em>verse: ${excerpt.verse}  </em>` : '';
  const commentary = excerpt.commentary ? `<p><em>Commentary:</em></p>` : '';

  // Properly escape the text and bookTitle for JavaScript string literals
  const escapedText = text.replace(/'/g, "\\'").replace(/\n/g, '\\n');
  const escapedBookTitle = bookTitle.replace(/'/g, "\\'");

  return `<div class="card">
${commentary}<p>${text}</p>${chapter}${verse}
<button 
    class="bring-to-main" 
    onclick="bringToMain('${escapedText}', '${escapedBookTitle}')"
>
    <img 
        src="/lovable-uploads/ic_launcher_round.png" 
        alt="Bring to Main" 
    />
    Bring to Main
</button>
</div>`;
}

function generateArticles() {
  const articlesDir = join(__dirname, '..', 'data', 'articles');
  const outputDir = join(__dirname, '..', 'public', 'articles');
  const files = readdirSync(articlesDir);

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  files.forEach(file => {
    if (extname(file) === '.json') {
      const jsonContent = readFileSync(join(articlesDir, file), 'utf8');
      const jsonData = JSON.parse(jsonContent);
      const html = generateArticle(jsonData);
      const outputFileName = file.replace('.json', '.html');
      writeFileSync(join(outputDir, outputFileName), html);
      console.log(`Generated ${outputFileName}`);
    }
  });
}

generateArticles();
