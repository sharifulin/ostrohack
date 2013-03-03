basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.search.filters.name', __dirname + 'l10n', {
  placeholder: 'Name of hotel'
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  disabled: true
});