#!/usr/bin/env node
// Minifie le code HTML (+ CSS + JS inline) pour le déploiement sur GitHub Pages.
// Lit /home/claude/getmanifest.html (source lisible) et produit index.html minifié.

const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const SRC = path.join(__dirname, 'index.html');  // on part de ce qui a été copié depuis getmanifest.html
const OUT = SRC;  // on écrit dans le même fichier

(async () => {
  const raw = fs.readFileSync(SRC, 'utf8');
  const originalKB = (raw.length / 1024).toFixed(1);

  const result = await minify(raw, {
    collapseWhitespace: true,
    conservativeCollapse: false,
    removeComments: true,
    minifyCSS: true,
    minifyJS: {
      compress: {
        drop_console: false,  // on garde les console.warn pour debug prod
      },
      mangle: true,
      format: { comments: false },
    },
    minifyURLs: false,
    removeAttributeQuotes: false,  // garde les quotes pour éviter des surprises
    removeRedundantAttributes: true,
    useShortDoctype: true,
  });

  const minifiedKB = (result.length / 1024).toFixed(1);
  const ratio = ((1 - result.length / raw.length) * 100).toFixed(1);
  fs.writeFileSync(SRC, result, 'utf8');
  console.log(`Minified: ${originalKB}KB → ${minifiedKB}KB (-${ratio}%)`);
})().catch(e => {
  console.error('Build error:', e);
  process.exit(1);
});
