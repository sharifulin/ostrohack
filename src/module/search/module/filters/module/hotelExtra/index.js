basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.hotelExtra', __dirname + 'l10n', {
});

module.exports = new basis.ui.Node({
  template: resource('template/list.tmpl'),
  
  childClass: {
    template: resource('template/item.tmpl'),
    binding: {
      title: 'data:',
      name: 'data:'
    }
  },

  childNodes: [
    {
      data: {
        name: 'internet',
        title: 'Интернет'
      }
    },
    {
      data: {
        name: 'breakfast',
        title: 'Бесплатный завтрак'
      }
    },
    {
      data: {
        name: 'parking',
        title: 'Парковка'
      }
    }
  ]
});