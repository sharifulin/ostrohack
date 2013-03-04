
basis.require('basis.ui');
basis.require('basis.data.dataset');
basis.require('app.router');

var namespace = 'app.module.search';

var templates = basis.template.define(namespace, resource('template/index.js').fetch());
basis.template.theme('mobile').define(namespace, resource('template/theme-mobile/index.js').fetch());

var inputDataset = new basis.data.dataset.Merge({
  active: true,
  sources: [],
  state: 'processing',
  listen: {
    source: {
      stateChanged: function(sender){
        this.setState(sender.state);
      }
    }
  },
  handler: {
    sourcesChanged: function(){
      view.setDelegate(this.sources[0]);
    },
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

var settings = new basis.data.DataObject({});
header.setDelegate(settings);

var view = new basis.ui.Node({
  template: basis.template.get('app.module.search.view'),
  delegate: inputDataset,
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
          {

            settings.update({
              destination: dest
            });

            serpRequest(this.params, dest.data.id);
          }
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
    var children = guests[1] && guests[1].split('.') || [];

    var requestData = {
      region_id: region_id,
      //destination: destinationField.getValue(),
      room1_numberOfAdults: guests[0],
      room1_numberOfChildren: children.length,
      arrivalDate: dates[0].replace(/\./g, '-'),
      departureDate: dates[1].replace(/\./g, '-')
    }

    for (var i = 1; i <= children.length; i++)
      requestData['room_child' + i + 'Age'] = children[i - 1];
    
    var dataset = app.type.Suggestion.getSearchResult(requestData);

    inputDataset.setSources([dataset]);

    // settings
    var arrivalDate = requestData.arrivalDate.split('-');
    var departureDate = requestData.departureDate.split('-');
    
    settings.update({
      room1_numberOfAdults: requestData.room1_numberOfAdults,
      room1_numberOfChildren: requestData.room1_numberOfChildren,
      arrivalDate: new Date(Number(arrivalDate[2]), Number(arrivalDate[1]) - 1, Number(arrivalDate[0])),
      departureDate: new Date(Number(departureDate[2]), Number(departureDate[1]) - 1, Number(departureDate[0]))
    });
  }

  app.router.add(/hotels\/\?(.*)/, function(query){
    var params = {};

    var parts = query.split('&');
    for (var i = 0, part; part = parts[i]; i++)
    {
      var p = part.split('=');
      params[p[0]] = p.slice(1).join('=');
    }

    var dest = app.type.Destination.get(params.q);
    if (dest)
    {
      settings.update({
        destination: dest
      });
      serpRequest(params, dest.data.id);
    }
    else
    {
      resolver.params = params;
      resolver.setDelegate(app.type.DestinationSuggestion.byQuery.getSubset(params.q, true));
    } 
  });

