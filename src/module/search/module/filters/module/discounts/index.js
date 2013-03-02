basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.search.filters.discounts', __dirname + 'l10n', {
  title: 'Discounts',
  label: 'Label',
  hint: 'Hint'
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  binding: {
  },
  action: {
  }
});