#!/usr/bin/env node
// Node >=22.15. No npm packages, image decoder, or generated output required.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, relative, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { registerHooks, stripTypeScriptTypes } from 'node:module';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = resolve(root, 'public');
const errors = [], warnings = [], pngs = new Map(), refs = new Set();
const fail = message => errors.push(message);
const warn = message => warnings.push(message);
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);

// Read the actual PNG signature/IHDR, never infer dimensions from a filename.
for (const file of walk(publicRoot).filter(file => extname(file) === '.png')) {
  const name = relative(publicRoot, file).split('\\').join('/');
  const bytes = readFileSync(file);
  if (bytes.length < 33 || !bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ||
      bytes.readUInt32BE(8) !== 13 || bytes.toString('ascii', 12, 16) !== 'IHDR') {
    fail(`${name}: invalid PNG signature/IHDR`); continue;
  }
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  if (!width || !height || width > 0x7fffffff || height > 0x7fffffff) fail(`${name}: invalid dimensions`);
  pngs.set(name, { width, height });
}

// Existing high-resolution originals remain intact. These exceptions must not
// silently expand: different dimensions require another visual audit.
const legacyDimensions = {
  'maps/cactus-64.png': [1254,1254],
  'maps/desert-sand-64.png': [1254,1254],
  'maps/church-town-320x256.png': [1402,1122],
  'maps/ruins-gate-128.png': [1402,1122],
};
for (const [name, { width, height }] of pngs) {
  const size = name.match(/-(\d+)(?:x(\d+))?\.png$/);
  if (!size) continue; // portraits, backdrops and atlases have independent grids
  const expected = [Number(size[1]), Number(size[2] ?? size[1])];
  if (width === expected[0] && height === expected[1]) continue;
  const legacy = legacyDimensions[name];
  if (legacy?.[0] === width && legacy[1] === height) warn(`${name}: ${width}x${height}; filename suggests ${expected.join('x')} (preserved original)`);
  else fail(`${name}: ${width}x${height}; filename requires ${expected.join('x')}`);
}

