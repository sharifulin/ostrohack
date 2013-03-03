basis.require('basis.l10n');
basis.require('basis.ui');

var namespace = 'app.module.search.hotels.sorting';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  popularity: 'popularity',
  rating: 'rating',
  price: 'price',
  distance: 'distance'
});

<<<<<<< Updated upstream
var toolbar = new basis.ui.Node({
  autoDelegate: true,

  template: resource('template/sorting.tmpl'),
=======
var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());

module.exports = new basis.ui.Node({
  template: templates.view,
>>>>>>> Stashed changes

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
    template: templates.button,
    binding: {
      title: 'title',
      hidden: 'hidden'
    }
  },
  childNodes: [
    {
      title: basis.l10n.getToken(namespace, 'popularity'),
      sortFn: basis.getter('data.name'),
      sortOrderDesc: true, 
      selected: true
    },
    {
      title: basis.l10n.getToken(namespace, 'rating'),
      sortFn: basis.getter('data.rating'),
      sortOrderDesc: true
    },
    {
      title: basis.l10n.getToken(namespace, 'price'),
      sortFn: basis.getter('data.price'),
      invert: true
    },
    {
      title: basis.l10n.getToken(namespace, 'distance'),
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
