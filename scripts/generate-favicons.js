const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const pngToIco = require('png-to-ico');

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function saveResized(srcPath, outDir, size, outName) {
  const img = await Jimp.read(srcPath);
  const squareSize = size; // maintain aspect but contain into square canvas
  const canvas = new Jimp(squareSize, squareSize, 0x00000000);
  // Fit image within square without distortion
  img.contain(squareSize, squareSize, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
  canvas.composite(img, 0, 0);
  const outPath = path.join(outDir, outName);
  await canvas.writeAsync(outPath);
  return outPath;
}

async function run() {
  // Source design.png from the new shared assets location
  const baseDir = path.resolve(__dirname, '..'); // hm/hm
  const assetsShared = path.join(baseDir, 'assets', 'shared');
  const nestedDir = path.join(baseDir, 'hm'); // hm/hm/hm (legacy duplicate)
  const srcCandidates = [
    path.join(assetsShared, 'design.png'),
    path.join(nestedDir, 'assets', 'shared', 'design.png'),
    path.join(baseDir, 'design.png'), // fallback
  ];
  let src = null;
  for (const p of srcCandidates) {
    if (fs.existsSync(p)) { src = p; break; }
  }
  if (!src) {
    console.error('design.png not found in hm/ or hm/hm/. Place it next to pages.');
    process.exit(1);
  }

  // Write favicons into the shared assets of both sites
  const outDirs = [assetsShared, path.join(nestedDir, 'assets', 'shared')];
  for (const outDir of outDirs) {
    await ensureDir(outDir);
    const png16 = await saveResized(src, outDir, 16, 'favicon-16x16.png');
    const png32 = await saveResized(src, outDir, 32, 'favicon-32x32.png');
    const png48 = await saveResized(src, outDir, 48, 'favicon-48x48.png');
    await saveResized(src, outDir, 180, 'apple-touch-icon.png');

    try {
      const icoBuf = await pngToIco([png16, png32, png48]);
      await fs.promises.writeFile(path.join(outDir, 'favicon.ico'), icoBuf);
      console.log('Wrote favicon.ico in', outDir);
    } catch (e) {
      console.warn('ICO generation failed (will still work with PNGs):', e.message);
    }
  }
  console.log('Favicons generated successfully.');
}

run().catch(err => { console.error(err); process.exit(1); });
