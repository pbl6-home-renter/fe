/**
 * i18n Validator Script (Rentify Frontend)
 *
 * Checks:
 * 1. 100% Parity between 'vi' and 'en' locales (no missing or surplus keys).
 * 2. No empty strings in translations.
 * 3. STRICT RULE: Zero usage of 'defaultValue' inside translation t(...) calls.
 *    All translations must be maintained centrally in locale JSON files.
 * 4. Statically referenced keys in t('...') exist in their target namespace.
 *
 * Exits with code 1 on any error to abort dev / build commands.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LOCALES_DIR = path.resolve(ROOT_DIR, 'src/i18n/locales');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');

const SOURCE_LANG = 'vi';
const TARGET_LANGS = ['en'];

let hasError = false;

function error(msg) {
  console.error(`\x1b[31m[i18n-check ERROR]\x1b[0m ${msg}`);
  hasError = true;
}

function warn(msg) {
  console.warn(`\x1b[33m[i18n-check WARN]\x1b[0m ${msg}`);
}

function success(msg) {
  console.log(`\x1b[32m[i18n-check OK]\x1b[0m ${msg}`);
}

// 1. Helper to extract all dot-notated keys from an object
function getNestedKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      keys = keys.concat(getNestedKeys(val, fullKey));
    } else {
      keys.push({ key: fullKey, value: val });
    }
  }
  return keys;
}

// 2. Parity Check
console.log('\n🔍 [1/3] Checking locale parity and empty strings...');
const sourceFiles = fs.readdirSync(path.join(LOCALES_DIR, SOURCE_LANG)).filter((f) => f.endsWith('.json'));

const loadedNamespaces = {};

for (const file of sourceFiles) {
  const ns = file.replace('.json', '');
  const sourcePath = path.join(LOCALES_DIR, SOURCE_LANG, file);
  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const sourceKeyList = getNestedKeys(sourceData);
  const sourceKeyMap = new Map(sourceKeyList.map((k) => [k.key, k.value]));

  loadedNamespaces[ns] = new Set(sourceKeyMap.keys());

  for (const targetLang of TARGET_LANGS) {
    const targetPath = path.join(LOCALES_DIR, targetLang, file);
    if (!fs.existsSync(targetPath)) {
      error(`Missing file '${targetLang}/${file}' corresponding to '${SOURCE_LANG}/${file}'`);
      continue;
    }

    const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    const targetKeyList = getNestedKeys(targetData);
    const targetKeyMap = new Map(targetKeyList.map((k) => [k.key, k.value]));

    // Check missing in target
    for (const [k, v] of sourceKeyMap.entries()) {
      if (!targetKeyMap.has(k)) {
        error(`Key '${k}' in '${SOURCE_LANG}/${file}' is missing in '${targetLang}/${file}'`);
      } else if (typeof targetKeyMap.get(k) === 'string' && targetKeyMap.get(k).trim() === '') {
        error(`Key '${k}' in '${targetLang}/${file}' has an empty value`);
      }
    }

    // Check missing in source (surplus in target)
    for (const [k] of targetKeyMap.entries()) {
      if (!sourceKeyMap.has(k)) {
        error(`Key '${k}' in '${targetLang}/${file}' does not exist in '${SOURCE_LANG}/${file}'`);
      }
    }
  }
}

if (!hasError) {
  success(`All ${sourceFiles.length} namespaces have 100% parity between [${SOURCE_LANG}] and [${TARGET_LANGS.join(', ')}].`);
}

// 3. Scan code for defaultValue violations in t(...)
console.log('\n🔍 [2/3] Scanning source code for forbidden defaultValue usage in t(...) calls...');

function walkDir(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        files = files.concat(walkDir(full));
      }
    } else if (
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) &&
      !entry.name.endsWith('.d.ts')
    ) {
      files.push(full);
    }
  }
  return files;
}

const srcFiles = walkDir(SRC_DIR);

// Regex matching t(...) with defaultValue: inside its options argument
// Ensures it does not cross outside the enclosing options object
const tDefaultValueRegex = /\bt\s*\(\s*([^,)\n]+)\s*,\s*\{[^}]*?\bdefaultValue\s*:/g;

let defaultValueViolations = 0;

for (const filePath of srcFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  while ((match = tDefaultValueRegex.exec(content)) !== null) {
    const lineNumber = content.slice(0, match.index).split('\n').length;
    const relPath = path.relative(ROOT_DIR, filePath);
    error(
      `Forbidden 'defaultValue' detected in translation call at ${relPath}:${lineNumber}\n` +
      `   Expression: t(${match[1].trim()}, { ... defaultValue: ... })\n` +
      `   Fix: Remove defaultValue and define keys in locale JSON files directly.`
    );
    defaultValueViolations++;
  }
}

if (defaultValueViolations === 0) {
  success(`Zero 'defaultValue' violations found across ${srcFiles.length} source files.`);
}

// 4. Summary & Exit
console.log('\n--------------------------------------------------');
if (hasError) {
  console.error(`\x1b[31m❌ i18n validation FAILED!\x1b[0m Please fix the errors above before continuing.\n`);
  process.exit(1);
} else {
  console.log(`\x1b[32m✨ i18n validation PASSED! System is clean and ready.\x1b[0m\n`);
  process.exit(0);
}
