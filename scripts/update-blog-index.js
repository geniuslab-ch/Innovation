const fs = require('fs');
const path = require('path');

// Arguments: filename, title, category, date
const [, , articleFile, title, category, date] = process.argv;

if (!articleFile || !title || !category || !date) {
    console.error('Usage: node update-blog-index.js <filename> <title> <category> <date>');
    process.exit(1);
}

const blogIndexPath = path.join(__dirname, '..', 'blog.html');
let blogHtml = fs.readFileSync(blogIndexPath, 'utf8');

// Créer la nouvelle carte d'article
const newCard = `
        <!-- Article Auto-Published -->
        <article class="blog-card" data-category="${category}">
          <div class="blog-meta">
            <span class="blog-date">📅 ${date}</span>
            <span class="blog-category">${category}</span>
          </div>
          <h2><a href="${articleFile}">${title}</a></h2>
          <p class="blog-excerpt">Découvrez cet article sur ${category.toLowerCase()}.</p>
          <a href="${articleFile}" class="btn btn-secondary">Lire l'article →</a>
        </article>
`;

// Trouver la position où insérer (après <div class="blog-grid">)
const insertPosition = blogHtml.indexOf('<div class="blog-grid">') + '<div class="blog-grid">'.length;

// Insérer le nouvel article en premier
blogHtml = blogHtml.slice(0, insertPosition) + newCard + blogHtml.slice(insertPosition);

// Sauvegarder
fs.writeFileSync(blogIndexPath, blogHtml, 'utf8');

console.log(`✅ Blog index updated with: ${title}`);
