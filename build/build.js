#!/usr/bin/env node
// Build script: bundles JS using esbuild and inlines CSS into a single HTML file
import fs from 'fs';
import path from 'path';
import esbuild from 'esbuild';
import { watch as ywatch } from 'chokidar';

const ROOT = path.resolve(process.cwd());
const OUT_DIR = path.join(ROOT, 'build');
const OUT_FILE = path.join(OUT_DIR, 'index.light.html');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

const cssFile = path.join(ROOT, 'style.css');
const indexFile = path.join(ROOT, 'index.html');

const css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, 'utf8') : '';
// naive CSS minify (strip comments, collapse whitespace)
const minCss = css.replace(/\/\*[^]*?\*\//g, '').replace(/\s+/g, ' ').trim();

async function build(watch = false) {
  // bundle JS
  const result = await esbuild.build({
    entryPoints: [path.join(ROOT, 'script.js')],
    bundle: true,
    minify: true,
    format: 'iife',
    platform: 'browser',
    write: false,
  });
  const js = result.outputFiles[0].text;

  // read index.html and replace link/script tags
  const indexHtml = fs.readFileSync(indexFile, 'utf8');
  let outHtml = indexHtml.replace(/<link[^>]+href="style.css"[^>]*>/i, `<style>${minCss}</style>`);
  outHtml = outHtml.replace(/<script[^>]*src="script.js"[^>]*>\s*<\/script>/i, `<script>${js}</script>`);
  outHtml = outHtml.replace(/<script[^>]*type="module"[^>]*src="script.js"[^>]*>\s*<\/script>/i, `<script>${js}</script>`);

  fs.writeFileSync(OUT_FILE, outHtml, 'utf8');
  console.log('Built', OUT_FILE);
  if (watch) {
    console.log('Watching files for changes...');
    // Simple watch: watch key source files and rebuild on change
    const watcher = ywatch([path.join(ROOT, 'script.js'), path.join(ROOT, 'tasks.js'), path.join(ROOT, 'style.css'), path.join(ROOT, 'index.html')]);
    watcher.on('change', async (filePath) => {
      console.log('File changed:', filePath, 'Rebuilding...');
      try {
        await build(false);
      } catch (err) {
        console.error('Build failed:', err);
      }
    });
  }
}

const watching = process.argv.includes('--watch');
build(watching).catch(err => { console.error(err); process.exit(1); });
