const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to extract translation keys from a file
function extractTranslationKeys(content) {
  const regex = /t\(['"](.*?)['"]\)/g;
  const keys = new Set();
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return Array.from(keys);
}

// Function to get all translation keys from translation files
function getExistingTranslations(translationFile) {
  const content = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
  
  function extractKeys(obj, prefix = '') {
    let keys = [];
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        keys = [...keys, ...extractKeys(value, newKey)];
      } else {
        keys.push(newKey);
      }
    }
    return keys;
  }
  
  return extractKeys(content);
}

// Main function
async function findMissingTranslations() {
  // Get all TSX files
  const files = glob.sync('app/**/*.tsx');
  
  // Extract all used translation keys
  const usedKeys = new Set();
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    extractTranslationKeys(content).forEach(key => usedKeys.add(key));
  });
  
  // Get existing translations
  const enTranslations = getExistingTranslations('public/locales/en/translation.json');
  const arTranslations = getExistingTranslations('public/locales/ar/translation.json');
  
  // Find missing keys
  const missingInEn = Array.from(usedKeys).filter(key => !enTranslations.includes(key));
  const missingInAr = Array.from(usedKeys).filter(key => !arTranslations.includes(key));
  
  // Output results
  console.log('Missing in English translations:');
  missingInEn.forEach(key => console.log(`- ${key}`));
  
  console.log('\nMissing in Arabic translations:');
  missingInAr.forEach(key => console.log(`- ${key}`));
  
  // Write results to file
  const output = {
    missingInEnglish: missingInEn,
    missingInArabic: missingInAr
  };
  
  fs.writeFileSync('missing-translations.json', JSON.stringify(output, null, 2));
}

findMissingTranslations().catch(console.error); 