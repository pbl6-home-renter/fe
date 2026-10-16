/** @type {import('i18n-unused').RunOptions} */
module.exports = {
  localesPath: 'src/i18n/locales',
  srcPath: 'src',
  srcExtensions: ['ts', 'tsx', 'js', 'jsx'],
  translationKeyMatcher: /(?:titleKey|i18nKey|[\s.(]t|[\s.(]tc)\s*[:(]\s*['"]([^'"\n]+)['"]/g,
  missedTranslationParser: /(?:titleKey|i18nKey|[\s.(]t|[\s.(]tc)\s*[:(]\s*['"]([^'"\n]+)['"]/g,
};

