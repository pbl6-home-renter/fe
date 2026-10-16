const fs = require('fs');
const path = require('path');

const localesDir = path.resolve(__dirname, '../src/i18n/locales');
const sourceLang = 'vi';
const targetLangs = ['en'];

function deepMerge(source, target) {
  for (const key of Object.keys(source)) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      target[key] = target[key] || {};
      deepMerge(source[key], target[key]);
    } else if (target[key] === undefined) {
      target[key] = source[key];
    }
  }
  return target;
}

function sync() {
  const sourceDir = path.join(localesDir, sourceLang);
  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith('.json'));

  for (const targetLang of targetLangs) {
    const targetDir = path.join(localesDir, targetLang);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);

      const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
      const targetData = fs.existsSync(targetFile)
        ? JSON.parse(fs.readFileSync(targetFile, 'utf8'))
        : {};

      const synced = deepMerge(sourceData, targetData);
      fs.writeFileSync(targetFile, JSON.stringify(synced, null, 2) + '\n');
      console.log(`Synced: ${file} (${sourceLang} -> ${targetLang})`);
    }
  }
  console.log('Translations successfully synchronized!');
}

sync();

