basis.require('basis.l10n');
basis.require('basis.ui');
basis.require('basis.data.dataset');

basis.l10n.createDictionary('app.module.search.filters.cities', __dirname + 'l10n', {
  title: 'City of region'
});

module.exports = new basis.ui.Node({
  template: resource('template/list.tmpl'),
  
  childClass: {
    template: resource('template/item.tmpl'),
    binding: {
      title: 'data:',
      count: function(node){
        return node.delegate.itemCount;
      }
    },
    listen: {
      delegate: {
        datasetChanged: function(){
          this.updateBind('count');
        }
      }
    }
  },

  dataSource: new basis.data.dataset.Split({
    source: app.type.Suggestion.all,
    rule: 'data.city'
  })
});