function asset(src, owner) {
  if (typeof src !== 'string' || !src) { fail(`${owner}: missing asset path`); return; }
  const name = src.replace(/^\//, '').split(/[?#]/)[0];
  const full = resolve(publicRoot, name);
  if (!full.startsWith(publicRoot + '/') || !existsSync(full)) fail(`${owner}: missing public/${name}`);
  refs.add(name);
  return pngs.get(name);
}

// Also catch direct references outside the catalog (portraits, backdrops, etc.).
// Computed renderer paths are checked through the evaluated catalog below.
for (const file of walk(resolve(root, 'src')).filter(file => /\.(tsx?|css)$/.test(file))) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(/["'`](\/?(?:maps|sprites|portraits|prologue)\/[^"'`\s${}]+\.(?:png|svg|webp|jpg))["'`]/g))
    asset(match[1], relative(root, file));
}

// Evaluate the real TS definitions with Node's built-in type erasure. Resolve
// extensionless local imports too, including the prop atlas metadata module.
const hooks = registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('.') && context.parentURL?.startsWith('file:') && !extname(specifier)) {
      const file = fileURLToPath(new URL(specifier + '.ts', context.parentURL));
      if (existsSync(file)) return next(pathToFileURL(file).href, context);
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith('file:') && url.endsWith('.ts')) return {
      format: 'module', shortCircuit: true,
      source: stripTypeScriptTypes(readFileSync(fileURLToPath(url), 'utf8'), { sourceUrl: url }),
    };
    return next(url, context);
  },
});
let catalog;
try { catalog = await import(pathToFileURL(resolve(root, 'src/world/catalog.ts')).href); }
finally { hooks.deregister(); }

function visualCheck(visual, owner, blocked = []) {
  const { width, height, anchor } = visual;
  if (![width,height].every(n => Number.isFinite(n) && n > 0) ||
      !anchor || ![anchor.x,anchor.y].every(n => Number.isFinite(n) && n >= 0 && n <= 1)) {
    fail(`${owner}: invalid visual size/anchor`); return;
  }
  const left = anchor.x * (1-width), top = anchor.y * (1-height);
  const cells = new Set();
  for (const cell of blocked) {
    const key = `${cell.x},${cell.y}`;
    if (![cell.x,cell.y].every(Number.isInteger) || cells.has(key)) fail(`${owner}: invalid/duplicate blocked cell ${key}`);
    cells.add(key);
    // A cell may exceed transparent sprite margins, but must intersect its box.
    if (cell.x+1 <= left || cell.x >= left+width || cell.y+1 <= top || cell.y >= top+height)
      fail(`${owner}: blocked cell ${key} lies outside visual bounds`);
  }
  if (visual.renderer !== 'image' && visual.renderer !== 'atlas') return;
  const dimensions = asset(visual.src, owner);
  if (!dimensions) return; // SVG references are still checked for existence
  if (visual.renderer === 'atlas') {
    const frame = visual.frame;
    if (visual.sourceWidth !== dimensions.width || visual.sourceHeight !== dimensions.height)
      fail(`${owner}: atlas source dimensions disagree with PNG`);
    if (!Array.isArray(frame) || frame.length !== 4 || !frame.every(Number.isInteger) ||
        frame[0] < 0 || frame[1] < 0 || frame[2] <= 0 || frame[3] <= 0 ||
        frame[0]+frame[2] > dimensions.width || frame[1]+frame[3] > dimensions.height)
      fail(`${owner}: atlas frame outside PNG`);
    return; // atlas crops preserve aspect ratio inside their logical layout box
  }
  const ratioError = Math.abs(dimensions.width / dimensions.height / (width / height) - 1);
  if (ratioError > .02) {
    const message = `${owner}: ${dimensions.width}x${dimensions.height} image vs layout box ${width}x${height} cells (${width*64}x${height*64}px)`;
    if (owner === 'building.ruinsGate' || owner === 'prop.cactus') warn(message + ' (existing catalog difference)');
    else fail(message);
  }
  if (dimensions.width < width*64 || dimensions.height < height*64)
    warn(`${owner}: source ${dimensions.width}x${dimensions.height} smaller than logical box ${width*64}x${height*64}px`);
}

for (const [category, chips] of Object.entries(catalog.chipCatalog)) for (const [id, chip] of Object.entries(chips)) {
  const owner = `${category}.${id}`;
  if (chip.image) {
    const dimensions = asset(chip.image, owner);
    if (dimensions && dimensions.width !== dimensions.height) fail(`${owner}: terrain tile must be square`);
  }
  if (chip.set && !(chip.set in catalog.terrainSets)) fail(`${owner}: unknown terrain set ${chip.set}`);
  if (chip.visual) visualCheck(chip.visual, owner, chip.blockedCells);
  if (chip.overlay) visualCheck(chip.overlay, owner + '.overlay');
}
for (const id of ['house','church']) {
  const chip = catalog.buildingChips[id];
  const cells = new Set(chip.blockedCells.map(p => `${p.x},${p.y}`));
  if (chip.visual.width !== 5 || chip.visual.height !== 4 || chip.visual.anchor.x !== 0 || chip.visual.anchor.y !== 0 ||
      cells.size !== 19 || cells.has('2,3') ||
      Array.from({length:20}, (_, i) => `${i%5},${Math.floor(i/5)}`).some(key => key !== '2,3' && !cells.has(key)))
    fail(`building.${id}: expected 5x4 footprint with open doorway at 2,3`);
}
if (!catalog.buildingChips.ruinsGate.blockedCells.length)
  warn('building.ruinsGate: empty collision footprint; gate transition is managed by map events');

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
console.log(`${errors.length ? 'FAIL' : 'PASS'}: ${pngs.size} PNG headers, ${refs.size} asset references, ${Object.keys(catalog.terrainSets).length} terrain sets; ${warnings.length} warnings, ${errors.length} errors`);
process.exitCode = errors.length ? 1 : 0;
