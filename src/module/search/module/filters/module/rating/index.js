basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.search.filters.rating', __dirname + 'l10n', {
  title: 'Rating',
  label: 'and more'
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  binding: {
  },
  action: {
  }
});