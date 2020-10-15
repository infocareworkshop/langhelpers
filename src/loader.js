import _ from 'lodash';
import fs from 'fs';
import got from 'got';
import path from 'path';
import langStorage from './langStorage';

function filterFolders (langStrings, allowedFolders) {
  if (!allowedFolders)
    return langStrings;

  return _.mapValues(langStrings, (folders) => _.pick(folders, allowedFolders));
}

/**
 * Load lang strings from localization server
 * @return {Promise}
 */
export default async function importFromStorage({ url, s3url = null, storage, stopWhenLocalesUnawailable, folders }) {
  let strings = null;

  // Try loading data from S3
  if (s3url) {
    const urlPath = s3url + storage + '/current.json';
    try {
      const res = await got(urlPath);
      strings = filterFolders(JSON.parse(res.body), folders);
    } catch (e) {
      console.error(`langhelpers: Failed to load lang strings from S3 (${urlPath}):`, e.message);
    }
  }

  // Try API
  if (!strings) {
    try {
      let opts = {};
      if (folders)
        opts.query = { folders: folders.join(',') };

      const res = await got(url + storage, opts)
      strings = JSON.parse(res.body);
    } catch (e) {
      // TODO: place logger here
      console.error('langhelpers: Failed to load lang strings from lang tool:', e.message);
    }
  }

  const localPath = path.resolve(__dirname, '..', `cache-${storage}.json`);

  // Save data to local file
  if (strings && !folders) {
    try {
      fs.writeFileSync(localPath, JSON.stringify(strings));
    } catch (e) {
      console.error('langhelpers: Failed to save cache:', e.message);
    }
  }

  // Try local file
  if (!strings) {
    try {
      const data = fs.readFileSync(localPath, { encoding: 'utf8' });
      strings = filterFolders(JSON.parse(data), folders);
    } catch (e) {
      console.error('langhelpers: Failed to load lang strings from fs:', e.message);
    }
  }

  if (!strings && stopWhenLocalesUnawailable) {
    throw new Error('Failed to load lang strings');
  } // Else ignore error

  if (strings)
    langStorage.setStrings(strings);
}
