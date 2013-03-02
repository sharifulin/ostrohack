basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.search.filters.price', __dirname + 'l10n', {
  title: 'Price of',
  nights: 'nights',
  label: 'Pay',
  beforeHotel: 'before',
  inHotel: 'in hotel'
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  binding: {
  },
  action: {
  }
});