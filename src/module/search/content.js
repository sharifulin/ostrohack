
  basis.require('basis.ui');
  basis.require('basis.data.dataset');
  basis.require('app.router');

  var inputDataset = new basis.data.dataset.Merge({
    active: true,
    sources: []
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

  var list = resource('module/list/index.js').fetch();
  var filters = resource('module/filters/index.js').fetch();
  var header = resource('module/header/index.js').fetch();

  app.router.add(/search\/\?(.*)/, function(query){
    var params = {};

    var parts = query.split('&');
    for (var i = 0, part; part = parts[i]; i++)
    {
      var p = part.split('=');
      params[p[0]] = p.slice(1).join('=');
    }
    console.log(params);

    // set convertation to params -> filters
    var dataset = app.type.Suggestion.getSearchResult({
      region_id: 2395,
      //destination: destinationField.getValue(),
      room1_numberOfAdults: 2,
      arrivalDate: '2013-04-19',
      departureDate: '2013-04-20'
    });

    inputDataset.setSources([dataset]);
  });


  module.exports = new basis.ui.Node({
    template: resource('template/view.tmpl'),
    binding: {
      list: list,
      filters: filters,
      header: header
    }
  });
