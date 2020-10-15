'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _regenerator=require('babel-runtime/regenerator');var _regenerator2=_interopRequireDefault(_regenerator);var _stringify=require('babel-runtime/core-js/json/stringify');var _stringify2=_interopRequireDefault(_stringify);var _asyncToGenerator2=require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3=_interopRequireDefault(_asyncToGenerator2);var _pick2=require('lodash/pick');var _pick3=_interopRequireDefault(_pick2);var _mapValues2=require('lodash/mapValues');var _mapValues3=_interopRequireDefault(_mapValues2);var _fs=require('fs');var _fs2=_interopRequireDefault(_fs);var _got=require('got');var _got2=_interopRequireDefault(_got);var _path=require('path');var _path2=_interopRequireDefault(_path);var _langStorage=require('./langStorage');var _langStorage2=_interopRequireDefault(_langStorage);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function filterFolders(langStrings,allowedFolders){if(!allowedFolders)return langStrings;return(0,_mapValues3.default)(langStrings,function(folders){return(0,_pick3.default)(folders,allowedFolders);});}/**
 * Load lang strings from localization server
 * @return {Promise}
 */exports.default=function(){var _ref=(0,_asyncToGenerator3.default)(/*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2){var url=_ref2.url,_ref2$s3url=_ref2.s3url,s3url=_ref2$s3url===undefined?null:_ref2$s3url,storage=_ref2.storage,stopWhenLocalesUnawailable=_ref2.stopWhenLocalesUnawailable,folders=_ref2.folders;var strings,urlPath,res,opts,_res,localPath,data;return _regenerator2.default.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:strings=null;// Try loading data from S3
if(!s3url){_context.next=13;break;}urlPath=s3url+storage+'/current.json';_context.prev=3;_context.next=6;return(0,_got2.default)(urlPath);case 6:res=_context.sent;strings=filterFolders(JSON.parse(res.body),folders);_context.next=13;break;case 10:_context.prev=10;_context.t0=_context['catch'](3);console.error('langhelpers: Failed to load lang strings from S3 ('+urlPath+'):',_context.t0.message);case 13:if(strings){_context.next=26;break;}_context.prev=14;opts={};if(folders)opts.query={folders:folders.join(',')};_context.next=19;return(0,_got2.default)(url+storage,opts);case 19:_res=_context.sent;strings=JSON.parse(_res.body);_context.next=26;break;case 23:_context.prev=23;_context.t1=_context['catch'](14);// TODO: place logger here
console.error('langhelpers: Failed to load lang strings from lang tool:',_context.t1.message);case 26:localPath=_path2.default.resolve(__dirname,'..','cache-'+storage+'.json');// Save data to local file
if(strings&&!folders){try{_fs2.default.writeFileSync(localPath,(0,_stringify2.default)(strings));}catch(e){console.error('langhelpers: Failed to save cache:',e.message);}}// Try local file
if(!strings){try{data=_fs2.default.readFileSync(localPath,{encoding:'utf8'});strings=filterFolders(JSON.parse(data),folders);}catch(e){console.error('langhelpers: Failed to load lang strings from fs:',e.message);}}if(!(!strings&&stopWhenLocalesUnawailable)){_context.next=31;break;}throw new Error('Failed to load lang strings');case 31:// Else ignore error
if(strings)_langStorage2.default.setStrings(strings);case 32:case'end':return _context.stop();}}},_callee,this,[[3,10],[14,23]]);}));function importFromStorage(_x){return _ref.apply(this,arguments);}return importFromStorage;}();module.exports=exports['default'];