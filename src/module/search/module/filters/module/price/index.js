basis.require('basis.l10n');
basis.require('basis.ui');

var namespace = 'app.module.search.filters.price';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  title: 'Price of',
  night1: 'night',
  night2: 'nights',
  night3: 'nights',
  label: 'Pay',
  beforeHotel: 'before',
  inHotel: 'in hotel'
});

basis.l10n.createDictionary(namespace + '.night', __dirname + 'l10n', {
  price_for: 'Price for',
});

module.exports = new basis.ui.Node({
  autoDelegate: true,
  disabled: true,

  template: resource('template/view.tmpl'),
  binding: {
    nights: {
      events: 'update',
      getter: function(node){
        return node.data.nights || 1;
      }
    },
    nightsText: {
      events: 'update',
      getter: function(node){
        return basis.l10n.getToken('app.module.search.filters.price', 'night' + app.utils.plural(node.data.nights || 1));
      }
    }
  }
});