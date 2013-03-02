basis.require('basis.l10n');
basis.require('basis.data.dataset');
basis.require('basis.ui');

var namespace = 'app.module.search.filters.type';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  title: 'Hotel type',
  Hotel: 'Hotel',
  Apartment: 'Apartment',
  Guesthouse: 'Guesthouse',
  Hostel: 'Hostel',
  'Mini-hotel': 'Mini-hotel',
  Sanatorium: 'Sanatorium'
});

module.exports = new basis.ui.Node({
  template: resource('template/list.tmpl'),
  
  childClass: {
    template: resource('template/item.tmpl'),
    binding: {
      id: 'data:',
      title: function(node) {
        return basis.l10n.getToken(namespace, node.data.id);
      }
    }
  },

  dataSource: new basis.data.dataset.Split({
    source: app.search.input,
    rule: 'data.kind'
  })
});
