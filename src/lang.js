import { get, isPlainObject, isNil, isString, isEmpty, mergeWith } from 'lodash';
import langStorage from './langStorage';

const interpolatePattern = /{([\s\S]+?)}/g;
const DEFAULT_KEY = '_';

function customizer(objValue, srcValue) {
  if (!isPlainObject(srcValue) && !isString(srcValue)) {
    throw new Error('Can\'t override strings: source strings contains invalid value');
  } else if (isPlainObject(srcValue) && isString(objValue)) {
    throw new Error('Can\'t override strings: source strings must not change structure');
  }

  if (isString(srcValue)) {
    if (isEmpty(srcValue)) {
      return objValue;
    } else if (isPlainObject(objValue)) {
      objValue[DEFAULT_KEY] = srcValue;
      return objValue;
    }
  }
}

/**
 * just get language String fom collection
 * @param {Object} storage Storage of the strings
 * @param  {String} path Path to language string
 * @param {String} locale Current locale code or null
 * @return {String}      String from collection
 */
function getString(storage, path, locale) {
  let str = get(storage.getStrings(locale), path);

  // Attempt to process nested strings
  if (isPlainObject(str)) {
    str = str[DEFAULT_KEY];
  }

  return str || '';
}
/**
 * generate new localization function
 * @param  {String} [locale] code
 * @param  {Object} [storage]
 * @param  {Function} [onMissingString] Called when string is missing.
 * Can return new string to use instead of missing one.
 * Arguments will be: `lang`, `path`, `placeholders`, `locale`, `storage`
 * @return {Function}        localization function
 */
export default function langFactory(locale = null, storage = null, onMissingString = null) {

  // Use default langStorage if not specified
  if (!storage) {
    storage = langStorage;
  }

  /**
   * get and interpolate language string
   * @param  {String} path         path to language string
   * @param  {Array} [placeholders] Array or Object for placeholders' values
   * @return {String}              Interpolated string
   *
   * @example
   * allStrings = { common: {
   *   hello1: 'Hello {0}!',
   *   hello2: 'Hello {user.name}!',
   *   defaultUser: 'User'
   *   }}
   *
   * lang('common.defaultUser') -> User
   * lang('common.hello1', ['John']) -> Hello John!
   * lang('common.hello2', { user: { name: 'John' }}) -> Hello John!
   * lang('common.hello1', ['common.defaultUser']) -> Hello User!
   * lang('common.hello1', [null]) -> Hello !
   */
  function lang(path, placeholders) {
    let str = getString(storage, path, locale);
    if (!str && onMissingString) {
      str = onMissingString(lang, path, placeholders, locale, storage) || '';
    }
    if (placeholders) {
      str = str.replace(
        interpolatePattern,
        (k, t) => {
          let part = get(placeholders, t, '');

          // Try search in lang strings
          part = getString(storage, part, locale) || part;

          // Prevent display of null and undefined
          return isNil(part) ? '' : part;
        }
      );
    }
    return str;
  }
  lang.setLocale = (loc) => locale = loc;
  lang.override = (sourceStrings) => mergeWith(storage.getStrings(locale), sourceStrings, customizer);
  return lang;
}
