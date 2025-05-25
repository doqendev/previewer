#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';

// Directory containing TTF fonts
const fontsDir = path.resolve(process.cwd(), 'public/fonts');
const loader = new TTFLoader();

fs.readdirSync(fontsDir)
  .filter(file => file.toLowerCase().endsWith('.ttf'))
  .forEach(file => {
    const filePath = path.join(fontsDir, file);
    const arrayBuffer = fs.readFileSync(filePath).buffer;
    const fontJson = loader.parse(arrayBuffer);
    const outName = file.replace(/\.ttf$/i, '.json');
    const outPath = path.join(fontsDir, outName);
    fs.writeFileSync(outPath, JSON.stringify(fontJson));
    console.log(`Generated ${outName}`);
  });
