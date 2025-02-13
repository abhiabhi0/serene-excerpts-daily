import fs from 'fs';
import path from 'path';

const articlesDir = path.join(process.cwd(), 'public', 'articles');
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
const baseUrl = 'https://atmanamviddhi.in';

const getArticles = () => {
  return fs.readdirSync(articlesDir)
    .filter(file => file.endsWith('.html'))
    .map(file => ({
      loc: `${baseUrl}/articles/${file}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.5
    }));
};

const generateSitemap = (articles) => {
  const urls = articles.map(article => `
  <url>
    <loc>${article.loc}</loc>
    <lastmod>${article.lastmod}</lastmod>
    <changefreq>${article.changefreq}</changefreq>
    <priority>${article.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>${urls}
</urlset>`;
};

const articles = getArticles();
const sitemap = generateSitemap(articles);

fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('Sitemap updated successfully.');