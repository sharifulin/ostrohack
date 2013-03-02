basis.require('basis.data.dataset');

var FilterMerge = basis.data.dataset.Merge.subclass({
  event_sourcesChanged: function(delta){
    basis.data.dataset.Merge.prototype.event_sourcesChanged.call(this, delta);
    
    if (this.sources.length)
      app.search.output.addSource(this);
    else
      app.search.output.removeSource(this);
  }
});

module.exports = {
  FilterMerge: FilterMerge
};