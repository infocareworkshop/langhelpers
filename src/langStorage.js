/**
 * Create new lang storage
 * @param langStrings Actual lang strings
 * @returns {object}
 */
export function storageFactory(langStrings) {
  return {
    setStrings: (data) => langStrings = data,
    getStrings: (locale) =>
      locale ? (langStrings[locale] || (langStrings[locale] = {})) : langStrings,
  };
}

export default (storageFactory(
  (typeof window !== 'undefined' && window.__LANG_STRINGS__) ? window.__LANG_STRINGS__ : {}
));
