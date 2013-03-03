basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.search.filters.location', __dirname + 'l10n', {
  title: 'Location',
  label: 'km around center',
  hint: 'Hotels on the map'
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  disabled: true
});