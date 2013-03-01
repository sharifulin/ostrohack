basis.require('basis.l10n');
basis.require('basis.ui');

basis.l10n.createDictionary('app.module.hotelType', __dirname + 'l10n', {
});

module.exports = new basis.ui.Node({
  template: resource('template/list.tmpl'),
  
  childClass: {
    template: resource('template/item.tmpl'),
    binding: {
      title: 'data:'
    }
  },

  childNodes: [
    {
      data: {
        name: 'Hotel',
        title: 'Отель'
      }
    },
    {
      data: {
        name: 'Apartment',
        title: 'Апартаменты'
      }
    },
    {
      data: {
        name: 'Guesthouse',
        title: 'Гостевой дом'
      }
    },
    {
      data: {
        name: 'Hostel',
        title: 'Хостел'
      }
    }
  ]
});
