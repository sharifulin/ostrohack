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

var toolbar = new basis.ui.Node({
  autoDelegate: true,

  template: resource('template/sorting.tmpl'),

  event_sortChanged: basis.event.create('sortChanged'),
  selection: true,
  listen: {
    selection: {
      datasetChanged: function(selection){
        var selected = selection.pick();
        if (selected)
        {
          this.sortFn = selected.sortFn;
          this.sortOrderDesc = selected.sortOrderDesc;
          this.event_sortChanged();
        }
      }
    }
  },
  childClass: {
    template: resource('template/sortingButton.tmpl'),
    binding: {
      title: 'title',
      hidden: 'hidden'
    }
  },
  childNodes: [
    {
      title: basis.l10n.getToken(namespace, 'sorting', 'popularity'),
      sortFn: basis.getter('data.name'),
      sortOrderDesc: true, 
      selected: true
    },
    {
      title: basis.l10n.getToken(namespace, 'sorting', 'rating'),
      sortFn: basis.getter('data.rating'),
      sortOrderDesc: true
    },
    {
      title: basis.l10n.getToken(namespace, 'sorting', 'price'),
      sortFn: basis.getter('data.price'),
      invert: true
    },
    {
      title: basis.l10n.getToken(namespace, 'sorting', 'distance'),
      sortFn: basis.getter('data.distance'),
      invert: true,
      hidden: true,

      autoDelegate: true,
      handler: {
        update: function(){
          this.hidden = !this.data.center;
          this.updateBind('hidden');
        }
      }
    }
  ]
});

module.exports = toolbar;
