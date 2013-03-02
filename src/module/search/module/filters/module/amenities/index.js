basis.require('basis.l10n');
basis.require('basis.ui');

var namespace = 'app.module.search.filters.amenities';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  title: 'Amenities',
  internet: 'internet',
  breakfast: 'free breakfast',
  parking: 'parking'
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

  childNodes: basis.data([
    {
      name: 'internet',
      title: basis.l10n.token(namespace, 'internet')
    },
    {
      name: 'breakfast',
      title: basis.l10n.token(namespace, 'breakfast')
    },
    {
      name: 'parking',
      title: basis.l10n.token(namespace, 'parking')
    }
  ])
});