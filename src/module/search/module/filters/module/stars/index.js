basis.require('basis.data.dataset');
basis.require('basis.l10n');
basis.require('basis.ui');
basis.require('app.ext');

basis.l10n.createDictionary('app.module.search.filters.stars', __dirname + 'l10n', {
  title: 'Count of starts'
});

var starMerge = new app.ext.FilterMerge();
var splitByStar = new basis.data.dataset.Split({
  source: app.search.input,
  rule: function(item){
    return item.data.star_rating / 10;
  }
});

module.exports = new basis.ui.Node({
  template: resource('template/list.tmpl'),

  selection: {
    multiple: true,
    handler: {
      datasetChanged: function(){
        starMerge.setSources(this.getItems().map(function(item){
          return item.delegate;
        }));
      }
    }
  },
  childClass: {
    template: resource('template/item.tmpl'),
    binding: {
      title: 'data:'
    },
    action: {
      check: function(event){
        if (event.sender.checked)
          this.select(true);
        else
          this.unselect();
      }
    }
  },
  childNodes: basis.array.create(6, function(idx){
    return splitByStar.getSubset(idx, true);
  })
});