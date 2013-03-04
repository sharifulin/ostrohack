basis.require('basis.l10n');

// settings for l10n
basis.l10n.setCultureList('ru-RU en-US');
basis.l10n.setCulture('ru-RU');

basis.l10n.createDictionary('app.currency.name', __dirname + 'l10n', {
  rub: 'RUB',
  usd: 'USD'
});
basis.l10n.createDictionary('app.currency.label', __dirname + 'l10n', {
  rub: 'rub.',
  usd: '$'
});

basis.l10n.createDictionary('app.distance.label', __dirname + 'l10n', {
  km: 'km'
});

basis.l10n.createDictionary('app.menu', __dirname + 'l10n', {
  faq: 'FAQ',
  about: 'About Us',
  contact: 'Contact Us',
  signin: 'Sign in',
  signup: 'Sign up',
  press: 'Press',
  jobs: 'Jobs',
  company: 'Company',
  contacts: 'Contact Us',
  feedback: 'Feedback',
  partners: 'Partnership',
  popular: 'Popular destionations',
  mobile: 'Mobile',
  wesocial: 'Find us in Social Networks',
  search: 'Search',
  login: 'Login',
  full: 'Full version',
  lang: 'Language'
});

app.l10n = {
  cultureTitle: {
    'ru-RU': 'Русский',
    'en-US': 'English'
  }
};