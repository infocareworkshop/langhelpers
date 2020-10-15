'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _mergeWith2=require('lodash/mergeWith');var _mergeWith3=_interopRequireDefault(_mergeWith2);var _isEmpty2=require('lodash/isEmpty');var _isEmpty3=_interopRequireDefault(_isEmpty2);var _isString2=require('lodash/isString');var _isString3=_interopRequireDefault(_isString2);var _isNil2=require('lodash/isNil');var _isNil3=_interopRequireDefault(_isNil2);var _isPlainObject2=require('lodash/isPlainObject');var _isPlainObject3=_interopRequireDefault(_isPlainObject2);var _get2=require('lodash/get');var _get3=_interopRequireDefault(_get2);exports.default=langFactory;var _langStorage=require('./langStorage');var _langStorage2=_interopRequireDefault(_langStorage);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var interpolatePattern=/{([\s\S]+?)}/g;var DEFAULT_KEY='_';function customizer(objValue,srcValue){if(!(0,_isPlainObject3.default)(srcValue)&&!(0,_isString3.default)(srcValue)){throw new Error('Can\'t override strings: source strings contains invalid value');}else if((0,_isPlainObject3.default)(srcValue)&&(0,_isString3.default)(objValue)){throw new Error('Can\'t override strings: source strings must not change structure');}if((0,_isString3.default)(srcValue)){if((0,_isEmpty3.default)(srcValue)){return objValue;}else if((0,_isPlainObject3.default)(objValue)){objValue[DEFAULT_KEY]=srcValue;return objValue;}}}/**
 * just get language String fom collection
 * @param {Object} storage Storage of the strings
 * @param  {String} path Path to language string
 * @param {String} locale Current locale code or null
 * @return {String}      String from collection
 */function getString(storage,path,locale){var str=(0,_get3.default)(storage.getStrings(locale),path);// Attempt to process nested strings
if((0,_isPlainObject3.default)(str)){str=str[DEFAULT_KEY];}return str||'';}/**
 * generate new localization function
 * @param  {String} [locale] code
 * @param  {Object} [storage]
 * @param  {Function} [onMissingString] Called when string is missing.
 * Can return new string to use instead of missing one.
 * Arguments will be: `lang`, `path`, `placeholders`, `locale`, `storage`
 * @return {Function}        localization function
 */function langFactory(){var locale=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;var storage=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;var onMissingString=arguments.length>2&&arguments[2]!==undefined?arguments[2]:null;// Use default langStorage if not specified
if(!storage){storage=_langStorage2.default;}/**
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
   */function lang(path,placeholders){var str=getString(storage,path,locale);if(!str&&onMissingString){str=onMissingString(lang,path,placeholders,locale,storage)||'';}if(placeholders){str=str.replace(interpolatePattern,function(k,t){var part=(0,_get3.default)(placeholders,t,'');// Try search in lang strings
part=getString(storage,part,locale)||part;// Prevent display of null and undefined
return(0,_isNil3.default)(part)?'':part;});}return str;}lang.setLocale=function(loc){return locale=loc;};lang.override=function(sourceStrings){return(0,_mergeWith3.default)(storage.getStrings(locale),sourceStrings,customizer);};return lang;}module.exports=exports['default'];