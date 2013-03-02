basis.require('basis.l10n');
basis.require('basis.ui');
basis.require('basis.data.dataset');

basis.l10n.createDictionary('app.module.search.filters.cities', __dirname + 'l10n', {
  title: 'City of region'
});

var cityMerge = new basis.data.dataset.Merge({
  handler: {
    sourcesChanged: function(){
      if (this.sources.length)
        app.search.output.addSource(this);
      else
        app.search.output.removeSource(this);      
    }
  }
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
    action: {
      check: function(event){
        if (event.sender.checked)
          this.select();
        else
          this.unselect();
      }
    },

    listen: {
      delegate: {
        datasetChanged: function(){
          this.updateBind('count');
        }
      }
    },
    handler: {
      select: function(){
        cityMerge.addSource(this.delegate);
      },
      unselect: function(){
        cityMerge.removeSource(this.delegate);
      }
    }
  },

  dataSource: new basis.data.dataset.Split({
    source: app.search.input,
    rule: 'data.city'
  })
});
