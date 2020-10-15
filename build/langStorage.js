'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.storageFactory=storageFactory;/**
 * Create new lang storage
 * @param langStrings Actual lang strings
 * @returns {object}
 */function storageFactory(langStrings){return{setStrings:function setStrings(data){return langStrings=data;},getStrings:function getStrings(locale){return locale?langStrings[locale]||(langStrings[locale]={}):langStrings;}};}exports.default=storageFactory(typeof window!=='undefined'&&window.__LANG_STRINGS__?window.__LANG_STRINGS__:{});