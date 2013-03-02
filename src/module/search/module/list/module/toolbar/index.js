basis.require('basis.l10n');
basis.require('basis.ui');

var namespace = 'app.module.search.toolbar';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
});

basis.l10n.createDictionary(namespace + '.sorting', __dirname + 'l10n', {
  popularity: 'popularity',
  rating: 'rating',
  price: 'price',
  distance: 'distance'
});

var sorting = new basis.ui.Node({
  template: resource('template/sorting.tmpl'),

  selection: true,
  childClass: {
    template: resource('template/sortingButton.tmpl'),
    binding: {
      title: 'title'
    }
  },
  childNodes: [
    {
      title: basis.l10n.getToken(namespace, 'sorting', 'popularity'),
      sortFn: basis.getter('data.title'),
      selected: true
    },
    {
      title: basis.l10n.getToken(namespace, 'sorting', 'rating'),
      sortFn: basis.getter('data.title')
    },
    {
      title: basis.l10n.getToken(namespace, 'sorting', 'price'),
      sortFn: basis.getter('data.title')
    },
    {
      title: basis.l10n.getToken(namespace, 'sorting', 'distance'),
      sortFn: basis.getter('data.title')
    }
  ]
});

module.exports = new basis.ui.Node({
  template: resource('template/view.tmpl'),
  binding: {
    sorting: sorting
  }
});