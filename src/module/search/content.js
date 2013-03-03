
  basis.require('basis.ui');
  basis.require('basis.data.dataset');
  basis.require('app.router');

  var inputDataset = new basis.data.dataset.Merge({
    active: true,
    sources: [],
    listen: {
      source: {
        stateChanged: function(sender){
          this.setState(sender.state);
        }
      }
    },
    handler: {
      stateChanged: function(){
        if (this.state != basis.data.STATE.READY)
          view.disable();
        else
          view.enable();
      }
    }
  });
  var outputDataset = new basis.data.dataset.Merge({
    sources: [
      inputDataset
    ],
    rule: basis.data.dataset.Merge.INTERSECTION
  });

  app.search = {
    input: inputDataset,
    output: outputDataset
  };

  var hotels = resource('module/hotels/index.js').fetch();
  var filters = resource('module/filters/index.js').fetch();
  var header = resource('module/header/index.js').fetch();

  var view = new basis.ui.Node({
    template: resource('template/view.tmpl'),
    binding: {
      hotels: hotels,
      filters: filters,
      header: header
    }
  });
  // basis bug, satellite do not disable on add to owner via binding
  view.disable();

  module.exports = view;


  //
  // router
  //

  var resolver = new basis.data.Object({
    active: true,
    handler: {
      stateChanged: function(){
        if (this.state == basis.data.STATE.READY)
        {
          var dest = app.type.Destination.get(this.params.q);
          if (dest)
            serpRequest(this.params, dest.data.id);
          this.setDelegate();
        }
        if (this.state == basis.data.STATE.ERROR)
          this.setDelegate();
      }
    }
  });

  function serpRequest(params, region_id){
    // set convertation to params -> filters
    var dates = params.dates.split('-');
    var guests = params.guests.split('and');
    var dataset = app.type.Suggestion.getSearchResult({
      region_id: region_id,
      //destination: destinationField.getValue(),
      room1_numberOfAdults: guests[0],
      arrivalDate: dates[0].replace(/\./g, '-'),
      departureDate: dates[1].replace(/\./g, '-')
    });

    inputDataset.setSources([dataset]);
  }

  app.router.add(/hotels\/\?(.*)/, function(query){
    var params = {};

    var parts = query.split('&');
    for (var i = 0, part; part = parts[i]; i++)
    {
      var p = part.split('=');
      params[p[0]] = p.slice(1).join('=');
    }
    console.log(params);

    var dest = app.type.Destination.get(params.q);
    if (dest)
      serpRequest(params, dest.data.id);
    else
    {
      resolver.params = params;
      resolver.setDelegate(app.type.DestinationSuggestion.byQuery.getSubset(params.q, true));
    } 
  });
