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
            <style>
                .ads-card {
                    width: 90%;
                    max-width: 600px;
                    height: 200px;
                    background: #07182E;
                    position: relative;
                    display: flex;
                    place-content: center;
                    place-items: center;
                    overflow: hidden;
                    border-radius: 20px;
                    margin: 2rem auto;
                }

                .ads-card-content {
                    z-index: 1;
                    text-align: center;
                    padding: 20px;
                }

                .ads-card::before {
                    content: '';
                    position: absolute;
                    width: 150px;
                    background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255));
                    height: 130%;
                    animation: rotBGimg 3s linear infinite;
                    transition: all 0.2s linear;
                }

                @keyframes rotBGimg {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .ads-card::after {
                    content: '';
                    position: absolute;
                    background: #07182E;
                    inset: 5px;
                    border-radius: 15px;
                }
            </style>
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
      // Add Footer HTML with light text colors
      html += `
    <div class="mt-8 text-center">
        <div class="p-4 sm:p-6 text-center" style="color: #ffffff;">
            <h2 class="text-lg font-semibold mb-4">Support Atmanam Viddhi</h2>
            <div class="flex flex-col items-center gap-4">
                <a href="https://www.buymeacoffee.com/botman1001">
                    <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a book&emoji=📖&slug=botman1001&button_colour=BD5FFF&font_colour=ffffff&font_family=Comic&outline_colour=000000&coffee_colour=FFDD00" />
                </a>
                <div class="mt-4 p-4 bg-white/5 rounded-lg w-full max-w-sm">
                    <h3 class="text-sm font-medium mb-2">UPI Payment (India)</h3>
                    <div class="cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#1A4067] hover:bg-[#1A4067]/80 rounded-md transition-colors" onclick="navigator.clipboard.writeText('atmanamviddhi@axl')">
                        <span>atmanamviddhi@axl</span>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <div class="flex justify-center gap-4 text-xs" style="color: #ffffff;">
            <a href="/" class="hover:text-primary transition-colors" style="color: #ffffff;">Home</a>
            <a href="/about" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors" style="color: #ffffff;">About</a>
            <a href="/blog" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors" style="color: #ffffff;">Blog</a>
            <a href="https://www.termsfeed.com/live/cecc03b1-3815-4a4e-b8f8-015d7679369d" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors" style="color: #ffffff;">Privacy Policy</a>
        </div>
        <div class="mt-4 text-xs" style="color: #ffffff;">
            <p>We welcome your feedback and suggestions. Please email us at <a href="mailto:thinkinglatenite@gmail.com" class="hover:text-primary transition-colors" style="color: #ffffff;">thinkinglatenite@gmail.com</a>.</p>
        </div>
    </div>`;    html += '</div>\n</body>\n</html>'; return html;
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
