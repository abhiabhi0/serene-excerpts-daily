import fs from 'fs';
import path from 'path';

const articlesDir = path.join(process.cwd(), 'public', 'articles');
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
const baseUrl = 'https://atmanamviddhi.in';

// Get all articles from the Blog.tsx data
const getBlogArticles = () => {
  const blogPath = path.join(process.cwd(), 'src', 'pages', 'Blog.tsx');
  const blogContent = fs.readFileSync(blogPath, 'utf8');
  
  // Extract articles array using regex
  const articlesMatch = blogContent.match(/const articles = (\[[\s\S]*?\]);/);
  if (!articlesMatch) return [];
  
  try {
    // Safely evaluate the articles array
    const articles = eval(articlesMatch[1]);
    return articles.map(article => ({
      loc: `${baseUrl}${article.url}`,
      lastmod: new Date(article.date).toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.5
    }));
  } catch (error) {
    console.error('Error parsing articles:', error);
    return [];
  }
};

const generateSitemap = (articles) => {
  const staticPages = [
    {
      loc: baseUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.9
    }
  ];

  const allUrls = [...staticPages, ...articles]
    .map(page => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allUrls}
</urlset>`;
};

// Execute sitemap generation
const articles = getBlogArticles();
const sitemap = generateSitemap(articles);
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`Sitemap generated with ${articles.length} articles and 3 static pages.`);