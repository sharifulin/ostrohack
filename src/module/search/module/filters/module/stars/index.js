basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.search.filters.stars', __dirname + 'l10n', {
  title: 'Count of starts'
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  binding: {
  },
  action: {
  }
});