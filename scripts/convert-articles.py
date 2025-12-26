#!/usr/bin/env python3
"""
Script de conversion automatique des articles Word en HTML
Convertit tous les fichiers .docx du dossier source en articles HTML avec le design GeniusLab
"""

import os
import re
from pathlib import Path
from datetime import datetime, timedelta
from docx import Document

# Configuration
SOURCE_DIR = "/Users/nourascharer/Desktop/Geniuslab v2/Innovation/30 articles de blogs numéroté"
OUTPUT_DIR = "/Users/nourascharer/Desktop/Geniuslab v2/Innovation/blog-drafts"
BASE_URL = "https://geniuslab.ch"

# Mapping des catégories
CATEGORY_MAP = {
    "No Code": "No-Code",
    "no code": "No-Code",
    "IA": "Intelligence Artificielle",
    "ia": "Intelligence Artificielle",
    "Suisse": "Suisse"
}

# Template HTML
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>{title} | GeniusLab Blog</title>
  <meta name="description" content="{description}">
  <meta name="keywords" content="{keywords}">
  <link rel="canonical" href="{canonical_url}">
  
  <link rel="stylesheet" href="styles.css">
  
  <script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
  new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  }})(window,document,'script','dataLayer','GTM-N5XBW5VJ');</script>
  
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-10825850251"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'AW-10825850251');
  </script>
</head>
<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N5XBW5VJ" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

  <nav class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="index.html"><img src="logo.png" alt="GeniusLab" class="brand-logo" /></a>
      <div class="topbar-actions">
        <a class="toplink" href="index.html">Accueil</a>
        <a class="toplink" href="blog.html">Blog</a>
        <a class="toplink" href="faq.html">FAQ</a>
        <a class="btn btn-ghost" href="index.html#formulaire">S'inscrire</a>
      </div>
    </div>
  </nav>

  <article class="blog-article">
    <div class="container" style="max-width: 800px;">
      
      <header class="article-header">
        <div class="article-meta">
          <span>📅 {date}</span>
          <span class="blog-category">{category}</span>
        </div>
        <h1>{title}</h1>
        <p class="article-intro">{intro}</p>
      </header>

      <div class="article-content">
        {content}

        <div class="article-cta">
          <h3>Prêt à lancer votre startup ?</h3>
          <p>Rejoignez notre formation et transformez votre idée en réalité avec le No-Code et l'IA.</p>
          <a href="index.html#formulaire" class="btn btn-primary">Postuler à la formation</a>
        </div>

      </div>

      <footer class="article-footer">
        <a href="blog.html" class="btn btn-secondary">← Retour au blog</a>
      </footer>

    </div>
  </article>

  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-left">
        <img src="logo.png" alt="GeniusLab" class="footer-logo" />
        <div class="footer-meta">
          <div class="footer-title">GeniusLab</div>
          <div class="footer-sub">L'avenir de l'entrepreneuriat commence ici</div>
        </div>
      </div>
      <div class="footer-right">
        <a class="footer-link" href="index.html">Accueil</a>
        <a class="footer-link" href="blog.html">Blog</a>
        <a class="footer-link" href="faq.html">FAQ</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© 2025 GeniusLab. Tous droits réservés.</p>
    </div>
  </footer>

  <style>
    .blog-article {{padding: 80px 0 60px;}}
    .article-header {{text-align: center; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 1px solid rgba(168,85,247,.2);}}
    .article-meta {{display: flex; gap: 12px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;}}
    .article-header h1 {{font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 16px; line-height: 1.2;}}
    .article-intro {{font-size: 1.2rem; color: rgba(249,250,251,.8); max-width: 700px; margin: 0 auto;}}
    .article-content {{line-height: 1.8; color: rgba(249,250,251,.9);}}
    .article-content h2 {{font-size: 2rem; margin: 50px 0 20px; padding-top: 20px; border-top: 2px solid rgba(168,85,247,.3);}}
    .article-content h3 {{font-size: 1.5rem; margin: 30px 0 15px; color: var(--g3);}}
    .article-content p {{margin-bottom: 20px;}}
    .article-content ul, .article-content ol {{margin: 20px 0 20px 30px;}}
    .article-content li {{margin-bottom: 12px;}}
    .article-content strong {{color: var(--text); font-weight: 700;}}
    .article-content table {{border-collapse: collapse; width: 100%; margin: 20px 0;}}
    .article-content th, .article-content td {{padding: 12px; border: 1px solid rgba(168,85,247,.3);}}
    .article-content th {{background: rgba(168,85,247,.2); font-weight: 700;}}
    .article-cta {{background: linear-gradient(135deg, rgba(34,211,238,.15), rgba(168,85,247,.15)); border: 1px solid rgba(168,85,247,.3); border-radius: var(--r-lg); padding: 40px; text-align: center; margin: 60px 0 40px;}}
    .article-cta h3 {{font-size: 1.8rem; margin-bottom: 12px;}}
    .article-cta p {{margin-bottom: 24px; font-size: 1.1rem;}}
    .article-footer {{margin-top: 60px; padding-top: 30px; border-top: 1px solid rgba(168,85,247,.2);}}
  </style>
