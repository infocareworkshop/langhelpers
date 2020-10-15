'use strict';

const langFactory = require('../build/lang');
const storage = require('../build/langStorage').default;
const chai = require('chai');

const sample = {
  en: {
    common: {
      _: 'Default for common',
      hello1: 'Hello {0}!',
      hello2: 'Hello {user.name}!',
      defaultUser: 'User'
    }
  },
  sv: {
    common: {
      _: 'Standard för common',
      hello1: 'Hej {0}!',
      hello2: 'Hej {user.name}!',
      defaultUser: 'Användare'
    }
  },
};

describe('storage', () => {
  it('should work', () => {
    storage.setStrings(sample);
    chai.expect(storage.getStrings()).to.deep.equal(sample);
  });
});

describe('lang', () => {
  beforeEach(() => {
    storage.setStrings(sample);
  });

  it('default key', () => {
    const lang = langFactory('en');
    chai.expect(lang('common')).to.equal('Default for common');
  });

  it('simple', () => {
    const lang = langFactory();
    lang.setLocale('en');
    chai.expect(lang('common.defaultUser')).to.equal('User');
  });

  it('locale in param', () => {
    const lang = langFactory('en');
    chai.expect(lang('common.defaultUser')).to.equal('User');
  });

  it('numeric placeholder', () => {
    const lang = langFactory();
    lang.setLocale('en');
    chai.expect(lang('common.hello1', ['John'])).to.equal('Hello John!');
  });

  it('path placeholder', () => {
    const lang = langFactory();
    lang.setLocale('en');
    chai.expect(lang('common.hello2', { user: { name: 'Michael' }})).to.equal('Hello Michael!');
  });

  it('lang string placeholder', () => {
    const lang = langFactory();
    lang.setLocale('en');
    chai.expect(lang('common.hello1', ['common.defaultUser'])).to.equal('Hello User!');
  });

  it('empty placeholder', () => {
    const lang = langFactory();
    lang.setLocale('en');
    chai.expect(lang('common.hello1', [null])).to.equal('Hello !');
  });

  it('multi langs', () => {
    const lang = langFactory();
    lang.setLocale('en');
    chai.expect(lang('common.hello1', ['common.defaultUser'])).to.equal('Hello User!');
    lang.setLocale('sv');
    chai.expect(lang('common.hello1', ['common.defaultUser'])).to.equal('Hej Användare!');
  });
  it('no interference', () => {
    const lang1 = langFactory();
    const lang2 = langFactory();
    lang1.setLocale('en');
    lang2.setLocale('sv');
    chai.expect(lang1('common.hello1', ['common.defaultUser'])).to.equal('Hello User!');
    chai.expect(lang2('common.hello1', ['common.defaultUser'])).to.equal('Hej Användare!');
  });
});

describe('predefined locale', () => {
  it('no locale', () => {
    storage.setStrings(sample.sv);
    const lang = langFactory();
    chai.expect(lang('common.hello1', ['common.defaultUser'])).to.equal('Hej Användare!');
  });
});

describe('changed lang strings', () => {
  it('change + multiple locales', () => {
    storage.setStrings(sample);
    const lang1 = langFactory();
    const lang2 = langFactory();
    lang1.setLocale('en');
    lang2.setLocale('sv');
    chai.expect(lang1('common.hello1', ['Michael'])).to.equal('Hello Michael!');
    chai.expect(lang2('common.hello1', ['Michael'])).to.equal('Hej Michael!');
    storage.setStrings({
      en: {
        common: {
          hello1: 'Other string {0}'
        }
      },
      sv: {
        common: {
          hello1: 'andra strängen {0}'
        }
      }
    });
    chai.expect(lang1('common.hello1', ['Michael'])).to.equal('Other string Michael');
    chai.expect(lang2('common.hello1', ['Michael'])).to.equal('andra strängen Michael');
  });
});

describe('override', () => {
  beforeEach(() => {
    storage.setStrings({
      root: {
        _: 'root',
        substring: 'substring'
      }
    });
  });

  it('override default key and substring', () => {
    const lang = langFactory();
    lang.override({
      root: {
        _: 'new root',
        substring: 'new substring'
      }
    });
    chai.expect(lang('root')).to.equal('new root');
    chai.expect(lang('root.substring')).to.equal('new substring');
  });

  it('override default key', () => {
    const lang = langFactory();
    lang.override({
      root: 'new root'
    });
    chai.expect(lang('root')).to.equal('new root');
    chai.expect(lang('root.substring')).to.equal('substring');
  });

  it('skip overriding default key', () => {
    const lang = langFactory();
    lang.override({
      root: {
        _: '',
        substring: 'new substring'
      }
    });
    chai.expect(lang('root')).to.equal('root');
    chai.expect(lang('root.substring')).to.equal('new substring');
  });

  it('skip overriding anything', () => {
    const lang = langFactory();
    lang.override({
      root: {
        _: '',
        substring: ''
      }
    });
    chai.expect(lang('root')).to.equal('root');
    chai.expect(lang('root.substring')).to.equal('substring');
  });

  it('skip overriding anything #2', () => {
    const lang = langFactory();
    lang.override({
      root: ''
    });
    chai.expect(lang('root')).to.equal('root');
    chai.expect(lang('root.substring')).to.equal('substring');
  });

  it('throw error: invalid value', () => {
    const lang = langFactory();
    chai.expect(() => {
      lang.override({
        root: {
          _: '',
          substring: []
        }
      })
    }).to.throw(Error, /invalid value$/);
  });

  it('throw error: no structure change', () => {
    const lang = langFactory();
    chai.expect(() => {
      lang.override({
        root: {
          _: '',
          substring: {
            _: 'substring',
            subsubstring: 'subsubstring'
          }
        }
      })
    }).to.throw(Error, /structure$/);
  });
});
