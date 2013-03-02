basis.require('basis.l10n');
basis.require('basis.data.dataset');
basis.require('basis.ui');

var namespace = 'app.module.search.filters.amenities';

basis.l10n.createDictionary(namespace, __dirname + 'l10n', {
  title: 'Amenities',
  internet: 'internet',
  breakfast: 'free breakfast',
  parking: 'parking'
});

var splitByAmenities = new basis.data.dataset.Cloud({
  source: app.search.input,
  rule: 'data.amenities'
});
var amenitiesMerge = new basis.data.dataset.Merge({
  rule: basis.data.dataset.Merge.INTERSECTION,
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
      name: 'data:'
    },
    action: {
      check: function(event){
        if (event.sender.checked)
          this.select();
        else
          this.unselect();
      }
    },

    handler: {
      select: function(){
        amenitiesMerge.addSource(this.data.dataset);
      },
      unselect: function(){
        amenitiesMerge.removeSource(this.data.dataset);
      }
    }
  },

  childNodes: basis.data([
    {
      name: 'internet',
      title: basis.l10n.token(namespace, 'internet'),
      dataset: splitByAmenities.getSubset('internet', true)
    },
    {
      name: 'breakfast',
      title: basis.l10n.token(namespace, 'breakfast'),
      dataset: splitByAmenities.getSubset('breakfast', true)
    },
    {
      name: 'parking',
      title: basis.l10n.token(namespace, 'parking'),
      dataset: splitByAmenities.getSubset('parkovka', true)
    }
  ])
});
