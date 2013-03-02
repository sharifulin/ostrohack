basis.require('basis.l10n');
basis.require('basis.data.dataset');
basis.require('basis.ui');

var namespace = 'app.module.search.filters.type';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  title: 'Hotel type',
  Hotel: 'Hotel',
  Apartment: 'Apartment',
  Guesthouse: 'Guesthouse',
  Hostel: 'Hostel',
  'Mini-hotel': 'Mini-hotel',
  Sanatorium: 'Sanatorium'
});

var typeMerge = new basis.data.dataset.Merge({
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

  dataSource: new basis.data.dataset.Split({
    source: app.search.input,
    rule: 'data.kind'
  }),
  
  selection: {
    multiple: true,
    handler: {
      datasetChanged: function(){
        typeMerge.setSources(this.getItems().map(basis.getter('delegate')));
      }
    }
  },
  childClass: {
    template: resource('template/item.tmpl'),
    binding: {
      id: 'data:',
      title: function(node) {
        return basis.l10n.token(namespace, node.data.id);
      }
    },
    action: {
      check: function(event){
        if (event.sender.checked)
          this.select(true);
        else
          this.unselect();
      }
    },
  }
});
