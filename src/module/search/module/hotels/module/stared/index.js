basis.require('basis.l10n');
basis.require('basis.ui');

var namespace = 'app.module.search.hotels.stared';
basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  noFavorite: 'No favorite hotels'
});

var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());

module.exports = new basis.ui.Node({
  template: templates.view,
  binding: {
    //count: basis.data.index.count()
  },
  action: {
  }
});