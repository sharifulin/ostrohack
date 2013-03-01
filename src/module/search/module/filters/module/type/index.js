basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.hotelType', __dirname + 'l10n', {
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
        return basis.l10n.getToken('app.module.hotelType', node.data.id);
      }
    }
  },

  dataSource: new basis.data.dataset.Split({
    source: app.type.Suggestion.all,
    rule: 'data.kind'
  })
});