</body>
</html>"""


def extract_filename_parts(filename):
    """Extrait le numéro, la catégorie et le titre du nom de fichier"""
    # Format: "01-No Code-Titre.docx"
    match = re.match(r'(\d+)-(.*?)-(.*?)\.docx', filename)
    if match:
        number = match.group(1)
        category = match.group(2).strip()
        title = match.group(3).strip()
        return number, category, title
    return None, None, None


def read_docx(file_path):
    """Lit le contenu d'un fichier Word"""
    try:
        doc = Document(file_path)
        paragraphs = []
        for para in doc.paragraphs:
            text = para.text.strip()
            if text:
                paragraphs.append(text)
        return paragraphs
    except Exception as e:
        print(f"Erreur lors de la lecture de {file_path}: {e}")
        return []


def convert_text_to_html(paragraphs):
    """Convertit les paragraphes en HTML structuré"""
    html_parts = []
    current_list = []
    in_list = False
    
    for para in paragraphs:
        # Détection des titres (lignes courtes en majuscules ou avec émojis)
        if len(para) < 100 and (para.isupper() or any(emoji in para for emoji in ['👉', '✅', '❌', '🚀', '💰', '🧠'])):
            # Fermer la liste si ouverte
            if in_list:
                html_parts.append('</ul>')
                in_list = False
            
            # Déterminer le niveau de titre
            if len(para) < 50:
                html_parts.append(f'<h2>{para}</h2>')
            else:
                html_parts.append(f'<h3>{para}</h3>')
        
        # Détection des listes (commence par - ou •)
        elif para.startswith(('-', '•', '→', '👉')):
            if not in_list:
                html_parts.append('<ul>')
                in_list = True
            clean_text = para.lstrip('-•→👉 ')
            html_parts.append(f'<li>{clean_text}</li>')
        
        # Paragraphe normal
        else:
            if in_list:
                html_parts.append('</ul>')
                in_list = False
            
            # Mettre en gras les mots importants
            para = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', para)
            html_parts.append(f'<p>{para}</p>')
    
    # Fermer la liste si encore ouverte
    if in_list:
        html_parts.append('</ul>')
    
    return '\n        '.join(html_parts)


def generate_slug(title):
    """Génère un slug URL-friendly"""
    slug = title.lower()
    slug = re.sub(r'[àáâãäå]', 'a', slug)
    slug = re.sub(r'[èéêë]', 'e', slug)
    slug = re.sub(r'[ìíîï]', 'i', slug)
    slug = re.sub(r'[òóôõö]', 'o', slug)
    slug = re.sub(r'[ùúûü]', 'u', slug)
    slug = re.sub(r'[ç]', 'c', slug)
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug[:50]  # Limiter la longueur


def calculate_publish_date(article_number):
    """Calcule la date de publication (lundis à partir du 30 décembre 2025)"""
    start_date = datetime(2025, 12, 30)  # Premier lundi
    weeks_to_add = int(article_number) - 1
    publish_date = start_date + timedelta(weeks=weeks_to_add)
    
    # Format français
    months_fr = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    return f"{publish_date.day} {months_fr[publish_date.month - 1]} {publish_date.year}"


def convert_article(docx_path, output_dir):
    """Convertit un article Word en HTML"""
    filename = os.path.basename(docx_path)
    number, category, title = extract_filename_parts(filename)
    
    if not number or not category or not title:
        print(f"❌ Impossible de parser le nom de fichier: {filename}")
        return False
    
    print(f"📝 Conversion de l'article {number}: {title}")
    
    # Lire le contenu
    paragraphs = read_docx(docx_path)
    if not paragraphs:
        print(f"❌ Aucun contenu trouvé dans {filename}")
        return False
    
    # Le premier paragraphe est le titre, le reste est le contenu
    full_title = paragraphs[0] if paragraphs else title
    content_paragraphs = paragraphs[1:] if len(paragraphs) > 1 else paragraphs
    
    # Convertir en HTML
    html_content = convert_text_to_html(content_paragraphs)
    
    # Générer les métadonnées
    category_clean = CATEGORY_MAP.get(category, category)
    slug = generate_slug(title)
    filename_html = f"{number}-{slug}.html"
    publish_date = calculate_publish_date(number)
    
    # Créer une intro à partir des premiers paragraphes
    intro = content_paragraphs[0][:200] + "..." if content_paragraphs else "Découvrez cet article sur " + category_clean.lower()
    
    # Générer les keywords
    keywords = f"{category_clean.lower()}, startup, entrepreneuriat, no-code"
    
    # Remplir le template
    html = HTML_TEMPLATE.format(
        title=full_title,
        description=intro,
        keywords=keywords,
        canonical_url=f"{BASE_URL}/{filename_html}",
        date=publish_date,
        category=category_clean,
        intro=intro,
        content=html_content
    )
    
    # Sauvegarder
    output_path = os.path.join(output_dir, filename_html)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✅ Article {number} créé: {filename_html}")
    return True


def main():
    """Fonction principale"""
    print("🚀 Démarrage de la conversion des articles...\n")
    
    # Créer le dossier de sortie si nécessaire
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Lister tous les fichiers .docx
    docx_files = sorted(Path(SOURCE_DIR).glob("*.docx"))
    
    if not docx_files:
        print(f"❌ Aucun fichier .docx trouvé dans {SOURCE_DIR}")
        return
    
    print(f"📚 {len(docx_files)} articles trouvés\n")
    
    # Convertir chaque article
    success_count = 0
    for docx_file in docx_files:
        if convert_article(str(docx_file), OUTPUT_DIR):
            success_count += 1
        print()
    
    print(f"\n✅ Conversion terminée: {success_count}/{len(docx_files)} articles convertis")
    print(f"📁 Articles sauvegardés dans: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
