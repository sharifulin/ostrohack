basis.require('basis.l10n');
basis.require('basis.ui');
basis.require('app.ext');

var namespace = 'app.module.search.module.header';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  newSearch: 'New search',
  findLabelFake: 'Found some hotels in a region',
  found: 'Found',
  hotel1: 'hotel',
  hotel2: 'hotels',
  hotel3: 'hotels',
  processing: 'Looking for hotels...'
});

var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());

var searchFormPopup = basis.resource('src/module/searchFormPopup/index.js');

var results = new basis.ui.Node({
  delegate: app.search.source,
  template: templates.searchResults,
  binding: {
    count: 'data:resultCount',
    region: {
      events: 'update',
      getter: function(node){
        return node.data.region && node.data.region['locative_in_' + basis.l10n.getCulture().split('-')[0]];
      }
    },
    hotelText: {
      events: 'update',
      getter: function(node){
        switch (app.utils.plural(node.data.resultCount || 1))
        {
          case 1: return basis.l10n.getToken(namespace, 'hotel1');
          case 2: return basis.l10n.getToken(namespace, 'hotel2');
          default:
            return basis.l10n.getToken(namespace, 'hotel3');
        }
      }
    }
  }
});
basis.l10n.onCultureChange(function(){
  results.updateBind('region');
});

module.exports = new basis.ui.Node({
  template: templates.view,
  binding: {
    settings: new app.ext.Settings({}),
    results: results
  },
  action: {
    newSearch: function(){
      searchFormPopup().setDelegate(this.root);
      searchFormPopup().open();
    }
  }
});